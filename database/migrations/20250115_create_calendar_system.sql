-- Migration: Create Calendar System
-- Date: 2025-01-15
-- Description: Système complet de gestion de calendrier avec cours récurrents, plages bloquées et suivi des cours

-- ============================================
-- ÉTAPE 1: Créer les tables principales
-- ============================================

-- Table des templates de cours récurrents
CREATE TABLE lesson_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(50) NOT NULL CHECK (lesson_type IN (
        'private',      -- Cours particulier
        'group',        -- Cours collectif
        'training',     -- Stage
        'competition',  -- Concours
        'event',        -- Événement
        'blocked'       -- Plage bloquée (période de repos)
    )),
    recurrence_rule JSONB NOT NULL,
    -- Exemple de structure JSONB:
    -- {
    --   "frequency": "weekly",           // daily, weekly, monthly
    --   "interval": 1,                   // Tous les X jours/semaines/mois
    --   "byDay": ["monday", "wednesday"], // Jours de la semaine
    --   "startTime": "19:00",            // Heure de début
    --   "duration": 45,                  // Durée en minutes
    --   "startDate": "2024-01-01",       // Date de début de la récurrence
    --   "endDate": "2024-12-31"          // Date de fin (optionnelle)
    -- }
    start_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 45,
    valid_from DATE NOT NULL,
    valid_until DATE,
    max_participants INTEGER,
    min_participants INTEGER DEFAULT 1,
    instructor_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    CONSTRAINT valid_capacity CHECK (max_participants IS NULL OR max_participants >= min_participants),
    CONSTRAINT valid_duration CHECK (duration_minutes > 0),
    CONSTRAINT valid_dates CHECK (valid_until IS NULL OR valid_until >= valid_from),
    CONSTRAINT blocked_no_participants CHECK (
        lesson_type != 'blocked' OR (max_participants = 0 AND min_participants = 0)
    )
);

-- Table des instances de cours (cours réels)
CREATE TABLE lesson_instances (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES lesson_templates(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lesson_type VARCHAR(50) NOT NULL CHECK (lesson_type IN (
        'private', 'group', 'training', 'competition', 'event', 'blocked'
    )),
    lesson_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_participants INTEGER,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN (
        'scheduled',    -- Planifié
        'confirmed',    -- Confirmé
        'in_progress',  -- En cours
        'completed',    -- Terminé
        'cancelled',    -- Annulé
        'rescheduled',  -- Reporté
        'blocked'       -- Bloqué (période de repos)
    )),
    cancellation_reason TEXT,
    is_modified BOOLEAN DEFAULT FALSE,
    modified_fields JSONB,
    instructor_id INTEGER,
    -- NOUVEAU: Indicateur de cours non effectué par Laury
    not_given_by_laury BOOLEAN DEFAULT FALSE,
    not_given_reason TEXT,
    not_given_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT blocked_status CHECK (
        lesson_type != 'blocked' OR status IN ('scheduled', 'cancelled', 'blocked')
    )
);

-- Table des participants aux cours
CREATE TABLE lesson_participants (
    id SERIAL PRIMARY KEY,
    lesson_instance_id INTEGER NOT NULL REFERENCES lesson_instances(id) ON DELETE CASCADE,
    rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    horse_id INTEGER REFERENCES horses(id) ON DELETE SET NULL,
    participation_status VARCHAR(50) DEFAULT 'registered' CHECK (participation_status IN (
        'registered',   -- Inscrit
        'confirmed',    -- Confirmé
        'attended',     -- Présent
        'absent',       -- Absent
        'cancelled'     -- Annulé
    )),
    horse_assignment_type VARCHAR(50) DEFAULT 'auto' CHECK (horse_assignment_type IN (
        'auto',         -- Assigné automatiquement via DP
        'manual',       -- Assigné manuellement
        'none'          -- Pas de cheval assigné
    )),
    notes TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_instance_id, rider_id),
    -- Contrainte: pas de participants pour les plages bloquées
    CONSTRAINT no_participants_for_blocked CHECK (
        NOT EXISTS (
            SELECT 1 FROM lesson_instances li 
            WHERE li.id = lesson_instance_id AND li.lesson_type = 'blocked'
        )
    )
);

-- Table des participants par défaut des templates
CREATE TABLE template_default_participants (
    id SERIAL PRIMARY KEY,
    template_id INTEGER NOT NULL REFERENCES lesson_templates(id) ON DELETE CASCADE,
    rider_id INTEGER NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
    horse_id INTEGER REFERENCES horses(id) ON DELETE SET NULL,
    auto_assign_horse BOOLEAN DEFAULT TRUE,
    priority_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(template_id, rider_id)
);

