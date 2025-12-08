-- Migration: Create packages table
-- Generated: 2025-12-07
-- Model: Package

-- Create table
CREATE TABLE IF NOT EXISTS packages (
    id SERIAL PRIMARY KEY,
    private_lesson_count INTEGER NOT NULL DEFAULT 0 ,
    joint_lesson_count INTEGER NOT NULL DEFAULT 0   ,    
    activity_start_date DATE,
    activity_end_date DATE,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes

-- Create trigger for updated_at
CREATE TRIGGER update_packages_updated_at 
    BEFORE UPDATE ON packages
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE packages IS 'Forfaits - Package entities';

-- Sample data (optional - uncomment to use)
-- INSERT INTO packages (name) VALUES ('Sample Forfait');
