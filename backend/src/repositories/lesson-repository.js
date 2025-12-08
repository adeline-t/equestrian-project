/**
 * Repository pour la gestion des cours et du calendrier
 */
export class LessonRepository {
    constructor(db) {
        this.db = db;
    }

    // ============================================
    // TEMPLATES
    // ============================================

    /**
     * Récupérer tous les templates avec filtres
     */
    async findTemplates(filters = {}) {
        let query = 'SELECT * FROM lesson_templates WHERE 1=1';
        const params = [];

        if (filters.active !== undefined) {
            query += ' AND is_active = ?';
            params.push(filters.active);
        }

        if (filters.lessonType) {
            query += ' AND lesson_type = ?';
            params.push(filters.lessonType);
        }

        if (filters.excludeBlocked) {
            query += ' AND lesson_type != ?';
            params.push('blocked');
        }

        query += ' ORDER BY created_at DESC';

        return await this.db.prepare(query).bind(...params).all();
    }

    /**
     * Récupérer un template par ID
     */
    async findTemplateById(id) {
        return await this.db.prepare(
            'SELECT * FROM lesson_templates WHERE id = ?'
        ).bind(id).first();
    }

    /**
     * Créer un nouveau template
     */
    async createTemplate(data) {
        const result = await this.db.prepare(`
            INSERT INTO lesson_templates (
                name, description, lesson_type, recurrence_rule,
                start_time, duration_minutes, valid_from, valid_until,
                max_participants, min_participants, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `).bind(
            data.name,
            data.description || null,
            data.lesson_type,
            JSON.stringify(data.recurrence_rule),
            data.start_time,
            data.duration_minutes,
            data.valid_from,
            data.valid_until || null,
            data.max_participants || null,
            data.min_participants || 1,
            true
        ).first();

        return result;
    }