-- Table des règles par type de cours
CREATE TABLE lesson_type_rules (
    id SERIAL PRIMARY KEY,
    lesson_type VARCHAR(50) NOT NULL UNIQUE,
    rules JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ÉTAPE 2: Créer les index pour performance
-- ============================================

-- Index pour lesson_templates
CREATE INDEX idx_lesson_templates_active ON lesson_templates(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_lesson_templates_type ON lesson_templates(lesson_type);
CREATE INDEX idx_lesson_templates_dates ON lesson_templates(valid_from, valid_until);
CREATE INDEX idx_lesson_templates_blocked ON lesson_templates(lesson_type) WHERE lesson_type = 'blocked';

-- Index pour lesson_instances (CRITIQUES)
CREATE INDEX idx_lesson_instances_date ON lesson_instances(lesson_date);
CREATE INDEX idx_lesson_instances_template ON lesson_instances(template_id);
CREATE INDEX idx_lesson_instances_status ON lesson_instances(status);
CREATE INDEX idx_lesson_instances_type ON lesson_instances(lesson_type);
CREATE INDEX idx_lesson_instances_calendar ON lesson_instances(lesson_date, start_time, status);
CREATE INDEX idx_lesson_instances_blocked ON lesson_instances(lesson_type, lesson_date, start_time, end_time) 
    WHERE lesson_type = 'blocked' AND status != 'cancelled';
CREATE INDEX idx_lesson_instances_not_given ON lesson_instances(not_given_by_laury) 
    WHERE not_given_by_laury = TRUE;

-- Index pour lesson_participants
CREATE INDEX idx_lesson_participants_lesson ON lesson_participants(lesson_instance_id);
CREATE INDEX idx_lesson_participants_rider ON lesson_participants(rider_id);
CREATE INDEX idx_lesson_participants_horse ON lesson_participants(horse_id);
CREATE INDEX idx_lesson_participants_status ON lesson_participants(participation_status);

-- Index pour template_default_participants
CREATE INDEX idx_template_participants_template ON template_default_participants(template_id);
CREATE INDEX idx_template_participants_rider ON template_default_participants(rider_id);

-- ============================================
-- ÉTAPE 3: Créer les triggers
-- ============================================

CREATE TRIGGER update_lesson_templates_updated_at 
    BEFORE UPDATE ON lesson_templates
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_instances_updated_at 
    BEFORE UPDATE ON lesson_instances
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_participants_updated_at 
    BEFORE UPDATE ON lesson_participants
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_type_rules_updated_at 
    BEFORE UPDATE ON lesson_type_rules
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ÉTAPE 4: Insérer les règles par défaut
-- ============================================

INSERT INTO lesson_type_rules (lesson_type, rules, description) VALUES
('private', '{
    "maxParticipants": 1,
    "minParticipants": 1,
    "requiresHorse": true,
    "allowsMultipleHorsesPerRider": false,
    "defaultDuration": 45,
    "allowsWaitlist": false,
    "requiresInstructor": true,
    "canBeRecurring": true,
    "canBeBlocked": true
}', 'Cours particulier - 1 cavalier maximum'),

('group', '{
    "maxParticipants": 8,
    "minParticipants": 2,
    "requiresHorse": true,
    "allowsMultipleHorsesPerRider": false,
    "defaultDuration": 60,
    "allowsWaitlist": true,
    "requiresInstructor": true,
    "canBeRecurring": true,
    "canBeBlocked": true
}', 'Cours collectif - 2 à 8 cavaliers'),

('training', '{
    "maxParticipants": 12,
    "minParticipants": 3,
    "requiresHorse": true,
    "allowsMultipleHorsesPerRider": false,
    "defaultDuration": 180,
    "allowsWaitlist": true,
    "requiresInstructor": true,
    "canBeRecurring": false,
    "canBeBlocked": true
}', 'Stage - événement ponctuel'),

('competition', '{
    "maxParticipants": null,
    "minParticipants": 1,
    "requiresHorse": true,
    "allowsMultipleHorsesPerRider": true,
    "defaultDuration": 480,
    "allowsWaitlist": false,
    "requiresInstructor": false,
    "canBeRecurring": false,
    "canBeBlocked": true
}', 'Concours - pas de limite de participants'),

('event', '{
    "maxParticipants": null,
    "minParticipants": 1,
    "requiresHorse": false,
    "allowsMultipleHorsesPerRider": false,
    "defaultDuration": 120,
    "allowsWaitlist": false,
    "requiresInstructor": false,
    "canBeRecurring": false,
    "canBeBlocked": true
}', 'Événement - flexible'),

('blocked', '{
    "maxParticipants": 0,
    "minParticipants": 0,
    "requiresHorse": false,
    "allowsMultipleHorsesPerRider": false,
    "defaultDuration": 60,
    "allowsWaitlist": false,
    "requiresInstructor": false,
    "canBeRecurring": true,
    "canBeBlocked": false,
    "isBlockingPeriod": true
}', 'Plage bloquée - période de repos, aucune réservation possible');

-- ============================================
-- ÉTAPE 5: Créer des fonctions utilitaires
-- ============================================

-- Fonction pour calculer l'heure de fin
CREATE OR REPLACE FUNCTION calculate_end_time(start_time TIME, duration_minutes INTEGER)
RETURNS TIME AS $$
BEGIN
    RETURN start_time + (duration_minutes || ' minutes')::INTERVAL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour vérifier les conflits avec plages bloquées
CREATE OR REPLACE FUNCTION check_blocked_periods(
    p_lesson_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_exclude_instance_id INTEGER DEFAULT NULL
)
RETURNS TABLE(
    blocked_instance_id INTEGER,
    blocked_name VARCHAR(255),
    blocked_start TIME,
    blocked_end TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        li.id,
        li.name,
        li.start_time,
        li.end_time
    FROM lesson_instances li
    WHERE li.lesson_type = 'blocked'
    AND li.status != 'cancelled'
    AND li.lesson_date = p_lesson_date
    AND (p_exclude_instance_id IS NULL OR li.id != p_exclude_instance_id)
    AND (
        -- Chevauchement de plages horaires
        (li.start_time < p_end_time AND li.end_time > p_start_time)
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer un cours comme non donné par Laury
CREATE OR REPLACE FUNCTION mark_lesson_not_given(
    p_lesson_instance_id INTEGER,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE lesson_instances
    SET 
        not_given_by_laury = TRUE,
        not_given_reason = p_reason,
        not_given_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_lesson_instance_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ÉTAPE 6: Créer des vues utiles
-- ============================================

-- Vue pour les cours à venir
CREATE VIEW v_upcoming_lessons AS
SELECT 
    li.*,
    lt.name as template_name,
    COUNT(lp.id) as participant_count,
    STRING_AGG(r.name, ', ') as participant_names
FROM lesson_instances li
LEFT JOIN lesson_templates lt ON li.template_id = lt.id
LEFT JOIN lesson_participants lp ON li.id = lp.lesson_instance_id
LEFT JOIN riders r ON lp.rider_id = r.id
WHERE li.lesson_date >= CURRENT_DATE
AND li.status NOT IN ('cancelled', 'completed')
AND li.lesson_type != 'blocked'
GROUP BY li.id, lt.name
ORDER BY li.lesson_date, li.start_time;

-- Vue pour les plages bloquées actives
CREATE VIEW v_active_blocked_periods AS
SELECT 
    li.id,
    li.name,
    li.description,
    li.lesson_date,
    li.start_time,
    li.end_time,
    li.template_id,
    lt.name as template_name
FROM lesson_instances li
LEFT JOIN lesson_templates lt ON li.template_id = lt.id
WHERE li.lesson_type = 'blocked'
AND li.status != 'cancelled'
AND li.lesson_date >= CURRENT_DATE
ORDER BY li.lesson_date, li.start_time;

-- Vue pour les cours non donnés par Laury
CREATE VIEW v_lessons_not_given_by_laury AS
SELECT 
    li.*,
    lt.name as template_name,
    COUNT(lp.id) as participant_count
FROM lesson_instances li
LEFT JOIN lesson_templates lt ON li.template_id = lt.id
LEFT JOIN lesson_participants lp ON li.id = lp.lesson_instance_id
WHERE li.not_given_by_laury = TRUE
GROUP BY li.id, lt.name
ORDER BY li.lesson_date DESC, li.start_time DESC;

-- Vue pour les statistiques
CREATE VIEW v_lesson_statistics AS
SELECT 
    DATE_TRUNC('month', lesson_date) as month,
    lesson_type,
    COUNT(*) as total_lessons,
    COUNT(DISTINCT CASE WHEN status = 'completed' THEN id END) as completed_lessons,
    COUNT(DISTINCT CASE WHEN status = 'cancelled' THEN id END) as cancelled_lessons,
    COUNT(DISTINCT CASE WHEN not_given_by_laury = TRUE THEN id END) as not_given_lessons,
    AVG(participant_count) as avg_participants
FROM (
    SELECT 
        li.id,
        li.lesson_date,
        li.lesson_type,
        li.status,
        li.not_given_by_laury,
        COUNT(lp.id) as participant_count
    FROM lesson_instances li
    LEFT JOIN lesson_participants lp ON li.id = lp.lesson_instance_id
    WHERE li.lesson_type != 'blocked'
    GROUP BY li.id
) subquery
GROUP BY DATE_TRUNC('month', lesson_date), lesson_type;

-- ============================================
-- ÉTAPE 7: Ajouter des commentaires
-- ============================================

COMMENT ON TABLE lesson_templates IS 'Templates de cours récurrents et plages bloquées';
COMMENT ON TABLE lesson_instances IS 'Instances de cours réels dans le calendrier';
COMMENT ON TABLE lesson_participants IS 'Participants inscrits aux cours';
COMMENT ON TABLE template_default_participants IS 'Participants pré-assignés dans les templates';
COMMENT ON TABLE lesson_type_rules IS 'Règles métier par type de cours';

COMMENT ON COLUMN lesson_instances.not_given_by_laury IS 'Indicateur si le cours n''a pas été donné par Laury';
COMMENT ON COLUMN lesson_instances.not_given_reason IS 'Raison pour laquelle le cours n''a pas été donné';
COMMENT ON COLUMN lesson_instances.not_given_at IS 'Date et heure de marquage du cours comme non donné';

COMMENT ON FUNCTION check_blocked_periods IS 'Vérifie les conflits avec les plages bloquées pour une date et heure données';
COMMENT ON FUNCTION mark_lesson_not_given IS 'Marque un cours comme non donné par Laury';

-- ============================================
-- MIGRATION TERMINÉE
-- ============================================