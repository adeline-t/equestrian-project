BEGIN;

CREATE TABLE recurrence_participants (
    id integer PRIMARY KEY,
    recurrence_id integer NOT NULL,
    rider_id integer NOT NULL,
    horse_id integer,
    horse_assignment_type horse_assignment_type NOT NULL,

    created_at timestamp NOT NULL DEFAULT now(),
    updated_at timestamp NOT NULL DEFAULT now(),

    CONSTRAINT recurrence_participants_recurrence_fkey
        FOREIGN KEY (recurrence_id)
        REFERENCES recurrences(id)
        ON DELETE CASCADE,

    CONSTRAINT recurrence_participants_rider_fkey
        FOREIGN KEY (rider_id)
        REFERENCES riders(id)
        ON DELETE CASCADE,

    CONSTRAINT recurrence_participants_horse_fkey
        FOREIGN KEY (horse_id)
        REFERENCES horses(id)
        ON DELETE SET NULL
);

CREATE UNIQUE INDEX unique_recurrence_participant
ON recurrence_participants (recurrence_id, rider_id);


ALTER TABLE lesson_participants
ADD COLUMN planning_slot_id integer;
ALTER TABLE lesson_participants
ADD CONSTRAINT lesson_participants_planning_slot_fkey
FOREIGN KEY (planning_slot_id)
REFERENCES planning_slots(id)
ON DELETE CASCADE;
ALTER TABLE lesson_participants
ADD COLUMN is_cancelled boolean NOT NULL DEFAULT false;
ALTER TABLE lesson_participants
DROP CONSTRAINT unique_participant_per_lesson;
CREATE UNIQUE INDEX unique_participant_per_lesson_slot
ON lesson_participants (lesson_id, planning_slot_id, rider_id);
ALTER TABLE lesson_participants
ALTER COLUMN planning_slot_id SET NOT NULL;
CREATE INDEX idx_lesson_participants_slot
ON lesson_participants (planning_slot_id);

CREATE INDEX idx_lesson_participants_active
ON lesson_participants (planning_slot_id)
WHERE is_cancelled = false;
COMMIT;
