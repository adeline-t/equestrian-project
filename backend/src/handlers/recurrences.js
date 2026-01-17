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
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  const columns = ['frequency', 'interval', 'by_week_days', 'start_time', 'end_time'];

  try {
    // -----------------------------
    // GET all recurrences
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const { data, error } = await db
        .from('recurrences')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return handleDatabaseError(error, 'recurrences.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET single recurrence
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 4) {
      const id = Number(pathParts[3]);
      if (!Number.isInteger(id))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db.from('recurrences').select('*').eq('id', id).single();
      if (error) return handleDatabaseError(error, 'recurrences.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST create recurrence
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 3) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(['frequency'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!RECURRENCE_FREQUENCIES.includes(body.frequency)) {
        return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());
      }

      const interval = body.interval ?? 1;
      if (!Number.isInteger(interval) || interval < 1) {
        return jsonResponse(
          { error: 'interval doit être un entier > 0' },
          400,
          getSecurityHeaders()
        );
      }

      const byWeekDays = Array.isArray(body.by_week_days)
        ? body.by_week_days.filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
        : null;

      const insertData = {
        frequency: body.frequency,
        interval,
        by_week_days: byWeekDays,
        start_time: body.start_time ?? null,
        end_time: body.end_time ?? null,
      };

      const { data, error } = await db.from('recurrences').insert(insertData).select().single();
      if (error) return handleDatabaseError(error, 'recurrences.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT update recurrence
    // -----------------------------
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

      const updateData = { updated_at: new Date().toISOString() };

      if (body.frequency) {
        if (!RECURRENCE_FREQUENCIES.includes(body.frequency)) {
          return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());
        }
        updateData.frequency = body.frequency;
      }

      if (body.interval !== undefined) {
        if (!Number.isInteger(body.interval) || body.interval < 1) {
          return jsonResponse(
            { error: 'interval doit être un entier > 0' },
            400,
            getSecurityHeaders()
          );
        }
        updateData.interval = body.interval;
      }

      if (body.by_week_days !== undefined) {
        const byWeekDays = Array.isArray(body.by_week_days)
          ? body.by_week_days.filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
          : null;
        updateData.by_week_days = byWeekDays;
      }

      if (body.start_time !== undefined) updateData.start_time = body.start_time;
      if (body.end_time !== undefined) updateData.end_time = body.end_time;

      const { data, error } = await db
        .from('recurrences')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'recurrences.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE recurrence
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 4) {
      const id = Number(pathParts[3]);
      if (!Number.isInteger(id))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

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
