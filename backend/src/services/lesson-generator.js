/**
 * Service de génération des instances de leçons
 * Compatible avec Supabase
 */

import { calculateOccurrences } from '../utils/recurrence-helper.js';

/**
 * Génère les instances de leçons pour un template spécifique
 */
export async function generateLessonInstances(template, startDate, endDate, db) {
  const recurrenceRule =
    typeof template.recurrence_rule === 'string'
      ? JSON.parse(template.recurrence_rule)
      : template.recurrence_rule;

  const occurrences = calculateOccurrences(recurrenceRule, startDate, endDate);
  const instances = [];
  let skipped = 0;

  for (const occurrence of occurrences) {
    // Vérifier si l'instance existe déjà
    const { data: existing, error: checkError } = await db
      .from('lesson_instances')
      .select('id')
      .eq('template_id', template.id)
      .eq('lesson_date', occurrence.date)
      .eq('start_time', template.start_time)
      .maybeSingle(); // Use maybeSingle() instead of single()

    if (checkError) {
      throw checkError;
    }

    if (existing) {
      skipped++;
      continue;
    }

    // Calculer l'heure de fin
    const [hours, minutes] = template.start_time.split(':').map(Number);
    const endTime = new Date(2000, 0, 1, hours, minutes + template.duration_minutes);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime
      .getMinutes()
      .toString()
      .padStart(2, '0')}:00`;

    // Préparer les données d'insertion
    const insertData = {
      template_id: template.id,
      lesson_date: occurrence.date,
      start_time: template.start_time,
      end_time: endTimeStr,
      lesson_type: template.lesson_type,
      name: template.name, // FIXED: was 'title'
      description: template.description,
      status: 'scheduled',
    };

    // Ajouter les participants seulement si ce n'est PAS une plage bloquée
    if (template.lesson_type !== 'blocked') {
      insertData.max_participants = template.max_participants;
      insertData.min_participants = template.min_participants;
    } else {
      insertData.max_participants = 0;
      insertData.min_participants = 0;
    }

    // Créer l'instance
    const { data: instance, error: insertError } = await db
      .from('lesson_instances')
      .insert(insertData)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating instance:', insertError);
      throw insertError;
    }

    // Ajouter les participants par défaut seulement si ce n'est PAS une plage bloquée
    if (template.lesson_type !== 'blocked') {
      await addDefaultParticipants(instance.id, template.id, db);
    }

    instances.push(instance);
  }

  return {
    generated: instances.length,
    skipped: skipped,
    instances: instances,
  };
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

  const results = [];

  for (const template of templates) {
    try {
      const result = await generateLessonInstances(template, startDate, endDateStr, db);
      results.push({
        template_id: template.id,
        template_name: template.name,
        ...result,
      });
    } catch (error) {
      results.push({
        template_id: template.id,
        template_name: template.name,
        error: error.message,
        generated: 0,
        skipped: 0,
      });
    }
  }

  return results;
}

/**
 * Ajoute les participants par défaut à une instance
 */
async function addDefaultParticipants(instanceId, templateId, db) {
  // FIXED: Use correct table and columns
  const { data: defaultParticipants, error: participantError } = await db
    .from('template_default_participants')
    .select('*')
    .eq('template_id', templateId)
    .order('priority_order');

  if (participantError) {
    console.error('Error fetching default participants:', participantError);
    return;
  }

  if (!defaultParticipants || defaultParticipants.length === 0) {
    return;
  }

  // Ajouter chaque participant à l'instance
  for (const participant of defaultParticipants) {
    const { error: addError } = await db.from('lesson_participants').insert({
      lesson_instance_id: instanceId,
      rider_id: participant.rider_id,
      horse_id: participant.horse_id || null,
      participation_status: 'registered', // FIXED: was 'status'
      notes: null,
    });

    if (addError) {
      console.error('Error adding participant:', addError);
    }
  }
}
