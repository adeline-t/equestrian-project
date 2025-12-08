/**
 * Service de génération des instances de cours à partir des templates
 */

/**
 * Calculer les occurrences d'un cours récurrent
 */
export function calculateOccurrences(recurrenceRule, startDate, endDate) {
    const occurrences = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const ruleStartDate = recurrenceRule.startDate ? new Date(recurrenceRule.startDate) : start;
    const ruleEndDate = recurrenceRule.endDate ? new Date(recurrenceRule.endDate) : null;

    // Ajuster la date de début si nécessaire
    let currentDate = new Date(Math.max(start.getTime(), ruleStartDate.getTime()));

    // Mapper les jours de la semaine
    const dayMap = {
        'sunday': 0,
        'monday': 1,
        'tuesday': 2,
        'wednesday': 3,
        'thursday': 4,
        'friday': 5,
        'saturday': 6
    };

    if (recurrenceRule.frequency === 'weekly') {
        const targetDays = (recurrenceRule.byDay || []).map(day => dayMap[day.toLowerCase()]);
        const interval = recurrenceRule.interval || 1;

        // Commencer au début de la semaine
        const dayOfWeek = currentDate.getDay();
        currentDate.setDate(currentDate.getDate() - dayOfWeek);

        let weekCount = 0;
        while (currentDate <= end) {
            // Vérifier si on est dans une semaine valide selon l'intervalle
            if (weekCount % interval === 0) {
                // Pour chaque jour cible de la semaine
                for (const targetDay of targetDays) {
                    const occurrenceDate = new Date(currentDate);
                    occurrenceDate.setDate(currentDate.getDate() + targetDay);

                    // Vérifier que la date est dans la plage valide
                    if (occurrenceDate >= start && occurrenceDate <= end &&
                        occurrenceDate >= ruleStartDate &&
                        (!ruleEndDate || occurrenceDate <= ruleEndDate)) {
                        occurrences.push(occurrenceDate.toISOString().split('T')[0]);
                    }
                }
            }

            // Passer à la semaine suivante
            currentDate.setDate(currentDate.getDate() + 7);
            weekCount++;
        }
    } else if (recurrenceRule.frequency === 'daily') {
        const interval = recurrenceRule.interval || 1;
        let dayCount = 0;

        while (currentDate <= end) {
            if (dayCount % interval === 0 &&
                currentDate >= ruleStartDate &&
                (!ruleEndDate || currentDate <= ruleEndDate)) {
                occurrences.push(currentDate.toISOString().split('T')[0]);
            }

            currentDate.setDate(currentDate.getDate() + 1);
            dayCount++;
        }
    } else if (recurrenceRule.frequency === 'monthly') {
        const interval = recurrenceRule.interval || 1;
        let monthCount = 0;

        while (currentDate <= end) {
            if (monthCount % interval === 0 &&
                currentDate >= ruleStartDate &&
                (!ruleEndDate || currentDate <= ruleEndDate)) {
                occurrences.push(currentDate.toISOString().split('T')[0]);
            }

            currentDate.setMonth(currentDate.getMonth() + 1);
            monthCount++;
        }
    }

    return occurrences;
}

/**
 * Calculer l'heure de fin à partir de l'heure de début et de la durée
 */
