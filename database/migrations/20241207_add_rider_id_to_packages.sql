-- Migration: Add rider_id foreign key to packages table
-- Generated: 2024-12-07
-- Purpose: Establish one-to-many relationship between riders and packages

-- Add rider_id column to packages table
ALTER TABLE packages 
ADD COLUMN rider_id INTEGER;

-- Add foreign key constraint with CASCADE delete
-- When a rider is deleted, their packages are also deleted
ALTER TABLE packages
ADD CONSTRAINT fk_packages_rider
FOREIGN KEY (rider_id) 
REFERENCES riders(id) 
ON DELETE CASCADE;

-- Create index on rider_id for better query performance
CREATE INDEX idx_packages_rider_id ON packages(rider_id);

-- Add comment to document the relationship
COMMENT ON COLUMN packages.rider_id IS 'Foreign key to riders table - each package belongs to one rider';

-- Optional: Update existing packages to have a rider_id
-- Uncomment and modify if you have existing packages that need to be assigned to riders
-- UPDATE packages SET rider_id = 1 WHERE rider_id IS NULL;

-- Optional: Make rider_id NOT NULL after assigning existing packages
-- Uncomment after ensuring all packages have a rider_id
-- ALTER TABLE packages ALTER COLUMN rider_id SET NOT NULL;