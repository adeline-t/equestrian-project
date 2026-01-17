import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError, handleRateLimitError } from '../utils/errorHandler.js';

const LESSON_STATUSES = ['scheduled', 'confirmed', 'cancelled', 'blocked'];

/**
 * /api/calendar/lessons
 */
export async function handleCalendar(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('calendar.rateLimit');
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  try {
    // -----------------------------
    // GET /api/calendar/lessons - list all lessons
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const { data, error } = await db
        .from('lessons')
        .select('*')
        .is('deleted_at', null)
        .order('start_time', { ascending: true });

      if (error) return handleDatabaseError(error, 'lessons.list');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/calendar/lessons/:id
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 4) {
      const id = parseInt(pathParts[3], 10);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('lessons')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) return handleDatabaseError(error, 'lessons.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/calendar/lessons - create lesson
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 3) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(['title', 'start_time', 'end_time'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (new Date(body.start_time) > new Date(body.end_time)) {
        return jsonResponse(
          { error: 'start_time doit précéder end_time' },
          400,
          getSecurityHeaders()
        );
      }

      const { data, error } = await db.from('lessons').insert(body).select().single();
      if (error) return handleDatabaseError(error, 'lessons.create');

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/calendar/lessons/:id - update lesson
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 4) {
      const id = parseInt(pathParts[3], 10);
      const body = await request.json().catch(() => null);
      if (isNaN(id) || !body)
        return jsonResponse({ error: 'ID ou corps invalide' }, 400, getSecurityHeaders());

      if (body.start_time && body.end_time && new Date(body.start_time) > new Date(body.end_time)) {
        return jsonResponse(
          { error: 'start_time doit précéder end_time' },
          400,
          getSecurityHeaders()
        );
      }

      const { data, error } = await db.from('lessons').update(body).eq('id', id).select().single();
      if (error) return handleDatabaseError(error, 'lessons.update');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/calendar/lessons/:id - soft delete
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 4) {
      const id = parseInt(pathParts[3], 10);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('lessons')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) return handleDatabaseError(error, 'lessons.delete');
      return jsonResponse({ message: 'Lesson supprimée', lesson: data }, 200, getSecurityHeaders());
    }

    // -----------------------------
    // LESSON PARTICIPANTS
    // -----------------------------
    if (pathParts[2] === 'participants') {
      return handleLessonParticipants(request, env, pathParts);
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (err) {
    console.error(err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}

/**
 * /api/calendar/lessons/participants
 */
export async function handleLessonParticipants(request, env, pathParts) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('participants.rateLimit');

  try {
    // GET all participants for a lesson
    if (request.method === 'GET' && pathParts.length === 4) {
      const lessonId = parseInt(pathParts[3], 10);
      if (isNaN(lessonId)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('lesson_participants')
        .select('*')
        .eq('lesson_id', lessonId)
        .is('is_cancelled', false);

      if (error) return handleDatabaseError(error, 'participants.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST add participant
    if (request.method === 'POST' && pathParts.length === 4) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(['lesson_id', 'rider_id'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      const { data, error } = await db.from('lesson_participants').insert(body).select().single();
      if (error) return handleDatabaseError(error, 'participants.create');

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT participant (e.g., cancel)
    if (request.method === 'PUT' && pathParts.length === 5) {
      const id = parseInt(pathParts[4], 10);
      const body = await request.json().catch(() => null);
      if (isNaN(id) || !body)
        return jsonResponse({ error: 'ID ou corps invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('lesson_participants')
        .update(body)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.update');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE participant
    if (request.method === 'DELETE' && pathParts.length === 5) {
      const id = parseInt(pathParts[4], 10);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('lesson_participants')
        .update({ is_cancelled: true })
        .eq('id', id)
        .select()
        .single();

      if (error) return handleDatabaseError(error, 'participants.delete');
      return jsonResponse(
        { message: 'Participant supprimé', participant: data },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (err) {
    console.error(err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}

/**
 * /api/calendar/slots
 */
export async function handlePlanningSlots(request, env) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('slots.rateLimit');
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  try {
    // GET all slots
    if (request.method === 'GET' && pathParts.length === 3) {
      const { data, error } = await db.from('planning_slots').select('*');
      if (error) return handleDatabaseError(error, 'slots.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create slot
    if (request.method === 'POST' && pathParts.length === 3) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(['start_time', 'end_time'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      const { data, error } = await db.from('planning_slots').insert(body).select().single();
      if (error) return handleDatabaseError(error, 'slots.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT /api/calendar/slots/:id
    if (request.method === 'PUT' && pathParts.length === 4) {
      const id = parseInt(pathParts[3], 10);
      const body = await request.json().catch(() => null);
      if (isNaN(id) || !body)
        return jsonResponse({ error: 'ID ou corps invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('planning_slots')
        .update(body)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'slots.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE /api/calendar/slots/:id
    if (request.method === 'DELETE' && pathParts.length === 4) {
      const id = parseInt(pathParts[3], 10);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('planning_slots')
        .delete()
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'slots.delete');
      return jsonResponse(
        { message: 'Planning slot supprimé', slot: data },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (err) {
    console.error(err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}
