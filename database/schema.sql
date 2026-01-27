-- -----------------------
-- ENUM TYPES
-- -----------------------
CREATE TYPE horse_type AS ENUM ('pony', 'horse');
CREATE TYPE owner_type AS ENUM ('laury', 'private_owner', 'club', 'other');
CREATE TYPE rider_type AS ENUM ('owner', 'club', 'boarder');
CREATE TYPE planning_slot_type AS ENUM ('lesson', 'blocked', 'service', 'boarder_free_time');
CREATE TYPE lesson_status AS ENUM ('scheduled', 'confirmed', 'cancelled', 'blocked');
CREATE TYPE horse_assignment_type AS ENUM ('primary', 'secondary', 'backup');

-- -----------------------
-- TABLES
-- -----------------------

CREATE TABLE horses (
    id integer NOT NULL PRIMARY KEY,
    name varchar NOT NULL UNIQUE,
    kind horse_type NOT NULL,
    activity_start_date date,
    activity_end_date date,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    ownership_type owner_type NOT NULL,
    deleted_at timestamp
);

CREATE TABLE riders (
    id integer NOT NULL PRIMARY KEY,
    name varchar NOT NULL,
    phone varchar UNIQUE,
    email varchar UNIQUE,
    activity_start_date date,
    activity_end_date date,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    rider_type rider_type NOT NULL,
    deleted_at timestamp
);

CREATE TABLE rider_horse_pairings (
    id integer NOT NULL PRIMARY KEY,
    rider_id integer NOT NULL,
    horse_id integer NOT NULL,
    pairing_start_date date,
    pairing_end_date date,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT rider_horse_associations_rider_id_fkey FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE,
    CONSTRAINT rider_horse_associations_horse_id_fkey FOREIGN KEY (horse_id) REFERENCES horses(id) ON DELETE CASCADE,
    CONSTRAINT unique_rider_horse_period UNIQUE (rider_id, horse_id, pairing_start_date)
);

CREATE TABLE planning_slots (
    id integer NOT NULL PRIMARY KEY,
    start_at timestamp NOT NULL,
    end_at timestamp NOT NULL,
    all_day boolean NOT NULL,
    type planning_slot_type NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT chk_slot_time CHECK (end_at > start_at)
);

CREATE TABLE lessons (
    id integer NOT NULL PRIMARY KEY,
    planning_slot_id integer NOT NULL,
    lesson_type varchar NOT NULL,
    status lesson_status NOT NULL,
    instructor_id integer NOT NULL,
    actual_instructor_id integer,
    min_participants integer CHECK (min_participants >= 0),
    max_participants integer CHECK (max_participants >= 0),
    cancellation_reason text,
    is_modified boolean NOT NULL DEFAULT false,
    modified_fields jsonb,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    deleted_at timestamp,
    CONSTRAINT lessons_planning_slot_id_fkey FOREIGN KEY (planning_slot_id) REFERENCES planning_slots(id) ON DELETE CASCADE,
    CONSTRAINT unique_lesson_per_slot UNIQUE (planning_slot_id, lesson_type)
);

CREATE TABLE lesson_participants (
    id integer NOT NULL PRIMARY KEY,
    lesson_id integer NOT NULL,
    rider_id integer NOT NULL,
    horse_id integer,
    horse_assignment_type horse_assignment_type NOT NULL,
    registered_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT lesson_participants_new_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    CONSTRAINT unique_participant_per_lesson UNIQUE (lesson_id, rider_id)
);

CREATE TABLE packages (
    id integer NOT NULL PRIMARY KEY,
    services_per_week integer NOT NULL CHECK (services_per_week >= 0),
    private_lessons_per_week integer NOT NULL CHECK (private_lessons_per_week >= 0),
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    rider_id integer NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    CONSTRAINT fk_packages_rider FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE
);

-- -----------------------
-- INDEXES
-- -----------------------
CREATE INDEX idx_lesson_participants_rider_id ON lesson_participants(rider_id);
CREATE INDEX idx_lesson_participants_horse_id ON lesson_participants(horse_id);
CREATE INDEX idx_lessons_instructor_id ON lessons(instructor_id);
CREATE INDEX idx_rider_horse_pairings_rider_id ON rider_horse_pairings(rider_id);
CREATE INDEX idx_rider_horse_pairings_horse_id ON rider_horse_pairings(horse_id);
