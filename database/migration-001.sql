-- ============================================
-- MIGRATION: Ensure only one active package per rider
-- Date: 2026-01-14
-- ============================================

-- 1) Backup existing data
DROP TABLE IF EXISTS packages_backup_20260114;
CREATE TABLE packages_backup_20260114 AS
SELECT * FROM packages;

-- 2) Deactivate older active packages (keep most recent per rider)
WITH ranked_packages AS (
  SELECT 
    id,
    rider_id,
    ROW_NUMBER() OVER (
      PARTITION BY rider_id 
      ORDER BY created_at DESC
    ) AS rn
  FROM packages
  WHERE is_active = true
)
UPDATE packages
SET 
  is_active = false,
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM ranked_packages WHERE rn > 1
);

-- 3) Create unique partial index (one active package per rider)
DROP INDEX IF EXISTS unique_active_package_per_rider;

CREATE UNIQUE INDEX unique_active_package_per_rider 
ON packages (rider_id)
WHERE is_active = true;

COMMENT ON INDEX unique_active_package_per_rider IS 
'Guarantees that a rider can have only one active package (is_active = true). Created on 2026-01-14.';

-- 4) Final migration summary
DO $$
DECLARE
  total_packages INTEGER;
  active_packages INTEGER;
  inactive_packages INTEGER;
  riders_with_active INTEGER;
  constraint_exists BOOLEAN;
  duplicates_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_packages FROM packages;
  SELECT COUNT(*) INTO active_packages FROM packages WHERE is_active = true;
  SELECT COUNT(*) INTO inactive_packages FROM packages WHERE is_active = false;
  SELECT COUNT(DISTINCT rider_id) INTO riders_with_active FROM packages WHERE is_active = true;

  SELECT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'unique_active_package_per_rider'
  ) INTO constraint_exists;

  SELECT COUNT(*) INTO duplicates_count FROM (
    SELECT rider_id
    FROM packages
    WHERE is_active = true
    GROUP BY rider_id
    HAVING COUNT(*) > 1
  ) sub;

END $$;