export function calculateEndTime(startTime, durationMinutes) {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`;
}

/**
 * Générer les instances de cours pour un template
 */
export async function generateLessonInstances(db, templateId, startDate, endDate) {
    // Récupérer le template
    const template = await db.prepare(
        'SELECT * FROM lesson_templates WHERE id = ?'
    ).bind(templateId).first();

    if (!template) {
        throw new Error(`Template ${templateId} not found`);
    }

    if (!template.is_active) {
        return { generated: 0, skipped: 0, details: [] };
    }

    // Parser la règle de récurrence
    const recurrenceRule = JSON.parse(template.recurrence_rule);

    // Calculer les occurrences
    const dates = calculateOccurrences(recurrenceRule, startDate, endDate);

    // Vérifier les instances existantes
    const existingInstances = await db.prepare(`
        SELECT lesson_date FROM lesson_instances
        WHERE template_id = ?
        AND lesson_date BETWEEN ? AND ?
    `).bind(templateId, startDate, endDate).all();

    const existingDates = new Set(
        existingInstances.results.map(i => i.lesson_date)
    );

    // Calculer l'heure de fin
    const endTime = calculateEndTime(template.start_time, template.duration_minutes);

    // Générer les instances
    const generated = [];
    const skipped = [];

    for (const date of dates) {
        if (existingDates.has(date)) {
            skipped.push({ date, reason: 'already_exists' });
            continue;
        }

        // Vérifier les conflits avec plages bloquées
        const blockedPeriods = await db.prepare(`
            SELECT id, name FROM lesson_instances
            WHERE lesson_type = 'blocked'
            AND status != 'cancelled'
            AND lesson_date = ?
            AND (start_time < ? AND end_time > ?)
        `).bind(date, endTime, template.start_time).all();

        if (blockedPeriods.results.length > 0) {
            skipped.push({
                date,
                reason: 'blocked_period',
                blocked_by: blockedPeriods.results[0].name
            });
            continue;
        }

        // Créer l'instance
        const instance = await db.prepare(`
            INSERT INTO lesson_instances (
                template_id, name, description, lesson_type,
                lesson_date, start_time, end_time,
                max_participants, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING id
        `).bind(
            template.id,
            template.name,
            template.description,
            template.lesson_type,
            date,
            template.start_time,
            endTime,
            template.max_participants,
            template.lesson_type === 'blocked' ? 'blocked' : 'scheduled'
        ).first();

        // Ajouter les participants par défaut (sauf pour les plages bloquées)
        if (template.lesson_type !== 'blocked') {
            await createDefaultParticipants(db, instance.id, template.id, date);
        }

        generated.push({ date, instance_id: instance.id });
    }

    return {
        generated: generated.length,
        skipped: skipped.length,
        details: [...generated, ...skipped]
    };
}

/**
 * Créer les participants par défaut pour une instance
 */
async function createDefaultParticipants(db, instanceId, templateId, lessonDate) {
    // Récupérer les participants par défaut du template
    const defaultParticipants = await db.prepare(`
        SELECT * FROM template_default_participants
        WHERE template_id = ?
        ORDER BY priority_order, created_at
    `).bind(templateId).all();

    for (const participant of defaultParticipants.results) {
        let horseId = participant.horse_id;

        // Si auto-assignation activée, chercher la DP active
        if (participant.auto_assign_horse) {
            const activePairing = await db.prepare(`
                SELECT horse_id FROM rider_horse_pairings
                WHERE rider_id = ?
                AND (pairing_start_date IS NULL OR pairing_start_date <= ?)
                AND (pairing_end_date IS NULL OR pairing_end_date >= ?)
                ORDER BY pairing_start_date DESC
                LIMIT 1
            `).bind(participant.rider_id, lessonDate, lessonDate).first();

            if (activePairing) {
                horseId = activePairing.horse_id;
            }
        }

        // Créer le participant
        await db.prepare(`
            INSERT INTO lesson_participants (
                lesson_instance_id, rider_id, horse_id,
                horse_assignment_type, participation_status
            ) VALUES (?, ?, ?, ?, ?)
        `).bind(
            instanceId,
            participant.rider_id,
            horseId,
            horseId ? 'auto' : 'none',
            'registered'
        ).run();
    }
}

/**
 * Générer les instances pour tous les templates actifs
 */
export async function generateAllLessonInstances(db, startDate, endDate) {
    // Récupérer tous les templates actifs
    const templates = await db.prepare(`
        SELECT id FROM lesson_templates
        WHERE is_active = TRUE
        AND (valid_until IS NULL OR valid_until >= ?)
    `).bind(startDate).all();

    const results = [];

    for (const template of templates.results) {
        try {
            const result = await generateLessonInstances(
                db,
                template.id,
                startDate,
                endDate
            );
            results.push({
                template_id: template.id,
                ...result
            });
        } catch (error) {
            results.push({
                template_id: template.id,
                error: error.message
            });
        }
    }

    return results;
}

/**
 * Générer les instances pour les X prochaines semaines
 */
export async function generateUpcomingInstances(db, weeksAhead = 4) {
    const today = new Date();
    const startDate = today.toISOString().split('T')[0];

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + (weeksAhead * 7));
    const endDateStr = endDate.toISOString().split('T')[0];

    return await generateAllLessonInstances(db, startDate, endDateStr);
}