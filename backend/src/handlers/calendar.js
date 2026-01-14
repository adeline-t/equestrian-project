/* Consolidated calendar handler (use with your router) */
import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError, handleRateLimitError } from '../utils/errorHandler.js';

export async function handleCalendar(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('calendar.rateLimit');
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  try {
    // GET /api/calendar/lessons
    if (request.method === 'GET' && pathParts[1] === 'lessons' && pathParts.length === 2) {
      const startDate = url.searchParams.get('start_date');
      const endDate = url.searchParams.get('end_date');
      if (!startDate || !endDate)
        return jsonResponse(
          { error: 'start_date et end_date sont requis' },
          400,
          getSecurityHeaders()
        );

      const { data, error } = await db
        .from('lessons')
        .select('*, planning_slots(*)')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .is('deleted_at', null);
      if (error) return handleDatabaseError(error, 'calendar.getLessons');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/calendar/lessons
    if (request.method === 'POST' && pathParts[1] === 'lessons') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());
      const missing = validateRequired(['lesson_type', 'planning_slot_id', 'instructor_id'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      const { data: slot, error: slotErr } = await db
        .from('planning_slots')
        .select('id')
        .eq('id', body.planning_slot_id)
        .single();
      if (slotErr || !slot)
        return jsonResponse({ error: 'Planning slot introuvable' }, 400, getSecurityHeaders());

      const insertData = {
        planning_slot_id: body.planning_slot_id,
        lesson_type: body.lesson_type,
        status: body.status || 'scheduled',
        instructor_id: body.instructor_id,
        actual_instructor_id: body.actual_instructor_id ?? null,
        min_participants: body.min_participants ?? null,
        max_participants: body.max_participants ?? null,
        cancellation_reason: body.cancellation_reason ?? null,
        is_modified: body.is_modified ?? false,
        modified_fields: body.modified_fields ?? null,
      };

      const { data, error } = await db.from('lessons').insert(insertData).select().single();
      if (error) return handleDatabaseError(error, 'calendar.createLesson');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // GET /api/calendar/slots
    if (request.method === 'GET' && pathParts[1] === 'slots') {
      const startAt = url.searchParams.get('start_at');
      const endAt = url.searchParams.get('end_at');
      let query = db.from('planning_slots').select('*');
      if (startAt) query = query.gte('start_at', startAt);
      if (endAt) query = query.lte('end_at', endAt);
      const { data, error } = await query;
      if (error) return handleDatabaseError(error, 'calendar.getSlots');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/calendar/slots
    if (request.method === 'POST' && pathParts[1] === 'slots') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());
      const missing = validateRequired(['start_at', 'end_at', 'type'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());
      if (new Date(body.end_at) <= new Date(body.start_at))
        return jsonResponse(
          { error: 'end_at doit être après start_at' },
          400,
          getSecurityHeaders()
        );
      const insertData = {
        start_at: body.start_at,
        end_at: body.end_at,
        all_day: body.all_day ?? false,
        type: body.type,
      };
      const { data, error } = await db.from('planning_slots').insert(insertData).select().single();
      if (error) return handleDatabaseError(error, 'calendar.createSlot');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (err) {
    console.error('Unexpected error:', err);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}
