import { getDatabase, jsonResponse } from '../db.js';
import { LessonRepository } from '../repositories/lesson-repository.js';
import {
  generateLessonInstances,
  generateUpcomingInstances,
} from '../services/lesson-generator.js';
import { calculateOccurrences } from '../utils/recurrence-helper.js';

/**
 * Handler principal pour les routes du calendrier
 */
export async function handleCalendar(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  const db = getDatabase(env);
  const lessonRepo = new LessonRepository(db);

  try {
    // ============================================
    // TEMPLATES
    // ============================================

    // GET /api/calendar/templates - Liste des templates
    if (path === '/api/calendar/templates' && method === 'GET') {
      return await getTemplates(request, env, lessonRepo);
    }

    // POST /api/calendar/templates - Créer un template
    if (path === '/api/calendar/templates' && method === 'POST') {
      return await createTemplate(request, env, lessonRepo);
    }

    // GET /api/calendar/templates/:id - Détails d'un template
    if (path.match(/^\/api\/calendar\/templates\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/')[4]);
      return await getTemplate(id, env, lessonRepo);
    }

    // PUT /api/calendar/templates/:id - Modifier un template
    if (path.match(/^\/api\/calendar\/templates\/\d+$/) && method === 'PUT') {
      const id = parseInt(path.split('/')[4]);
      return await updateTemplate(id, request, env, lessonRepo);
    }

    // DELETE /api/calendar/templates/:id - Supprimer un template
    if (path.match(/^\/api\/calendar\/templates\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/')[4]);
      return await deleteTemplate(id, request, env, lessonRepo);
    }

    // GET /api/calendar/templates/:id/participants - Participants par défaut
    if (path.match(/^\/api\/calendar\/templates\/\d+\/participants$/) && method === 'GET') {
      const id = parseInt(path.split('/')[4]);
      return await getTemplateParticipants(id, env, lessonRepo);
    }

    // POST /api/calendar/templates/:id/generate - Générer les instances
    if (path.match(/^\/api\/calendar\/templates\/\d+\/generate$/) && method === 'POST') {
      const id = parseInt(path.split('/')[4]);
      return await generateTemplateInstances(id, request, env);
    }

    // POST /api/calendar/templates/:id/preview - Prévisualiser les occurrences
    if (path.match(/^\/api\/calendar\/templates\/\d+\/preview$/) && method === 'POST') {
      const id = parseInt(path.split('/')[4]);
      return await previewTemplateOccurrences(id, request, env);
    }

    // ============================================
    // INSTANCES (LESSONS)
    // ============================================

    // GET /api/calendar/lessons - Liste des cours
    if (path === '/api/calendar/lessons' && method === 'GET') {
      return await getLessons(request, env, lessonRepo);
    }

    // POST /api/calendar/lessons - Créer un cours ponctuel
    if (path === '/api/calendar/lessons' && method === 'POST') {
      return await createLesson(request, env, lessonRepo);
    }

    // GET /api/calendar/lessons/:id - Détails d'un cours
    if (path.match(/^\/api\/calendar\/lessons\/\d+$/) && method === 'GET') {
      const id = parseInt(path.split('/')[4]);
      return await getLesson(id, env, lessonRepo);
    }

    // PUT /api/calendar/lessons/:id - Modifier un cours
    if (path.match(/^\/api\/calendar\/lessons\/\d+$/) && method === 'PUT') {
      const id = parseInt(path.split('/')[4]);
      return await updateLesson(id, request, env, lessonRepo);
    }

    // DELETE /api/calendar/lessons/:id - Annuler un cours
    if (path.match(/^\/api\/calendar\/lessons\/\d+$/) && method === 'DELETE') {
      const id = parseInt(path.split('/')[4]);
      return await cancelLesson(id, request, env, lessonRepo);
    }

    // POST /api/calendar/lessons/:id/mark-not-given - Marquer comme non donné
    if (path.match(/^\/api\/calendar\/lessons\/\d+\/mark-not-given$/) && method === 'POST') {
      const id = parseInt(path.split('/')[4]);
      return await markLessonNotGiven(id, request, env, lessonRepo);
    }

    // ============================================
    // PARTICIPANTS
    // ============================================

    // POST /api/calendar/lessons/:id/participants - Ajouter un participant
    if (path.match(/^\/api\/calendar\/lessons\/\d+\/participants$/) && method === 'POST') {
      const lessonId = parseInt(path.split('/')[4]);
      return await addParticipant(lessonId, request, env, lessonRepo);
    }

    // PUT /api/calendar/lessons/:lessonId/participants/:participantId - Modifier un participant
    if (path.match(/^\/api\/calendar\/lessons\/\d+\/participants\/\d+$/) && method === 'PUT') {
      const lessonId = parseInt(path.split('/')[4]);
      const participantId = parseInt(path.split('/')[6]);
      return await updateParticipant(lessonId, participantId, request, env, lessonRepo);
    }

    // DELETE /api/calendar/lessons/:lessonId/participants/:participantId - Retirer un participant
    if (path.match(/^\/api\/calendar\/lessons\/\d+\/participants\/\d+$/) && method === 'DELETE') {
      const lessonId = parseInt(path.split('/')[4]);
      const participantId = parseInt(path.split('/')[6]);
      return await removeParticipant(lessonId, participantId, env, lessonRepo);
    }

    // ============================================
    // VUES CALENDRIER
    // ============================================

    // GET /api/calendar/schedule/week - Vue hebdomadaire
    if (path === '/api/calendar/schedule/week' && method === 'GET') {
      return await getWeekSchedule(request, env, lessonRepo);
    }

    // GET /api/calendar/schedule/blocked-periods - Plages bloquées
    if (path === '/api/calendar/schedule/blocked-periods' && method === 'GET') {
      return await getBlockedPeriods(request, env, lessonRepo);
    }

    // GET /api/calendar/schedule/not-given - Cours non donnés
    if (path === '/api/calendar/schedule/not-given' && method === 'GET') {
      return await getLessonsNotGiven(request, env, lessonRepo);
    }

    // POST /api/calendar/schedule/check-availability - Vérifier disponibilité
    if (path === '/api/calendar/schedule/check-availability' && method === 'POST') {
      return await checkAvailability(request, env, lessonRepo);
    }

    // ============================================
    // GÉNÉRATION AUTOMATIQUE
    // ============================================

    // POST /api/calendar/generate - Générer toutes les instances
    if (path === '/api/calendar/generate' && method === 'POST') {
      return await generateAllInstances(request, env);
    }

    return jsonResponse({ error: 'Not found' }, 404);
  } catch (error) {
    console.error('Calendar handler error:', error);
    return jsonResponse(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
      },
      500
    );
  }
}

// ============================================
// HANDLERS - TEMPLATES
// ============================================

async function getTemplates(request, env, lessonRepo) {
  const url = new URL(request.url);
  const active = url.searchParams.get('active');
  const lessonType = url.searchParams.get('lesson_type');
  const excludeBlocked = url.searchParams.get('exclude_blocked') === 'true';

  const result = await lessonRepo.findTemplates({
    active: active !== null ? active === 'true' : undefined,
    lessonType,
    excludeBlocked,
  });

  return jsonResponse({
    success: true,
    data: result.results || [],
  });
}

async function getTemplate(id, env, lessonRepo) {
  const template = await lessonRepo.findTemplateById(id);

  if (!template) {
    return jsonResponse(
      {
        success: false,
        error: 'Template not found',
      },
      404
    );
  }

  return jsonResponse({
    success: true,
    data: template,
  });
}

async function createTemplate(request, env, lessonRepo) {
  const data = await request.json();

  // Validation
  if (!data.name || !data.lesson_type || !data.recurrence_rule) {
    return jsonResponse(
      {
        success: false,
        error: 'Champs requis manquants: name, lesson_type, recurrence_rule',
      },
      400
    );
  }

  // Validation spécifique pour les plages bloquées
  if (data.lesson_type === 'blocked') {
    data.max_participants = 0;
    data.min_participants = 0;
  }

  const template = await lessonRepo.createTemplate(data);

  // Générer les instances initiales (4 semaines)
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 28);

  // Utiliser la base de données du repository et passer le template complet
  const db = lessonRepo.db;
  await generateLessonInstances(
    template,
    today.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0],
    db
  );

  return jsonResponse(
    {
      success: true,
      data: template,
      message:
        'Template créé avec succès. Les cours ont été générés pour les 4 prochaines semaines.',
    },
    201
  );
}

