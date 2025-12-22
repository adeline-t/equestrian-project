-- Migration: Add owner_id to horses table
-- Up
BEGIN;

-- Step 1: Create a new column for owner_id
ALTER TABLE horses ADD COLUMN owner_id INTEGER;

-- Step 2: Add foreign key constraint to riders table (assuming owners are riders)
ALTER TABLE horses 
ADD CONSTRAINT fk_horses_owner_id 
FOREIGN KEY (owner_id) REFERENCES riders(id) ON DELETE SET NULL;

-- Step 3: Create an index for better query performance
CREATE INDEX idx_horses_owner_id ON horses(owner_id);

COMMIT;