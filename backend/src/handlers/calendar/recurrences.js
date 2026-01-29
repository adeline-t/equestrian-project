import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError, handleUnexpectedError } from '../../utils/errorHandler.js';

const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly'];

export async function handleRecurrences(request, env, idParam) {
  const db = getDatabase(env);
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  try {
    // GET all - inclut les données de l'event lié
    if (request.method === 'GET' && !id) {
      const url = new URL(request.url);
      const eventId = url.searchParams.get('event_id');

      // GET by event_id - récupérer toutes les récurrences d'un event
      if (eventId) {
        const eventIdNum = parseInt(eventId, 10);
        if (isNaN(eventIdNum))
          return jsonResponse({ error: 'event_id invalide' }, 400, getSecurityHeaders());

        const { data, error } = await db
          .from('recurrences')
          .select('*, events(*)')
          .eq('event_id', eventIdNum)
          .order('created_at', { ascending: false });

        if (error) return handleDatabaseError(error, 'recurrences.listByEvent', env);
        return jsonResponse(data, 200, getSecurityHeaders());
      }

      // GET all recurrences
      const { data, error } = await db
        .from('recurrences')
        .select('*, events(*)')
        .order('created_at', { ascending: false });
      if (error) return handleDatabaseError(error, 'recurrences.list', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET single - inclut les données de l'event lié
    if (request.method === 'GET' && id) {
      const { data, error } = await db
        .from('recurrences')
        .select('*, events(*)')
        .eq('id', id)
        .single();
      if (error) return handleDatabaseError(error, 'recurrences.get', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());
      const missing = validateRequired(['frequency', 'event_id'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());
      if (!RECURRENCE_FREQUENCIES.includes(body.frequency))
        return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());

      // Vérifier que l'event existe
      const { data: eventExists, error: eventError } = await db
        .from('events')
        .select('id')
        .eq('id', body.event_id)
        .single();

      if (eventError || !eventExists)
        return jsonResponse({ error: 'Event introuvable' }, 404, getSecurityHeaders());

      const insertData = {
        event_id: body.event_id,
        frequency: body.frequency,
        interval: body.interval ?? 1,
        week_days: Array.isArray(body.week_days)
          ? body.week_days.filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
          : null,
        start_time: body.start_time ?? null, // store as HH:mm:ss
        end_time: body.end_time ?? null,
        is_all_day: body.is_all_day ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db.from('recurrences').insert(insertData).select().single();
      if (error) return handleDatabaseError(error, 'recurrences.create', env);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const updateData = { updated_at: new Date().toISOString() };

      // Vérifier l'event si fourni
      if (body.event_id !== undefined) {
        const { data: eventExists, error: eventError } = await db
          .from('events')
          .select('id')
          .eq('id', body.event_id)
          .single();

        if (eventError || !eventExists)
          return jsonResponse({ error: 'Event introuvable' }, 404, getSecurityHeaders());

        updateData.event_id = body.event_id;
      }

      if (body.frequency) {
        if (!RECURRENCE_FREQUENCIES.includes(body.frequency))
          return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());
        updateData.frequency = body.frequency;
      }
      if (body.interval !== undefined) {
        if (!Number.isInteger(body.interval) || body.interval < 1)
          return jsonResponse(
            { error: 'interval doit être un entier > 0' },
            400,
            getSecurityHeaders()
          );
        updateData.interval = body.interval;
      }
      if (body.week_days !== undefined)
        updateData.week_days = Array.isArray(body.week_days)
          ? body.week_days.filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
          : null;
      if (body.start_time !== undefined) updateData.start_time = body.start_time;
      if (body.end_time !== undefined) updateData.end_time = body.end_time;
      if (body.is_all_day !== undefined) updateData.is_all_day = body.is_all_day;

      const { data, error } = await db
        .from('recurrences')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'recurrences.update', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE
    if (request.method === 'DELETE' && id) {
      const { error } = await db.from('recurrences').delete().eq('id', id);
      if (error) return handleDatabaseError(error, 'recurrences.delete', env);
      return jsonResponse(
        { message: 'Récurrence supprimée avec succès' },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'recurrences', env);
  }
}
