/**
 * Service de génération des instances de leçons
 * Compatible avec Supabase
 */

import { calculateOccurrences } from '../utils/recurrence-helper.js';

/**
 * Génère les instances de leçons pour un template spécifique
 */
export async function generateLessonInstances(template, startDate, endDate, db) {
  const occurrences = calculateOccurrences(template.recurrence_rule, startDate, endDate);
  const instances = [];

  for (const occurrence of occurrences) {
    // Vérifier si l'instance existe déjà
    const { data: existing, error: checkError } = await db
      .from('lesson_instances')
      .select('id')
      .eq('template_id', template.id)
      .eq('lesson_date', occurrence.date)
      .eq('start_time', template.start_time)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      throw checkError;
    }

    if (!existing) {
      // Calculer l'heure de fin
      const [hours, minutes] = template.start_time.split(':').map(Number);
      const endTime = new Date(2000, 0, 1, hours, minutes + template.duration_minutes);
      const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      // Créer l'instance
      const { data: instance, error: insertError } = await db
        .from('lesson_instances')
        .insert({
          template_id: template.id,
          lesson_date: occurrence.date,
          start_time: template.start_time,
          end_time: endTimeStr,
          lesson_type: template.lesson_type,
          title: template.name,
          description: template.description,
          max_participants: template.max_participants,
          min_participants: template.min_participants,
          location: template.location || null,
          instructor_id: template.instructor_id || null,
          status: 'scheduled',
          is_blocker: template.lesson_type === 'blocked',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Ajouter les participants par défaut
      await addDefaultParticipants(instance.id, template, db);

      instances.push(instance);
    }
  }

  return instances;
}

/**
 * Génère les instances pour tous les templates actifs
 */
export async function generateUpcomingInstances(weeksAhead = 4, db) {
  const startDate = new Date().toISOString().split('T')[0];
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + weeksAhead * 7);
  const endDateStr = endDate.toISOString().split('T')[0];

  // Récupérer tous les templates actifs
  const { data: templates, error: templateError } = await db
    .from('lesson_templates')
    .select('*')
    .eq('is_active', true)
    .or(`valid_from.is.null,valid_from.lte.${startDate}`)
    .or(`valid_until.is.null,valid_until.gte.${startDate}`);

  if (templateError) {
    throw templateError;
  }

  const allInstances = [];
  const errors = [];

  for (const template of templates) {
    try {
      // Vérifier les périodes bloquées pour ce template
      const { data: blockedPeriods, error: blockedError } = await db
        .from('lesson_instances')
        .select('*')
        .eq('lesson_type', 'blocked')
        .gte('lesson_date', startDate)
        .lte('lesson_date', endDateStr);

      if (blockedError) {
        throw blockedError;
      }

      // Filtrer les occurrences qui tombent sur des périodes bloquées
      const occurrences = calculateOccurrences(template.recurrence_rule, startDate, endDateStr);
      const availableOccurrences = occurrences.filter((occurrence) => {
        return !blockedPeriods.some(
          (blocked) =>
            blocked.lesson_date === occurrence.date &&
            blocked.start_time <= template.start_time &&
            blocked.end_time >= template.start_time
        );
      });

      // Générer les instances pour les occurrences disponibles
      for (const occurrence of availableOccurrences) {
        const { data: existing, error: checkError } = await db
          .from('lesson_instances')
          .select('id')
          .eq('template_id', template.id)
          .eq('lesson_date', occurrence.date)
          .eq('start_time', template.start_time)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        if (!existing) {
          const [hours, minutes] = template.start_time.split(':').map(Number);
          const endTime = new Date(2000, 0, 1, hours, minutes + template.duration_minutes);
          const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;

          const { data: instance, error: insertError } = await db
            .from('lesson_instances')
            .insert({
              template_id: template.id,
              lesson_date: occurrence.date,
              start_time: template.start_time,
              end_time: endTimeStr,
              lesson_type: template.lesson_type,
              title: template.name,
              description: template.description,
              max_participants: template.max_participants,
              min_participants: template.min_participants,
              location: template.location || null,
              instructor_id: template.instructor_id || null,
              status: 'scheduled',
              is_blocker: template.lesson_type === 'blocked',
            })
            .select()
            .single();

          if (insertError) {
            throw insertError;
          }

          await addDefaultParticipants(instance.id, template, db);
          allInstances.push(instance);
        }
      }
    } catch (error) {
      errors.push({
        template: template.name,
        error: error.message,
      });
    }
  }

  return {
    instances: allInstances,
    errors,
    summary: {
      templates_processed: templates.length,
      instances_generated: allInstances.length,
      errors_count: errors.length,
    },
  };
}

/**
 * Ajoute les participants par défaut à une instance
 */
async function addDefaultParticipants(instanceId, template, db) {
  // Récupérer les participants par défaut du template
  const { data: defaultParticipants, error: participantError } = await db
    .from('lesson_participants')
    .select('*')
    .eq('template_id', template.id)
    .eq('is_default', true);

  if (participantError) {
    throw participantError;
  }

  // Ajouter chaque participant à l'instance
  for (const participant of defaultParticipants) {
    const { error: addError } = await db.from('lesson_participants').insert({
      lesson_instance_id: instanceId,
      rider_id: participant.rider_id,
      horse_id: participant.horse_id || null,
      status: 'registered',
      notes: participant.notes || null,
    });

    if (addError) {
      console.error('Error adding participant:', addError);
    }
  }

  // Si c'est un cours particulier, ajouter le cavalier par défaut
  if (template.lesson_type === 'private' && template.rider_id) {
    const { error: privateError } = await db.from('lesson_participants').insert({
      lesson_instance_id: instanceId,
      rider_id: template.rider_id,
      status: 'registered',
      notes: 'Cours privé - participant par défaut',
    });

    if (privateError) {
      console.error('Error adding private lesson participant:', privateError);
    }
  }
}
