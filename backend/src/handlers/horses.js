import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError, handleRateLimitError } from '../utils/errorHandler.js';

const HORSE_TYPES = ['horse', 'pony'];
const OWNERS = ['laury', 'private_owner', 'club', 'other']; // ✅ Ajout de 'other'
const isActiveBetween = (start, end, today) =>
  (!start || new Date(start) <= today) && (!end || new Date(end) >= today);

/**
 * /api/horses
 */
export async function handleHorses(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('horses.rateLimit');
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  try {
    const today = new Date();

    // -----------------------------
    // GET /api/horses
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data: horses, error: horsesError } = await db
        .from('horses')
        .select('*')
        .is('deleted_at', null)
        .order('name');
      if (horsesError) return handleDatabaseError(horsesError, 'horses.list');

      // Count active riders per horse
      const { data: pairings, error: pairingsError } = await db.from('rider_horse_pairings')
        .select(`
          horse_id,
          pairing_start_date,
          pairing_end_date,
          riders (
            activity_start_date,
            activity_end_date,
            deleted_at
          )
        `);

      if (pairingsError) return handleDatabaseError(pairingsError, 'horses.listPairings');

      const countsByHorse = pairings.reduce((acc, pairing) => {
        const rider = pairing.riders;
        if (
          rider &&
          !rider.deleted_at &&
          isActiveBetween(pairing.pairing_start_date, pairing.pairing_end_date, today) &&
          isActiveBetween(rider.activity_start_date, rider.activity_end_date, today)
        ) {
          acc[pairing.horse_id] = (acc[pairing.horse_id] || 0) + 1;
        }
        return acc;
      }, {});

      const result = horses.map((horse) => ({
        ...horse,
        active_riders_count: countsByHorse[horse.id] || 0,
      }));

      return jsonResponse(result, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/horses/:id
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const horseId = Number(pathParts[2]);
      if (!Number.isInteger(horseId))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('horses')
        .select('*')
        .is('deleted_at', null)
        .eq('id', horseId)
        .single();
      if (error) return handleDatabaseError(error, 'horses.get');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/horses
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const missingFields = validateRequired(['name', 'kind', 'ownership_type'], body);
      if (missingFields)
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );

      if (!HORSE_TYPES.includes(body.kind))
        return jsonResponse(
          { error: 'Le type doit être "horse" ou "pony"' },
          400,
          getSecurityHeaders()
        );
      if (!OWNERS.includes(body.ownership_type))
        return jsonResponse({ error: 'Propriétaire invalide' }, 400, getSecurityHeaders());

      if (
        body.activity_start_date &&
        body.activity_end_date &&
        new Date(body.activity_start_date) > new Date(body.activity_end_date)
      ) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      const horseData = {
        name: body.name.trim(),
        kind: body.kind,
        activity_start_date: body.activity_start_date ?? null,
        activity_end_date: body.activity_end_date ?? null,
        ownership_type: body.ownership_type,
      };

      const { data, error } = await db.from('horses').insert(horseData).select().single();
      if (error) return handleDatabaseError(error, 'horses.create');

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/horses/:id
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 3) {
      const horseId = Number(pathParts[2]);
      const body = await request.json().catch(() => null);
      if (!Number.isInteger(horseId) || !body)
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );

      if (body.kind && !HORSE_TYPES.includes(body.kind))
        return jsonResponse(
          { error: 'Le type doit être "horse" ou "pony"' },
          400,
          getSecurityHeaders()
        );
      if (body.ownership_type && !OWNERS.includes(body.ownership_type))
        return jsonResponse({ error: 'Propriétaire invalide' }, 400, getSecurityHeaders());

      if (
        body.activity_start_date &&
        body.activity_end_date &&
        new Date(body.activity_start_date) > new Date(body.activity_end_date)
      ) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = {
        name: body.name?.trim(),
        kind: body.kind,
        activity_start_date: body.activity_start_date ?? null,
        activity_end_date: body.activity_end_date ?? null,
        ownership_type: body.ownership_type,
        updated_at: new Date().toISOString(),
      };

      Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

      const { data, error } = await db
        .from('horses')
        .update(updateData)
        .eq('id', horseId)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'horses.update');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/horses/:id
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const horseId = Number(pathParts[2]);
      if (!Number.isInteger(horseId))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { count } = await db
        .from('rider_horse_pairings')
        .select('id', { count: 'exact', head: true })
        .eq('horse_id', horseId);
      if (count > 0)
        return jsonResponse(
          { error: 'Impossible de supprimer un cheval avec des cavaliers actifs' },
          409,
          getSecurityHeaders()
        );

      const { error } = await db
        .from('horses')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', horseId);
      if (error) return handleDatabaseError(error, 'horses.delete');

      return jsonResponse({ message: 'Cheval supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}

/**
 * GET /api/horses/:id/riders
 */
export async function handleHorseRiders(request, env, horseId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000))
    return handleRateLimitError('horses.getRiders.rateLimit');

  try {
    const horseIdNum = Number(horseId);
    if (!Number.isInteger(horseIdNum))
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    const { data, error } = await db
      .from('rider_horse_pairings')
      .select(
        `
        id,
        pairing_start_date,
        pairing_end_date,
        riders (
          id,
          name,
          phone,
          email,
          activity_start_date,
          activity_end_date,
          deleted_at
        )
      `
      )
      .eq('horse_id', horseIdNum)
      .order('pairing_start_date', { ascending: false });

    if (error) return handleDatabaseError(error, 'horses.getRiders');

    return jsonResponse(data, 200, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}
