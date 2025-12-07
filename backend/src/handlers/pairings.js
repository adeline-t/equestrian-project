import {
  getDatabase,
  handleDbError,
  jsonResponse,
  validateRequired,
  checkRateLimit,
  getSecurityHeaders,
} from '../db.js';
import {
  handleDatabaseError,
  handleValidationError,
  handleNotFoundError,
  handleRateLimitError,
} from '../utils/errorHandler.js';
import { sanitizePairingData, removeEmptyValues } from '../utils/inputSanitizer.js';

export async function handlePairings(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return handleRateLimitError('pairings.rateLimit');
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // GET /api/pairings - List all pairings
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
          riders (id, name),
          horses (id, name, kind, is_owned_by_laury)
        `
        )
        .order('pairing_start_date', { ascending: false });

      if (error) return handleDatabaseError(error, 'pairings.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET /api/pairings/:id - Get single pairing
    if (request.method === 'GET' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2]);

      if (isNaN(pairingId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db
        .from('rider_horse_pairings')
        .select(
          `
          id,
          rider_id,
          horse_id,
          pairing_start_date,
          pairing_end_date,
          riders (id, name, phone, email),
          horses (id, name, kind, is_owned_by_laury)
        `
        )
        .eq('id', pairingId)
        .single();

      if (error) return handleDatabaseError(error, 'pairings.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/pairings - Create pairing
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);

      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate required fields
      const missingFields = validateRequired(['rider_id', 'horse_id'], body);
      if (missingFields) {
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );
      }

      // Validate IDs
      const riderId = parseInt(body.rider_id);
      const horseId = parseInt(body.horse_id);

      if (isNaN(riderId) || isNaN(horseId)) {
        return jsonResponse({ error: 'IDs invalides' }, 400, getSecurityHeaders());
      }

      // Check if rider and horse exist
      const [riderCheck, horseCheck] = await Promise.all([
        db.from('riders').select('id').eq('id', riderId).single(),
        db.from('horses').select('id').eq('id', horseId).single(),
      ]);

      if (riderCheck.error || horseCheck.error) {
        return jsonResponse({ error: 'Cavalier ou cheval invalide' }, 400, getSecurityHeaders());
      }

      const pairingData = {
        rider_id: riderId,
        horse_id: horseId,
        pairing_start_date: body.pairing_start_date || null,
        pairing_end_date: body.pairing_end_date || null,
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
          horses (id, name, kind, is_owned_by_laury)
        `
        )
        .single();

      if (error) return handleDatabaseError(error, 'pairings.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT /api/pairings/:id - Update pairing
    if (request.method === 'PUT' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);

      if (isNaN(pairingId) || !body) {
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = {
        pairing_start_date: body.pairing_start_date || null,
        pairing_end_date: body.pairing_end_date || null,
        updated_at: new Date().toISOString(),
      };

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
          horses (id, name, kind, is_owned_by_laury)
        `
        )
        .single();

      if (error) return handleDatabaseError(error, 'pairings.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE /api/pairings/:id - Delete pairing
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2]);

      if (isNaN(pairingId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

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
