-- ============================================
-- RESET COMPLET : suppression des tables et enums
-- ============================================

DROP TABLE IF EXISTS recurrence_participants CASCADE;
DROP TABLE IF EXISTS recurrences CASCADE;
DROP TABLE IF EXISTS event_participants CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS planning_slots CASCADE;
DROP TABLE IF EXISTS rider_horse_pairings CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS riders CASCADE;
DROP TABLE IF EXISTS horses CASCADE;

DROP TYPE IF EXISTS recurrence_frequency CASCADE;
DROP TYPE IF EXISTS horse_type CASCADE;
DROP TYPE IF EXISTS owner_type CASCADE;
DROP TYPE IF EXISTS rider_type CASCADE;
DROP TYPE IF EXISTS event_type CASCADE;
DROP TYPE IF EXISTS event_status CASCADE;
DROP TYPE IF EXISTS horse_assignment_type CASCADE;
DROP TYPE IF EXISTS rider_horse_link_type CASCADE;

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE recurrence_frequency AS ENUM ('daily','weekly','monthly');
COMMENT ON TYPE recurrence_frequency IS 'Frequency of a recurring event: daily, weekly, or monthly';

CREATE TYPE horse_type AS ENUM ('pony','horse');
COMMENT ON TYPE horse_type IS 'Type of horse: pony or horse';

CREATE TYPE owner_type AS ENUM ('laury','private_owner','club','other');
COMMENT ON TYPE owner_type IS 'Type of horse owner';

CREATE TYPE rider_type AS ENUM ('owner','club','loaner');
COMMENT ON TYPE rider_type IS 'Type of rider';

CREATE TYPE event_type AS ENUM ('lesson','event','blocked','service','loaner_free_time');
COMMENT ON TYPE event_type IS 'Type of event: lesson, generic event, blocked slot, service, or loaner free time';

CREATE TYPE event_status AS ENUM ('scheduled','confirmed','completed','cancelled');
COMMENT ON TYPE event_status IS 'Current status of an event';

CREATE TYPE horse_assignment_type AS ENUM ('manual','automatic');
COMMENT ON TYPE horse_assignment_type IS 'Method used to assign a horse to a rider';

CREATE TYPE rider_horse_link_type AS ENUM ('own','loan');
COMMENT ON TYPE rider_horse_link_type IS 'Whether the horse is owned by the rider or on loan';

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE horses (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar NOT NULL UNIQUE,
    kind horse_type NOT NULL,
    activity_start_date date,
    activity_end_date date,
    ownership_type owner_type NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    deleted_at timestamp
);
COMMENT ON TABLE horses IS 'Horses table';
COMMENT ON COLUMN horses.name IS 'Name of the horse';
COMMENT ON COLUMN horses.kind IS 'Type of the horse';
COMMENT ON COLUMN horses.activity_start_date IS 'Date the horse started being active';
COMMENT ON COLUMN horses.activity_end_date IS 'Date the horse stopped being active';
COMMENT ON COLUMN horses.deleted_at IS 'Soft delete timestamp';

CREATE TABLE riders (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar NOT NULL,
    phone varchar UNIQUE,
    email varchar UNIQUE,
    rider_type rider_type NOT NULL,
    activity_start_date date,
    activity_end_date date,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    deleted_at timestamp
);
COMMENT ON TABLE riders IS 'Riders table';
COMMENT ON COLUMN riders.name IS 'Full name of the rider';
COMMENT ON COLUMN riders.rider_type IS 'Type of rider';
COMMENT ON COLUMN riders.deleted_at IS 'Soft delete timestamp';

CREATE TABLE rider_horse_pairings (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    rider_id integer NOT NULL,
    horse_id integer NOT NULL,
    pairing_start_date date,
    pairing_end_date date,
    link_type rider_horse_link_type NOT NULL DEFAULT 'own',
    loan_days_per_week integer,
    loan_days jsonb DEFAULT '[]'::jsonb,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),

    CONSTRAINT fk_rhp_rider FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE,
    CONSTRAINT fk_rhp_horse FOREIGN KEY (horse_id) REFERENCES horses(id) ON DELETE CASCADE,
    CONSTRAINT unique_rider_horse_period UNIQUE (rider_id, horse_id, pairing_start_date),
    CONSTRAINT chk_loan_days_only_for_loan CHECK (
        (link_type = 'loan' AND loan_days_per_week IS NOT NULL)
        OR (link_type = 'own' AND loan_days_per_week IS NULL)
    ),
    CONSTRAINT chk_loan_days_range CHECK (
        loan_days_per_week IS NULL
        OR (loan_days_per_week BETWEEN 1 AND 7)
    )
);
COMMENT ON TABLE rider_horse_pairings IS 'Associates riders with horses, including loan info and schedule';
COMMENT ON COLUMN link_type IS 'Whether horse is owned or loaned';
COMMENT ON COLUMN loan_days_per_week IS 'Number of days per week for a loaned horse';
COMMENT ON COLUMN loan_days IS 'JSON array of week days for loaned horse';

CREATE TABLE packages (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    services_per_week integer NOT NULL CHECK (services_per_week >= 0),
    group_events_per_week integer NOT NULL CHECK (group_events_per_week >= 0),
    rider_id integer NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    deleted_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),

    CONSTRAINT fk_packages_rider FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE
);
COMMENT ON TABLE packages IS 'Rider subscription packages';
COMMENT ON COLUMN services_per_week IS 'Number of individual services per week';
COMMENT ON COLUMN group_events_per_week IS 'Number of group events per week';
COMMENT ON COLUMN is_active IS 'Indicates if the package is active';
COMMENT ON COLUMN deleted_at IS 'Soft delete timestamp';