async function updateTemplate(id, request, env, lessonRepo) {
  const data = await request.json();

  const template = await lessonRepo.updateTemplate(id, data);

  if (!template) {
    return jsonResponse(
      {
        success: false,
        error: 'Template not found',
      },
      404
    );
  }

  return jsonResponse({
    success: true,
    data: template,
    message: 'Template mis à jour avec succès',
  });
}

async function deleteTemplate(id, request, env, lessonRepo) {
  const url = new URL(request.url);
  const deleteFutureInstances = url.searchParams.get('delete_future_instances') === 'true';

  if (deleteFutureInstances) {
    // Supprimer les instances futures non modifiées
    const db = lessonRepo.db;
    const today = new Date().toISOString().split('T')[0];

    // D'abord récupérer les instances à supprimer
    const { data: instances } = await db
      .from('lesson_instances')
      .select('id')
      .eq('template_id', id)
      .gte('lesson_date', today)
      .eq('is_modified', false);

    if (instances && instances.length > 0) {
      // Supprimer les participants d'abord
      await db
        .from('lesson_participants')
        .delete()
        .in(
          'lesson_instance_id',
          instances.map((i) => i.id)
        );

      // Puis supprimer les instances
      await db
        .from('lesson_instances')
        .delete()
        .in(
          'id',
          instances.map((i) => i.id)
        );
    }
  }

  await lessonRepo.deleteTemplate(id);

  return jsonResponse({
    success: true,
    message: 'Template supprimé avec succès',
  });
}

