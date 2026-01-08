-- Migration: Transform is_owned_by_laury to is_owned_by with enum choices
-- Up
BEGIN;

-- Step 1: Create the new ENUM type
CREATE TYPE owner_type AS ENUM ('laury', 'private_owner', 'club');

-- Step 2: Add the new column
ALTER TABLE horses ADD COLUMN is_owned_by owner_type;

-- Step 3: Migrate data from is_owned_by_laury to is_owned_by
UPDATE horses 
SET is_owned_by = 'Laury' 
WHERE is_owned_by_laury = TRUE;

UPDATE horses 
SET is_owned_by = 'private_owner' 
WHERE is_owned_by_laury = FALSE AND is_owned_by IS NULL;

-- Step 4: Make the new column NOT NULL (optional, adjust if needed)
ALTER TABLE horses ALTER COLUMN is_owned_by SET NOT NULL;

-- Step 5: Drop the old column
ALTER TABLE horses DROP COLUMN is_owned_by_laury;

COMMIT;