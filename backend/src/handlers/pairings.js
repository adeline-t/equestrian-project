import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError, handleRateLimitError } from '../utils/errorHandler.js';

/**
 * /api/pairings
 */
export async function handlePairings(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('pairings.rateLimit');
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  try {
    // -----------------------------
    // GET /api/pairings
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('rider_horse_pairings')
        .select(
          `
          id,
          rider_id,
          horse_id,
          pairing_start_date,
          pairing_end_date,
          riders (
            id,
            name,
            deleted_at
          ),
          horses (
            id,
            name,
            kind,
            ownership_type,
            deleted_at
          )
        `
        )
        .order('pairing_start_date', { ascending: false });

      if (error) return handleDatabaseError(error, 'pairings.list');

      // Optional: filter out deleted horses/riders
      const activeData = data.filter((p) => !p.riders?.deleted_at && !p.horses?.deleted_at);

      return jsonResponse(activeData, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/pairings/:id
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2]);
      if (isNaN(pairingId))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('rider_horse_pairings')
        .select(
          `
          id,
          rider_id,
          horse_id,
          pairing_start_date,
          pairing_end_date,
          riders (id, name, phone, email, deleted_at),
          horses (id, name, kind, ownership_type, deleted_at)
        `
        )
        .eq('id', pairingId)
        .single();

      if (error) return handleDatabaseError(error, 'pairings.get');
      if (data.riders?.deleted_at || data.horses?.deleted_at)
        return jsonResponse({ error: 'Pairing non trouvée' }, 404, getSecurityHeaders());

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/pairings
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const missingFields = validateRequired(['rider_id', 'horse_id'], body);
      if (missingFields)
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );

      const riderId = parseInt(body.rider_id);
      const horseId = parseInt(body.horse_id);
      if (isNaN(riderId) || isNaN(horseId))
        return jsonResponse({ error: 'IDs invalides' }, 400, getSecurityHeaders());

      // Check existence of rider and horse (skip deleted)
      const [riderCheck, horseCheck] = await Promise.all([
        db.from('riders').select('id').eq('id', riderId).is('deleted_at', null).single(),
        db.from('horses').select('id').eq('id', horseId).is('deleted_at', null).single(),
      ]);

      if (riderCheck.error || horseCheck.error)
        return jsonResponse({ error: 'Cavalier ou cheval invalide' }, 400, getSecurityHeaders());

      // Validate dates
      if (
        body.pairing_start_date &&
        body.pairing_end_date &&
        new Date(body.pairing_start_date) > new Date(body.pairing_end_date)
      ) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      const pairingData = {
        rider_id: riderId,
        horse_id: horseId,
        pairing_start_date: body.pairing_start_date ?? null,
        pairing_end_date: body.pairing_end_date ?? null,
      };

      const { data, error } = await db
        .from('rider_horse_pairings')
        .insert(pairingData)
        .select(
          `
          id,
          rider_id,
          horse_id,
          pairing_start_date,
          pairing_end_date,
          riders (id, name),
          horses (id, name, kind, ownership_type)
        `
        )
        .single();

      if (error) return handleDatabaseError(error, 'pairings.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/pairings/:id
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);
      if (isNaN(pairingId) || !body)
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );

      // Validate dates
      if (
        body.pairing_start_date &&
        body.pairing_end_date &&
        new Date(body.pairing_start_date) > new Date(body.pairing_end_date)
      ) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = { updated_at: new Date().toISOString() };
      if (body.pairing_start_date !== undefined)
        updateData.pairing_start_date = body.pairing_start_date;
      if (body.pairing_end_date !== undefined) updateData.pairing_end_date = body.pairing_end_date;

      // Optional: allow updating rider_id and horse_id if they exist and are not deleted
      if (body.rider_id !== undefined) {
        const riderId = parseInt(body.rider_id);
        if (!isNaN(riderId)) {
          const { error } = await db
            .from('riders')
            .select('id')
            .eq('id', riderId)
            .is('deleted_at', null)
            .single();
          if (!error) updateData.rider_id = riderId;
        }
      }

      if (body.horse_id !== undefined) {
        const horseId = parseInt(body.horse_id);
        if (!isNaN(horseId)) {
          const { error } = await db
            .from('horses')
            .select('id')
            .eq('id', horseId)
            .is('deleted_at', null)
            .single();
          if (!error) updateData.horse_id = horseId;
        }
      }

      const { data, error } = await db
        .from('rider_horse_pairings')
        .update(updateData)
        .eq('id', pairingId)
        .select(
          `
          id,
          rider_id,
          horse_id,
          pairing_start_date,
          pairing_end_date,
          riders (id, name),
          horses (id, name, kind, ownership_type)
        `
        )
        .single();

      if (error) return handleDatabaseError(error, 'pairings.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/pairings/:id
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2]);
      if (isNaN(pairingId))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { error } = await db.from('rider_horse_pairings').delete().eq('id', pairingId);
      if (error) return handleDatabaseError(error, 'pairings.delete');

      return jsonResponse({ message: 'Pairing supprimée avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}
