-- Riders table
CREATE TABLE riders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    activity_start_date DATE,
    activity_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Horses table
CREATE TABLE horses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    kind VARCHAR(10) NOT NULL CHECK (kind IN ('horse', 'pony')),
    activity_start_date DATE,
    activity_end_date DATE,
    is_owned_by_laury BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rider-Horse pairings table
CREATE TABLE rider_horse_pairings (
    id SERIAL PRIMARY KEY,
    rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    horse_id INTEGER NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
    pairing_start_date DATE,
    pairing_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rider_id, horse_id, pairing_start_date)
);

-- Indexes for performance
CREATE INDEX idx_riders_name ON riders(name);
CREATE INDEX idx_horses_name ON horses(name);
CREATE INDEX idx_pairings_rider ON rider_horse_pairings(rider_id);
CREATE INDEX idx_pairings_horse ON rider_horse_pairings(horse_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_riders_updated_at BEFORE UPDATE ON riders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_horses_updated_at BEFORE UPDATE ON horses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pairings_updated_at BEFORE UPDATE ON rider_horse_pairings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();