async function getTemplateParticipants(id, env, lessonRepo) {
  const result = await lessonRepo.findDefaultParticipantsByTemplateId(id);

  return jsonResponse({
    success: true,
    data: result.results || [],
  });
}

async function generateTemplateInstances(id, request, env) {
  const data = await request.json();

  if (!data.start_date || !data.end_date) {
    return jsonResponse(
      {
        success: false,
        error: 'start_date et end_date sont requis',
      },
      400
    );
  }

  // Récupérer le template complet
  const template = await lessonRepo.findTemplateById(id);
  if (!template) {
    return jsonResponse({ success: false, error: 'Template non trouvé' }, 404);
  }

  const db = lessonRepo.db;
  const result = await generateLessonInstances(template, data.start_date, data.end_date, db);

  return jsonResponse({
    success: true,
    ...result,
    message: `${result.generated} cours générés, ${result.skipped} ignorés`,
  });
}

async function previewTemplateOccurrences(id, request, env) {
  const data = await request.json();

  if (!data.start_date || !data.end_date) {
    return jsonResponse(
      {
        success: false,
        error: 'start_date et end_date sont requis',
      },
      400
    );
  }

  // Utiliser le repository pour récupérer le template
  const db = getDatabase(env);
  const lessonRepo = new LessonRepository(db);
  const template = await lessonRepo.findTemplateById(id);

  if (!template) {
    return jsonResponse(
      {
        success: false,
        error: 'Template not found',
      },
      404
    );
  }

  const recurrenceRule = JSON.parse(template.recurrence_rule);
  const dates = calculateOccurrences(recurrenceRule, data.start_date, data.end_date);

  const occurrences = dates.map((date) => {
    const dateObj = new Date(date);
    return {
      date,
      start_time: template.start_time,
      day_name: dateObj.toLocaleDateString('fr-FR', { weekday: 'long' }),
    };
  });

  return jsonResponse({
    success: true,
    occurrences,
    total: occurrences.length,
  });
}

// ============================================
// HANDLERS - INSTANCES
// ============================================

async function getLessons(request, env, lessonRepo) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('start_date');
  const endDate = url.searchParams.get('end_date');
  const lessonType = url.searchParams.get('lesson_type');
  const status = url.searchParams.get('status');
  const excludeBlocked = url.searchParams.get('exclude_blocked') === 'true';

  if (!startDate || !endDate) {
    return jsonResponse(
      {
        success: false,
        error: 'start_date et end_date sont requis',
      },
      400
    );
  }

  const result = await lessonRepo.findInstancesByDateRange(startDate, endDate, {
    lessonType,
    status,
    excludeBlocked,
  });

  return jsonResponse({
    success: true,
    data: result.results || [],
  });
}

async function getLesson(id, env, lessonRepo) {
  const lesson = await lessonRepo.findInstanceById(id, true);

  if (!lesson) {
    return jsonResponse(
      {
        success: false,
        error: 'Lesson not found',
      },
      404
    );
  }

  return jsonResponse({
    success: true,
    data: lesson,
  });
}

