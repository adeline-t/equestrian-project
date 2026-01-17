import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError } from '../utils/errorHandler.js';

const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly'];

/**
 * /api/calendar/recurrences
 */
export async function handleRecurrences(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // --------------------------------
    // GET /api/calendar/recurrences
    // --------------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const { data, error } = await db
        .from('recurrences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return handleDatabaseError(error, 'recurrences.list');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // --------------------------------
    // GET /api/calendar/recurrences/:id
    // --------------------------------
    if (request.method === 'GET' && pathParts.length === 4) {
      const id = Number(pathParts[3]);
      if (!Number.isInteger(id)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db.from('recurrences').select('*').eq('id', id).single();

      if (error) return handleDatabaseError(error, 'recurrences.get');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // --------------------------------
    // POST /api/calendar/recurrences
    // --------------------------------
    if (request.method === 'POST' && pathParts.length === 3) {
      const body = await request.json().catch(() => null);
      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      const missing = validateRequired(['lesson_id', 'frequency', 'start_date'], body);
      if (missing) {
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());
      }

      if (!RECURRENCE_FREQUENCIES.includes(body.frequency)) {
        return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());
      }

      const recurrenceData = {
        lesson_id: body.lesson_id,
        frequency: body.frequency,
        interval: body.interval ?? 1,
        start_date: body.start_date,
        end_date: body.end_date ?? null,
        by_weekday: body.by_weekday ?? null,
      };

      const { data, error } = await db.from('recurrences').insert(recurrenceData).select().single();

      if (error) return handleDatabaseError(error, 'recurrences.create');

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // --------------------------------
    // PUT /api/calendar/recurrences/:id
    // --------------------------------
    if (request.method === 'PUT' && pathParts.length === 4) {
      const id = Number(pathParts[3]);
      const body = await request.json().catch(() => null);

      if (!Number.isInteger(id) || !body) {
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );
      }

      if (body.frequency && !RECURRENCE_FREQUENCIES.includes(body.frequency)) {
        return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());
      }

      const updateData = {
        ...body,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('recurrences')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) return handleDatabaseError(error, 'recurrences.update');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // --------------------------------
    // DELETE /api/calendar/recurrences/:id
    // --------------------------------
    if (request.method === 'DELETE' && pathParts.length === 4) {
      const id = Number(pathParts[3]);
      if (!Number.isInteger(id)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { error } = await db.from('recurrences').delete().eq('id', id);
      if (error) return handleDatabaseError(error, 'recurrences.delete');

      return jsonResponse(
        { message: 'Récurrence supprimée avec succès' },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (error) {
    console.error('Error in handleRecurrences:', error);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: error.message },
      500,
      getSecurityHeaders()
    );
  }
}
