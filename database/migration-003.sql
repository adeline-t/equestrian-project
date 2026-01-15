BEGIN;

CREATE TYPE rider_horse_link_type AS ENUM ('own', 'loan');
ALTER TABLE rider_horse_pairings
ADD COLUMN link_type rider_horse_link_type,
ADD COLUMN loan_days_per_week integer;
UPDATE rider_horse_pairings
SET link_type = 'own',
    loan_days_per_week = NULL
WHERE link_type IS NULL;
ALTER TABLE rider_horse_pairings
ALTER COLUMN link_type SET NOT NULL;
ALTER TABLE rider_horse_pairings
ADD CONSTRAINT chk_loan_days_only_for_loan
CHECK (
    (link_type = 'loan' AND loan_days_per_week IS NOT NULL)
 OR (link_type = 'own'  AND loan_days_per_week IS NULL)
);
ALTER TABLE rider_horse_pairings
ADD CONSTRAINT chk_loan_days_range
CHECK (
    loan_days_per_week IS NULL
    OR (loan_days_per_week BETWEEN 1 AND 7)
);
-- Ajouter un champ JSON pour stocker les jours de la semaine pour les pensions
ALTER TABLE rider_horse_pairings
ADD COLUMN loan_days jsonb DEFAULT '[]'::jsonb;

-- Optionnel : index pour filtrer facilement par jour
CREATE INDEX idx_rhp_loan_days_gin ON rider_horse_pairings USING GIN (loan_days);


COMMIT;
