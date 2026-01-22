import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError, handleUnexpectedError } from '../../utils/errorHandler.js';

const EVENT_TYPES = ['private_lesson', 'grouped_lesson', 'service', 'blocked'];

export async function handleEvents(request, env, idParam) {
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  const db = getDatabase(env);
  const eventColumns = [
    'event_type',
    'instructor_id',
    'min_participants',
    'max_participants',
    'name',
  ];

  try {
    // GET list
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('events')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) return handleDatabaseError(error, 'events.list', env);
      return jsonResponse(data || [], 200, getSecurityHeaders());
    }

    // GET single
    if (request.method === 'GET' && id) {
      const { data, error } = await db
        .from('events')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();
      if (error) return handleDatabaseError(error, 'events.get', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(['event_type', 'instructor_id'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!EVENT_TYPES.includes(body.event_type))
        return jsonResponse(
          { error: `event_type invalide. Valeurs: ${EVENT_TYPES.join(', ')}` },
          400,
          getSecurityHeaders()
        );

      if (body.min_participants != null && body.min_participants < 0)
        return jsonResponse({ error: 'min_participants >= 0' }, 400, getSecurityHeaders());
      if (body.max_participants != null && body.max_participants < 0)
        return jsonResponse({ error: 'max_participants >= 0' }, 400, getSecurityHeaders());

      const insertData = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        min_participants: body.min_participants ?? 0,
        max_participants: body.max_participants ?? 0,
      };
      for (const col of eventColumns) if (body[col] !== undefined) insertData[col] = body[col];

      const { data, error } = await db.from('events').insert(insertData).select().single();
      if (error) return handleDatabaseError(error, 'events.create', env);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      if (body.event_type && !EVENT_TYPES.includes(body.event_type))
        return jsonResponse(
          { error: `event_type invalide. Valeurs: ${EVENT_TYPES.join(', ')}` },
          400,
          getSecurityHeaders()
        );
      if (body.min_participants != null && body.min_participants < 0)
        return jsonResponse({ error: 'min_participants >= 0' }, 400, getSecurityHeaders());
      if (body.max_participants != null && body.max_participants < 0)
        return jsonResponse({ error: 'max_participants >= 0' }, 400, getSecurityHeaders());

      const updateData = { updated_at: new Date().toISOString() };
      for (const col of eventColumns) if (body[col] !== undefined) updateData[col] = body[col];

      const { data, error } = await db
        .from('events')
        .update(updateData)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'events.update', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE soft delete
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('events')
        .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'events.delete', env);
      return jsonResponse({ message: 'Event supprimé', event: data }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'events', env);
  }
}