CREATE TABLE planning_slots (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slot_status event_status NOT NULL,
    actual_instructor_id integer,
    cancellation_reason text,
    start_time timestamp NOT NULL,
    end_time timestamp NOT NULL,
    is_all_day boolean NOT NULL,
    deleted_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),
    CONSTRAINT chk_slot_time CHECK (end_time > start_time)
);
COMMENT ON TABLE planning_slots IS 'Calendar slots for events or lessons';
COMMENT ON COLUMN slot_status IS 'Status of the slot';
COMMENT ON COLUMN actual_instructor_id IS 'Instructor who actually conducted the slot';
COMMENT ON COLUMN cancellation_reason IS 'Reason for slot cancellation';
COMMENT ON COLUMN is_all_day IS 'Indicates if the slot lasts all day';
COMMENT ON COLUMN deleted_at IS 'Soft delete timestamp';

CREATE TABLE events (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    planning_slot_id integer NOT NULL,
    event_type event_type NOT NULL,
    instructor_id integer NOT NULL,
    min_participants integer CHECK (min_participants >= 0),
    max_participants integer CHECK (max_participants >= 0),
    deleted_at timestamp,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),

    CONSTRAINT fk_events_slot FOREIGN KEY (planning_slot_id) REFERENCES planning_slots(id) ON DELETE CASCADE,
    CONSTRAINT unique_event_per_slot UNIQUE (planning_slot_id, event_type, instructor_id)
);
COMMENT ON TABLE events IS 'Events scheduled in a planning slot';
COMMENT ON COLUMN event_type IS 'Type of event';
COMMENT ON COLUMN instructor_id IS 'Scheduled instructor for the event';
COMMENT ON COLUMN deleted_at IS 'Soft delete timestamp';

CREATE TABLE event_participants (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id integer NOT NULL,
    planning_slot_id integer NOT NULL,
    rider_id integer,
    horse_id integer,
    horse_assignment_type horse_assignment_type NOT NULL,
    is_cancelled boolean NOT NULL DEFAULT false,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),

    CONSTRAINT fk_ep_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_ep_slot FOREIGN KEY (planning_slot_id) REFERENCES planning_slots(id) ON DELETE CASCADE
);
COMMENT ON TABLE event_participants IS 'Participants in an event';
COMMENT ON COLUMN horse_assignment_type IS 'How horse was assigned';
COMMENT ON COLUMN is_cancelled IS 'Indicates if participant cancelled';

CREATE TABLE recurrences (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    frequency recurrence_frequency NOT NULL,
    interval integer NOT NULL DEFAULT 1 CHECK (interval > 0),
    by_week_days integer[] CHECK (by_week_days IS NULL OR by_week_days <@ ARRAY[1,2,3,4,5,6,7]),
    start_time time NOT NULL,
    end_time time NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now()
);
COMMENT ON TABLE recurrences IS 'Recurring event rules';
COMMENT ON COLUMN frequency IS 'Frequency of recurrence';
COMMENT ON COLUMN interval IS 'Recurrence interval';
COMMENT ON COLUMN by_week_days IS 'Weekdays for recurrence (1=Monday .. 7=Sunday)';
COMMENT ON COLUMN start_time IS 'Start time for recurrence';
COMMENT ON COLUMN end_time IS 'End time for recurrence';

CREATE TABLE recurrence_participants (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    recurrence_id integer NOT NULL,
    rider_id integer NOT NULL,
    horse_id integer NOT NULL,
    horse_assignment_type horse_assignment_type NOT NULL,
    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),

    CONSTRAINT fk_rp_recurrence FOREIGN KEY (recurrence_id) REFERENCES recurrences(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_rider FOREIGN KEY (rider_id) REFERENCES riders(id) ON DELETE CASCADE,
    CONSTRAINT fk_rp_horse FOREIGN KEY (horse_id) REFERENCES horses(id) ON DELETE CASCADE,
    CONSTRAINT unique_rider_horse_per_recurrence UNIQUE (recurrence_id, rider_id)
);
COMMENT ON TABLE recurrence_participants IS 'Participants assigned to a recurrence';
COMMENT ON COLUMN horse_assignment_type IS 'How horse is assigned in recurrence';
COMMENT ON CONSTRAINT unique_rider_horse_per_recurrence IS 'A rider can have only one horse per recurrence';

-- ============================================
-- INDEXES
-- ============================================

-- rider_horse_pairings
CREATE INDEX idx_rhp_rider ON rider_horse_pairings(rider_id);
CREATE INDEX idx_rhp_horse ON rider_horse_pairings(horse_id);
CREATE INDEX idx_rhp_loan_days_gin ON rider_horse_pairings USING GIN (loan_days);

-- packages
CREATE UNIQUE INDEX unique_active_package_per_rider ON packages(rider_id)
    WHERE is_active = true AND deleted_at IS NULL;
COMMENT ON INDEX unique_active_package_per_rider IS 
    'Ensures only one active package per rider that is not deleted';

-- planning_slots
CREATE INDEX idx_slots_time_range ON planning_slots(start_time, end_time)
    WHERE deleted_at IS NULL;

-- events
CREATE INDEX idx_events_instructor_id ON events(instructor_id);

-- event_participants
CREATE INDEX idx_ep_rider ON event_participants(rider_id);
CREATE INDEX idx_ep_horse ON event_participants(horse_id);
CREATE INDEX idx_ep_slot ON event_participants(planning_slot_id);
CREATE INDEX idx_ep_active ON event_participants(planning_slot_id) WHERE is_cancelled = false;

-- recurrence_participants
CREATE UNIQUE INDEX unique_rp_rider ON recurrence_participants(recurrence_id, rider_id);

