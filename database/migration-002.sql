-- ============================================
-- MIGRATION: Ajouter deleted_at à packages
-- Version finale corrigée
-- ============================================
-- Date: 2026-01-14
-- Description: Ajouter la colonne deleted_at pour le soft delete
--              et mettre à jour la contrainte unique

-- ============================================
-- ÉTAPE 1: Ajouter la colonne deleted_at
-- ============================================

-- Ajouter deleted_at si elle n'existe pas
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'packages' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE packages ADD COLUMN deleted_at timestamp DEFAULT NULL;
    RAISE NOTICE 'Colonne deleted_at ajoutée avec succès';
  ELSE
    RAISE NOTICE 'Colonne deleted_at existe déjà';
  END IF;
END $$;

-- ============================================
-- ÉTAPE 2: Mettre à jour la contrainte unique
-- ============================================

-- Supprimer l'ancienne contrainte
DROP INDEX IF EXISTS unique_active_package_per_rider;

-- Créer la nouvelle contrainte qui ignore les packages supprimés
CREATE UNIQUE INDEX unique_active_package_per_rider 
ON packages (rider_id) 
WHERE is_active = true AND deleted_at IS NULL;

-- Ajouter un commentaire
COMMENT ON INDEX unique_active_package_per_rider IS 
'Garantit qu''un cavalier ne peut avoir qu''un seul forfait actif et non supprimé (is_active = true AND deleted_at IS NULL).
Créé/mis à jour le 2026-01-14.';

-- ============================================
-- ÉTAPE 3: Vérification
-- ============================================

-- Vérifier que la contrainte fonctionne
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE indexname = 'unique_active_package_per_rider';

-- Compter les forfaits par statut (requête simplifiée sans ORDER BY problématique)
WITH package_status AS (
  SELECT 
    CASE 
      WHEN deleted_at IS NOT NULL THEN 'Supprimé'
      WHEN is_active = true THEN 'Actif'
      ELSE 'Inactif'
    END as status,
    CASE 
      WHEN deleted_at IS NOT NULL THEN 3
      WHEN is_active = true THEN 1
      ELSE 2
    END as sort_order
  FROM packages
)
SELECT 
  status,
  COUNT(*) as count
FROM package_status
GROUP BY status, sort_order
ORDER BY sort_order;

-- Vérifier qu'il n'y a pas de doublons (actifs non supprimés)
SELECT 
  rider_id,
  COUNT(*) as active_packages_count
FROM packages
WHERE is_active = true AND deleted_at IS NULL
GROUP BY rider_id
HAVING COUNT(*) > 1;
-- Devrait retourner 0 lignes

-- ============================================
-- RÉSUMÉ
-- ============================================

DO $$
DECLARE
  total_packages INTEGER;
  active_packages INTEGER;
  inactive_packages INTEGER;
  deleted_packages INTEGER;
  constraint_exists BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO total_packages FROM packages;
  SELECT COUNT(*) INTO active_packages FROM packages WHERE is_active = true AND deleted_at IS NULL;
  SELECT COUNT(*) INTO inactive_packages FROM packages WHERE is_active = false AND deleted_at IS NULL;
  SELECT COUNT(*) INTO deleted_packages FROM packages WHERE deleted_at IS NOT NULL;
  
  SELECT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'unique_active_package_per_rider'
  ) INTO constraint_exists;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RÉSUMÉ - Migration deleted_at';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total forfaits: %', total_packages;
  RAISE NOTICE 'Forfaits actifs: %', active_packages;
  RAISE NOTICE 'Forfaits inactifs: %', inactive_packages;
  RAISE NOTICE 'Forfaits supprimés: %', deleted_packages;
  RAISE NOTICE 'Contrainte unique active: %', CASE WHEN constraint_exists THEN 'OUI ✓' ELSE 'NON ✗' END;
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;

-- ============================================
-- ROLLBACK (si nécessaire)
-- ============================================

/*
-- Supprimer la contrainte
DROP INDEX IF EXISTS unique_active_package_per_rider;

-- Recréer l'ancienne contrainte (sans deleted_at)
CREATE UNIQUE INDEX unique_active_package_per_rider 
ON packages (rider_id) 
WHERE is_active = true;

-- Supprimer la colonne deleted_at (ATTENTION: perte de données!)
ALTER TABLE packages DROP COLUMN IF EXISTS deleted_at;
*/