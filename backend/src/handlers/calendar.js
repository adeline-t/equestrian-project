import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError, handleRateLimitError } from '../utils/errorHandler.js';

const SLOT_STATUSES = ['scheduled', 'confirmed', 'cancelled', 'blocked'];
const HORSE_ASSIGNMENT_TYPES = ['manual', 'automatic']; // adjust to your DB enum
const EVENT_TYPES = ['lesson', 'private', 'group']; // adjust to your DB enum

// -----------------------------
// Calendar / Planning Handler
// -----------------------------
export async function handleCalendar(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('calendar.rateLimit');
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  try {
    // -----------------------------
    // PLANNING SLOTS
    // -----------------------------
    if (pathParts[2] === 'slots') {
      return handlePlanningSlots(request, env, pathParts);
    }

    // -----------------------------
    // EVENTS (Lessons)
    // -----------------------------
    if (pathParts[2] === 'events') {
      return handleEvents(request, env, pathParts);
    }

    // -----------------------------
    // EVENT PARTICIPANTS
    // -----------------------------
    if (pathParts[2] === 'participants') {
      return handleEventParticipants(request, env, pathParts);
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

// -----------------------------
// PLANNING SLOTS HANDLER
// -----------------------------
export async function handlePlanningSlots(request, env, pathParts) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('slots.rateLimit');

  const slotColumns = [
    'slot_status',
    'actual_instructor_id',
    'cancellation_reason',
    'start_time',
    'end_time',
    'is_all_day',
  ];

  try {
    const id = pathParts[3] ? parseInt(pathParts[3], 10) : null;
    if (id !== null && isNaN(id))
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    // GET all slots
    if (request.method === 'GET' && !id) {
      const { data, error } = await db.from('planning_slots').select('*').is('deleted_at', null);
      if (error) return handleDatabaseError(error, 'slots.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create slot
    if (request.method === 'POST' && !id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(
        ['start_time', 'end_time', 'slot_status', 'is_all_day'],
        body
      );
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!SLOT_STATUSES.includes(body.slot_status)) {
        return jsonResponse({ error: 'slot_status invalide' }, 400, getSecurityHeaders());
      }

      if (new Date(body.start_time) > new Date(body.end_time)) {
        return jsonResponse(
          { error: 'start_time doit précéder end_time' },
          400,
          getSecurityHeaders()
        );
      }

      const slotData = {};
      for (const col of slotColumns) {
        if (body[col] !== undefined) slotData[col] = body[col];
      }

      const { data, error } = await db.from('planning_slots').insert(slotData).select().single();
      if (error) return handleDatabaseError(error, 'slots.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update slot
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      if (body.start_time && body.end_time && new Date(body.start_time) > new Date(body.end_time)) {
        return jsonResponse(
          { error: 'start_time doit précéder end_time' },
          400,
          getSecurityHeaders()
        );
      }

      if (body.slot_status && !SLOT_STATUSES.includes(body.slot_status)) {
        return jsonResponse({ error: 'slot_status invalide' }, 400, getSecurityHeaders());
      }

      const updateData = { updated_at: new Date().toISOString() };
      for (const col of slotColumns) {
        if (body[col] !== undefined) updateData[col] = body[col];
      }

      const { data, error } = await db
        .from('planning_slots')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'slots.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE slot (soft delete)
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('planning_slots')
        .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
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

// -----------------------------
// EVENTS HANDLER
// -----------------------------
export async function handleEvents(request, env, pathParts) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('events.rateLimit');

  const eventColumns = [
    'planning_slot_id',
    'event_type',
    'instructor_id',
    'min_participants',
    'max_participants',
  ];

  try {
    const id = pathParts[3] ? parseInt(pathParts[3], 10) : null;
    if (id !== null && isNaN(id))
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    // GET all events
    if (request.method === 'GET' && !id) {
      const { data, error } = await db.from('events').select('*').is('deleted_at', null);
      if (error) return handleDatabaseError(error, 'events.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create event
    if (request.method === 'POST' && !id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(['planning_slot_id', 'event_type', 'instructor_id'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!EVENT_TYPES.includes(body.event_type)) {
        return jsonResponse({ error: 'event_type invalide' }, 400, getSecurityHeaders());
      }

      const updateData = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      for (const col of eventColumns) {
        if (body[col] !== undefined) updateData[col] = body[col];
      }

      if (body.min_participants != null && body.min_participants < 0)
        return jsonResponse({ error: 'min_participants >= 0' }, 400, getSecurityHeaders());
      if (body.max_participants != null && body.max_participants < 0)
        return jsonResponse({ error: 'max_participants >= 0' }, 400, getSecurityHeaders());

      const { data, error } = await db.from('events').insert(updateData).select().single();
      if (error) return handleDatabaseError(error, 'events.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update event
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      if (body.event_type && !EVENT_TYPES.includes(body.event_type))
        return jsonResponse({ error: 'event_type invalide' }, 400, getSecurityHeaders());
      if (body.min_participants != null && body.min_participants < 0)
        return jsonResponse({ error: 'min_participants >= 0' }, 400, getSecurityHeaders());
      if (body.max_participants != null && body.max_participants < 0)
        return jsonResponse({ error: 'max_participants >= 0' }, 400, getSecurityHeaders());

      const updateData = { updated_at: new Date().toISOString() };
      for (const col of eventColumns) {
        if (body[col] !== undefined) updateData[col] = body[col];
      }

      const { data, error } = await db
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'events.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE event (soft delete)
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('events')
        .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'events.delete');
      return jsonResponse({ message: 'Event supprimé', event: data }, 200, getSecurityHeaders());
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

// -----------------------------
// EVENT PARTICIPANTS HANDLER
// -----------------------------
export async function handleEventParticipants(request, env, pathParts) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('participants.rateLimit');

  const participantColumns = [
    'event_id',
    'planning_slot_id',
    'rider_id',
    'horse_id',
    'horse_assignment_type',
    'is_cancelled',
  ];

  try {
    const id = pathParts[3] ? parseInt(pathParts[3], 10) : null;
    if (id !== null && isNaN(id))
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    // GET all participants
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('event_participants')
        .select('*')
        .is('is_cancelled', false);
      if (error) return handleDatabaseError(error, 'participants.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST add participant
    if (request.method === 'POST' && !id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(
        ['event_id', 'planning_slot_id', 'rider_id', 'horse_assignment_type'],
        body
      );
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!HORSE_ASSIGNMENT_TYPES.includes(body.horse_assignment_type)) {
        return jsonResponse({ error: 'horse_assignment_type invalide' }, 400, getSecurityHeaders());
      }

      const insertData = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      for (const col of participantColumns) {
        if (body[col] !== undefined) insertData[col] = body[col];
      }

      const { data, error } = await db
        .from('event_participants')
        .insert(insertData)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update participant
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      if (
        body.horse_assignment_type &&
        !HORSE_ASSIGNMENT_TYPES.includes(body.horse_assignment_type)
      ) {
        return jsonResponse({ error: 'horse_assignment_type invalide' }, 400, getSecurityHeaders());
      }

      const updateData = { updated_at: new Date().toISOString() };
      for (const col of participantColumns) {
        if (body[col] !== undefined) updateData[col] = body[col];
      }

      const { data, error } = await db
        .from('event_participants')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE participant (soft cancel)
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('event_participants')
        .update({ is_cancelled: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.delete');
      return jsonResponse(
        { message: 'Participant annulé', participant: data },
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