async function createLesson(request, env, lessonRepo) {
  const data = await request.json();

  // Validation
  if (
    !data.name ||
    !data.lesson_type ||
    !data.lesson_date ||
    !data.start_time ||
    !data.duration_minutes
  ) {
    return jsonResponse(
      {
        success: false,
        error: 'Champs requis manquants',
      },
      400
    );
  }

  // Calculer l'heure de fin
  const [hours, minutes] = data.start_time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + data.duration_minutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`;

  // Vérifier les conflits avec plages bloquées
  const blockedPeriods = await lessonRepo.checkBlockedPeriods(
    data.lesson_date,
    data.start_time,
    endTime
  );

  if (blockedPeriods.results && blockedPeriods.results.length > 0) {
    return jsonResponse(
      {
        success: false,
        error: 'Conflit avec une plage bloquée',
        blocked_by: blockedPeriods.results[0],
      },
      409
    );
  }

  const lesson = await lessonRepo.createInstance({
    ...data,
    end_time: endTime,
  });

  return jsonResponse(
    {
      success: true,
      data: lesson,
      message: 'Cours créé avec succès',
    },
    201
  );
}

async function updateLesson(id, request, env, lessonRepo) {
  const data = await request.json();

  // Si modification de l'horaire, vérifier les conflits
  if (data.start_time || data.end_time) {
    const lesson = await lessonRepo.findInstanceById(id, false);
    if (!lesson) {
      return jsonResponse(
        {
          success: false,
          error: 'Lesson not found',
        },
        404
      );
    }

    const startTime = data.start_time || lesson.start_time;
    const endTime = data.end_time || lesson.end_time;

    const blockedPeriods = await lessonRepo.checkBlockedPeriods(
      lesson.lesson_date,
      startTime,
      endTime,
      id
    );

    if (blockedPeriods.results && blockedPeriods.results.length > 0) {
      return jsonResponse(
        {
          success: false,
          error: 'Conflit avec une plage bloquée',
          blocked_by: blockedPeriods.results[0],
        },
        409
      );
    }
  }

  const lesson = await lessonRepo.updateInstance(id, data);

  if (!lesson) {
    return jsonResponse(
      {
        success: false,
        error: 'Lesson not found',
      },
      404
    );
  }

  return jsonResponse({
    success: true,
    data: lesson,
    message: 'Cours mis à jour avec succès',
  });
}

async function cancelLesson(id, request, env, lessonRepo) {
  const data = await request.json();

  const lesson = await lessonRepo.updateInstance(id, {
    status: 'cancelled',
    cancellation_reason: data.reason || null,
  });

  if (!lesson) {
    return jsonResponse(
      {
        success: false,
        error: 'Lesson not found',
      },
      404
    );
  }

  return jsonResponse({
    success: true,
    data: lesson,
    message: 'Cours annulé avec succès',
  });
}

async function markLessonNotGiven(id, request, env, lessonRepo) {
  const data = await request.json();

  const lesson = await lessonRepo.markAsNotGiven(id, data.reason || null);

  if (!lesson) {
    return jsonResponse(
      {
        success: false,
        error: 'Lesson not found',
      },
      404
    );
  }

  return jsonResponse({
    success: true,
    data: lesson,
    message: 'Cours marqué comme non donné par Laury',
  });
}

// ============================================
// HANDLERS - PARTICIPANTS
// ============================================

async function addParticipant(lessonId, request, env, lessonRepo) {
  const data = await request.json();

  if (!data.rider_id) {
    return jsonResponse(
      {
        success: false,
        error: 'rider_id est requis',
      },
      400
    );
  }

  // Vérifier que le cours n'est pas une plage bloquée
  const lesson = await lessonRepo.findInstanceById(lessonId, false);
  if (!lesson) {
    return jsonResponse(
      {
        success: false,
        error: 'Lesson not found',
      },
      404
    );
  }

  if (lesson.lesson_type === 'blocked') {
    return jsonResponse(
      {
        success: false,
        error: "Impossible d'ajouter des participants à une plage bloquée",
      },
      400
    );
  }

  // Vérifier la capacité
  if (lesson.max_participants) {
    const participants = await lessonRepo.findParticipantsByLessonId(lessonId);
    if (participants.results.length >= lesson.max_participants) {
      return jsonResponse(
        {
          success: false,
          error: 'Capacité maximale atteinte',
        },
        400
      );
    }
  }

  const participant = await lessonRepo.addParticipant({
    lesson_instance_id: lessonId,
    ...data,
  });

  return jsonResponse(
    {
      success: true,
      data: participant,
      message: 'Participant ajouté avec succès',
    },
    201
  );
}

async function updateParticipant(lessonId, participantId, request, env, lessonRepo) {
  const data = await request.json();

  const participant = await lessonRepo.updateParticipant(participantId, data);

  if (!participant) {
    return jsonResponse(
      {
        success: false,
        error: 'Participant not found',
      },
      404
    );
  }

  return jsonResponse({
    success: true,
    data: participant,
    message: 'Participant mis à jour avec succès',
  });
}

async function removeParticipant(lessonId, participantId, env, lessonRepo) {
  await lessonRepo.removeParticipant(participantId);

  return jsonResponse({
    success: true,
    message: 'Participant retiré avec succès',
  });
}

// ============================================
// HANDLERS - VUES CALENDRIER
// ============================================

async function getWeekSchedule(request, env, lessonRepo) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') || new Date().toISOString().split('T')[0];
  const excludeBlocked = url.searchParams.get('exclude_blocked') === 'true';

  // Calculer le début et la fin de la semaine
  const refDate = new Date(date);
  const dayOfWeek = refDate.getDay();
  const startOfWeek = new Date(refDate);
  startOfWeek.setDate(refDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const result = await lessonRepo.findInstancesByDateRange(
    startOfWeek.toISOString().split('T')[0],
    endOfWeek.toISOString().split('T')[0],
    { excludeBlocked }
  );

  const lessons = result.results || [];

  // Organiser par jour
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    days.push({
      date: dateStr,
      day_name: currentDate.toLocaleDateString('fr-FR', { weekday: 'long' }),
      lessons: lessons.filter((l) => l.lesson_date === dateStr),
    });
  }

  return jsonResponse({
    success: true,
    period: {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0],
    },
    days,
    statistics: {
      total_lessons: lessons.filter((l) => l.lesson_type !== 'blocked').length,
      total_participants: lessons.reduce((sum, l) => sum + (parseInt(l.participant_count) || 0), 0),
      blocked_periods: lessons.filter((l) => l.lesson_type === 'blocked').length,
    },
  });
}

async function getBlockedPeriods(request, env, lessonRepo) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('start_date');
  const endDate = url.searchParams.get('end_date');

  const result = await lessonRepo.findActiveBlockedPeriods(startDate, endDate);

  return jsonResponse({
    success: true,
    data: result.results || [],
  });
}

async function getLessonsNotGiven(request, env, lessonRepo) {
  const url = new URL(request.url);
  const startDate = url.searchParams.get('start_date');
  const endDate = url.searchParams.get('end_date');

  const result = await lessonRepo.findLessonsNotGivenByLaury({
    startDate,
    endDate,
  });

  return jsonResponse({
    success: true,
    data: result.results || [],
  });
}

async function checkAvailability(request, env, lessonRepo) {
  const data = await request.json();

  if (!data.date || !data.start_time || !data.duration) {
    return jsonResponse(
      {
        success: false,
        error: 'date, start_time et duration sont requis',
      },
      400
    );
  }

  // Calculer l'heure de fin
  const [hours, minutes] = data.start_time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + data.duration;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:00`;

  // Vérifier les conflits avec plages bloquées
  const blockedPeriods = await lessonRepo.checkBlockedPeriods(data.date, data.start_time, endTime);

  const available = !blockedPeriods.results || blockedPeriods.results.length === 0;

  return jsonResponse({
    success: true,
    available,
    conflicts: {
      blocked_periods: blockedPeriods.results || [],
    },
  });
}

// ============================================
// HANDLERS - GÉNÉRATION
// ============================================

async function generateAllInstances(request, env) {
  const data = await request.json();
  const weeksAhead = data.weeks_ahead || 4;

  const db = getDatabase(env);
  const results = await generateUpcomingInstances(weeksAhead, db);

  const totalGenerated = results.reduce((sum, r) => sum + (r.generated || 0), 0);
  const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);

  return jsonResponse({
    success: true,
    total_generated: totalGenerated,
    total_skipped: totalSkipped,
    results,
    message: `${totalGenerated} cours générés pour les ${weeksAhead} prochaines semaines`,
  });
}