    /**
     * Mettre à jour un template
     */
    async updateTemplate(id, data) {
        const fields = [];
        const values = [];

        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (data.lesson_type !== undefined) {
            fields.push('lesson_type = ?');
            values.push(data.lesson_type);
        }
        if (data.recurrence_rule !== undefined) {
            fields.push('recurrence_rule = ?');
            values.push(JSON.stringify(data.recurrence_rule));
        }
        if (data.start_time !== undefined) {
            fields.push('start_time = ?');
            values.push(data.start_time);
        }
        if (data.duration_minutes !== undefined) {
            fields.push('duration_minutes = ?');
            values.push(data.duration_minutes);
        }
        if (data.valid_from !== undefined) {
            fields.push('valid_from = ?');
            values.push(data.valid_from);
        }
        if (data.valid_until !== undefined) {
            fields.push('valid_until = ?');
            values.push(data.valid_until);
        }
        if (data.max_participants !== undefined) {
            fields.push('max_participants = ?');
            values.push(data.max_participants);
        }
        if (data.min_participants !== undefined) {
            fields.push('min_participants = ?');
            values.push(data.min_participants);
        }
        if (data.is_active !== undefined) {
            fields.push('is_active = ?');
            values.push(data.is_active);
        }

        if (fields.length === 0) {
            return await this.findTemplateById(id);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const query = `
            UPDATE lesson_templates
            SET ${fields.join(', ')}
            WHERE id = ?
            RETURNING *
        `;

        return await this.db.prepare(query).bind(...values).first();
    }

    /**
     * Supprimer un template
     */
    async deleteTemplate(id) {
        return await this.db.prepare(
            'DELETE FROM lesson_templates WHERE id = ?'
        ).bind(id).run();
    }

    // ============================================
    // INSTANCES
    // ============================================

    /**
     * Récupérer les instances dans une plage de dates
     */
    async findInstancesByDateRange(startDate, endDate, filters = {}) {
        let query = `
            SELECT 
                li.*,
                lt.name as template_name,
                COUNT(lp.id) as participant_count
            FROM lesson_instances li
            LEFT JOIN lesson_templates lt ON li.template_id = lt.id
            LEFT JOIN lesson_participants lp ON li.id = lp.lesson_instance_id
            WHERE li.lesson_date BETWEEN ? AND ?
        `;

        const params = [startDate, endDate];

        if (filters.lessonType) {
            query += ' AND li.lesson_type = ?';
            params.push(filters.lessonType);
        }

        if (filters.status) {
            query += ' AND li.status = ?';
            params.push(filters.status);
        }

        if (filters.excludeBlocked) {
            query += ' AND li.lesson_type != ?';
            params.push('blocked');
        }

        if (filters.includeParticipants === false) {
            query = query.replace('LEFT JOIN lesson_participants lp ON li.id = lp.lesson_instance_id', '');
            query = query.replace('COUNT(lp.id) as participant_count', '0 as participant_count');
        }

        query += ' GROUP BY li.id, lt.name ORDER BY li.lesson_date, li.start_time';

        return await this.db.prepare(query).bind(...params).all();
    }

    /**
     * Récupérer une instance par ID avec participants
     */
    async findInstanceById(id, includeParticipants = true) {
        const instance = await this.db.prepare(`
            SELECT 
                li.*,
                lt.name as template_name
            FROM lesson_instances li
            LEFT JOIN lesson_templates lt ON li.template_id = lt.id
            WHERE li.id = ?
        `).bind(id).first();

        if (!instance) return null;

        if (includeParticipants) {
            const participants = await this.db.prepare(`
                SELECT 
                    lp.*,
                    r.name as rider_name,
                    r.email as rider_email,
                    h.name as horse_name,
                    h.kind as horse_kind
                FROM lesson_participants lp
                JOIN riders r ON lp.rider_id = r.id
                LEFT JOIN horses h ON lp.horse_id = h.id
                WHERE lp.lesson_instance_id = ?
                ORDER BY lp.registered_at
            `).bind(id).all();

            instance.participants = participants.results || [];
        }

        return instance;
    }

    /**
     * Créer une nouvelle instance
     */
    async createInstance(data) {
        const result = await this.db.prepare(`
            INSERT INTO lesson_instances (
                template_id, name, description, lesson_type,
                lesson_date, start_time, end_time,
                max_participants, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `).bind(
            data.template_id || null,
            data.name,
            data.description || null,
            data.lesson_type,
            data.lesson_date,
            data.start_time,
            data.end_time,
            data.max_participants || null,
            data.status || 'scheduled'
        ).first();

        return result;
    }

    /**
     * Mettre à jour une instance
     */
    async updateInstance(id, data) {
        const fields = [];
        const values = [];

        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.description !== undefined) {
            fields.push('description = ?');
            values.push(data.description);
        }
        if (data.start_time !== undefined) {
            fields.push('start_time = ?');
            values.push(data.start_time);
        }
        if (data.end_time !== undefined) {
            fields.push('end_time = ?');
            values.push(data.end_time);
        }
        if (data.max_participants !== undefined) {
            fields.push('max_participants = ?');
            values.push(data.max_participants);
        }
        if (data.status !== undefined) {
            fields.push('status = ?');
            values.push(data.status);
        }
        if (data.cancellation_reason !== undefined) {
            fields.push('cancellation_reason = ?');
            values.push(data.cancellation_reason);
        }
        if (data.not_given_by_laury !== undefined) {
            fields.push('not_given_by_laury = ?');
            values.push(data.not_given_by_laury);
            if (data.not_given_by_laury) {
                fields.push('not_given_at = CURRENT_TIMESTAMP');
            }
        }
        if (data.not_given_reason !== undefined) {
            fields.push('not_given_reason = ?');
            values.push(data.not_given_reason);
        }

        // Marquer comme modifié si ce n'est pas juste un changement de statut
        if (data.start_time !== undefined || data.end_time !== undefined || 
            data.max_participants !== undefined || data.name !== undefined) {
            fields.push('is_modified = ?');
            values.push(true);
        }

        if (fields.length === 0) {
            return await this.findInstanceById(id, false);
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const query = `
            UPDATE lesson_instances
            SET ${fields.join(', ')}
            WHERE id = ?
            RETURNING *
        `;

        return await this.db.prepare(query).bind(...values).first();
    }

    /**
     * Supprimer une instance
     */
    async deleteInstance(id) {
        return await this.db.prepare(
            'DELETE FROM lesson_instances WHERE id = ?'
        ).bind(id).run();
    }

    /**
     * Vérifier les conflits avec plages bloquées
     */
    async checkBlockedPeriods(lessonDate, startTime, endTime, excludeInstanceId = null) {
        let query = `
            SELECT 
                id as blocked_instance_id,
                name as blocked_name,
                start_time as blocked_start,
                end_time as blocked_end
            FROM lesson_instances
            WHERE lesson_type = 'blocked'
            AND status != 'cancelled'
            AND lesson_date = ?
            AND (start_time < ? AND end_time > ?)
        `;

        const params = [lessonDate, endTime, startTime];

        if (excludeInstanceId) {
            query += ' AND id != ?';
            params.push(excludeInstanceId);
        }

        return await this.db.prepare(query).bind(...params).all();
    }

    /**
     * Marquer un cours comme non donné par Laury
     */
    async markAsNotGiven(id, reason = null) {
        return await this.updateInstance(id, {
            not_given_by_laury: true,
            not_given_reason: reason
        });
    }

    // ============================================
    // PARTICIPANTS
    // ============================================

    /**
     * Ajouter un participant à un cours
     */
    async addParticipant(data) {
        const result = await this.db.prepare(`
            INSERT INTO lesson_participants (
                lesson_instance_id, rider_id, horse_id,
                horse_assignment_type, participation_status, notes
            ) VALUES (?, ?, ?, ?, ?, ?)
            RETURNING *
        `).bind(
            data.lesson_instance_id,
            data.rider_id,
            data.horse_id || null,
            data.horse_assignment_type || 'auto',
            data.participation_status || 'registered',
            data.notes || null
        ).first();

        return result;
    }

    /**
     * Mettre à jour un participant
     */
    async updateParticipant(id, data) {
        const fields = [];
        const values = [];

        if (data.horse_id !== undefined) {
            fields.push('horse_id = ?');
            values.push(data.horse_id);
        }
        if (data.horse_assignment_type !== undefined) {
            fields.push('horse_assignment_type = ?');
            values.push(data.horse_assignment_type);
        }
        if (data.participation_status !== undefined) {
            fields.push('participation_status = ?');
            values.push(data.participation_status);
        }
        if (data.notes !== undefined) {
            fields.push('notes = ?');
            values.push(data.notes);
        }

        if (fields.length === 0) {
            return null;
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const query = `
            UPDATE lesson_participants
            SET ${fields.join(', ')}
            WHERE id = ?
            RETURNING *
        `;

        return await this.db.prepare(query).bind(...values).first();
    }

    /**
     * Supprimer un participant
     */
    async removeParticipant(id) {
        return await this.db.prepare(
            'DELETE FROM lesson_participants WHERE id = ?'
        ).bind(id).run();
    }

    /**
     * Récupérer les participants d'un cours
     */
    async findParticipantsByLessonId(lessonInstanceId) {
        return await this.db.prepare(`
            SELECT 
                lp.*,
                r.name as rider_name,
                r.email as rider_email,
                h.name as horse_name,
                h.kind as horse_kind
            FROM lesson_participants lp
            JOIN riders r ON lp.rider_id = r.id
            LEFT JOIN horses h ON lp.horse_id = h.id
            WHERE lp.lesson_instance_id = ?
            ORDER BY lp.registered_at
        `).bind(lessonInstanceId).all();
    }

    // ============================================
    // PARTICIPANTS PAR DÉFAUT (TEMPLATES)
    // ============================================

    /**
     * Récupérer les participants par défaut d'un template
     */
    async findDefaultParticipantsByTemplateId(templateId) {
        return await this.db.prepare(`
            SELECT 
                tdp.*,
                r.name as rider_name,
                r.email as rider_email,
                h.name as horse_name
            FROM template_default_participants tdp
            JOIN riders r ON tdp.rider_id = r.id
            LEFT JOIN horses h ON tdp.horse_id = h.id
            WHERE tdp.template_id = ?
            ORDER BY tdp.priority_order, tdp.created_at
        `).bind(templateId).all();
    }

    /**
     * Ajouter un participant par défaut à un template
     */
    async addDefaultParticipant(data) {
        const result = await this.db.prepare(`
            INSERT INTO template_default_participants (
                template_id, rider_id, horse_id,
                auto_assign_horse, priority_order
            ) VALUES (?, ?, ?, ?, ?)
            RETURNING *
        `).bind(
            data.template_id,
            data.rider_id,
            data.horse_id || null,
            data.auto_assign_horse !== undefined ? data.auto_assign_horse : true,
            data.priority_order || 0
        ).first();

        return result;
    }

    /**
     * Supprimer un participant par défaut
     */
    async removeDefaultParticipant(id) {
        return await this.db.prepare(
            'DELETE FROM template_default_participants WHERE id = ?'
        ).bind(id).run();
    }

    // ============================================
    // STATISTIQUES ET VUES
    // ============================================

    /**
     * Récupérer les cours non donnés par Laury
     */
    async findLessonsNotGivenByLaury(filters = {}) {
        let query = `
            SELECT 
                li.*,
                lt.name as template_name,
                COUNT(lp.id) as participant_count
            FROM lesson_instances li
            LEFT JOIN lesson_templates lt ON li.template_id = lt.id
            LEFT JOIN lesson_participants lp ON li.id = lp.lesson_instance_id
            WHERE li.not_given_by_laury = TRUE
        `;

        const params = [];

        if (filters.startDate) {
            query += ' AND li.lesson_date >= ?';
            params.push(filters.startDate);
        }

        if (filters.endDate) {
            query += ' AND li.lesson_date <= ?';
            params.push(filters.endDate);
        }

        query += ' GROUP BY li.id, lt.name ORDER BY li.lesson_date DESC, li.start_time DESC';

        return await this.db.prepare(query).bind(...params).all();
    }

    /**
     * Récupérer les plages bloquées actives
     */
    async findActiveBlockedPeriods(startDate = null, endDate = null) {
        let query = `
            SELECT 
                li.*,
                lt.name as template_name
            FROM lesson_instances li
            LEFT JOIN lesson_templates lt ON li.template_id = lt.id
            WHERE li.lesson_type = 'blocked'
            AND li.status != 'cancelled'
        `;

        const params = [];

        if (startDate) {
            query += ' AND li.lesson_date >= ?';
            params.push(startDate);
        }

        if (endDate) {
            query += ' AND li.lesson_date <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY li.lesson_date, li.start_time';

        return await this.db.prepare(query).bind(...params).all();
    }
}