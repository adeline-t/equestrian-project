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
  handleUnexpectedError,
} from '../utils/errorHandler.js';
import { sanitizeHorseData, removeEmptyValues } from '../utils/inputSanitizer.js';

export async function handleHorses(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return handleRateLimitError('horses.rateLimit');
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // GET /api/horses - List all horses with active riders count
    if (request.method === 'GET' && pathParts.length === 2) {
      // Get all horses
      const { data: horses, error: horsesError } = await db
        .from('horses')
        .select('*')
        .order('name');

      if (horsesError) return handleDatabaseError(horsesError, 'horses.list');

      // Get active pairings count for each horse
      const now = new Date().toISOString().split('T')[0];

      const horsesWithCounts = await Promise.all(
        horses.map(async (horse) => {
          // Count active riders (pairings where dates are active and rider is active)
          const { data: pairings, error: pairingsError } = await db
            .from('rider_horse_pairings')
            .select(
              `
              id,
              pairing_start_date,
              pairing_end_date,
              riders (
                id,
                activity_start_date,
                activity_end_date
              )
            `
            )
            .eq('horse_id', horse.id);

          if (pairingsError) {
            console.error('Error fetching pairings:', pairingsError);
            return { ...horse, active_riders_count: 0 };
          }

          // Filter for active pairings with active riders
          const activeCount = pairings.filter((pairing) => {
            // Check if pairing is active
            const pairingActive =
              (!pairing.pairing_start_date || pairing.pairing_start_date <= now) &&
              (!pairing.pairing_end_date || pairing.pairing_end_date >= now);

            // Check if rider is active
            const rider = pairing.riders;
            const riderActive =
              rider &&
              (!rider.activity_start_date || rider.activity_start_date <= now) &&
              (!rider.activity_end_date || rider.activity_end_date >= now);

            return pairingActive && riderActive;
          }).length;

          return {
            ...horse,
            active_riders_count: activeCount,
          };
        })
      );

      return jsonResponse(horsesWithCounts, 200, getSecurityHeaders());
    }

    // GET /api/horses/:id - Get single horse
    if (request.method === 'GET' && pathParts.length === 3) {
      const horseId = parseInt(pathParts[2]);

      if (isNaN(horseId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db.from('horses').select('*').eq('id', horseId).single();

      if (error) return handleDatabaseError(error, 'horses.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/horses - Create horse
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);

      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate required fields
      const missingFields = validateRequired(['name', 'kind'], body);
      if (missingFields) {
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );
      }

      // Validate kind
      if (!['horse', 'pony'].includes(body.kind)) {
        return jsonResponse(
          { error: 'Le type doit être "horse" ou "pony"' },
          400,
          getSecurityHeaders()
        );
      }

      // Validate is_owned_by if provided
      if (body.is_owned_by && !['Laury', 'Propriétaire', 'Club'].includes(body.is_owned_by)) {
        return jsonResponse(
          { error: 'Le propriétaire doit être "Laury", "Propriétaire" ou "Club"' },
          400,
          getSecurityHeaders()
        );
      }

      const horseData = {
        name: body.name.trim(),
        kind: body.kind,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
        is_owned_by: body.is_owned_by || 'Propriétaire',
      };

      const { data, error } = await db.from('horses').insert(horseData).select().single();

      if (error) return handleDatabaseError(error, 'horses.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT /api/horses/:id - Update horse
    if (request.method === 'PUT' && pathParts.length === 3) {
      const horseId = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);

      if (isNaN(horseId) || !body) {
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );
      }

      // Validate kind if provided
      if (body.kind && !['horse', 'pony'].includes(body.kind)) {
        return jsonResponse(
          { error: 'Le type doit être "horse" ou "pony"' },
          400,
          getSecurityHeaders()
        );
      }

      // Validate is_owned_by if provided
      if (body.is_owned_by && !['Laury', 'Propriétaire', 'Club'].includes(body.is_owned_by)) {
        return jsonResponse(
          { error: 'Le propriétaire doit être "Laury", "Propriétaire" ou "Club"' },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = {
        name: body.name?.trim(),
        kind: body.kind,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
        is_owned_by: body.is_owned_by,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(
        (key) => updateData[key] === undefined && delete updateData[key]
      );

      const { data, error } = await db
        .from('horses')
        .update(updateData)
        .eq('id', horseId)
        .select()
        .single();

      if (error) return handleDatabaseError(error, 'horses.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE /api/horses/:id - Delete horse
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const horseId = parseInt(pathParts[2]);

      if (isNaN(horseId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { error } = await db.from('horses').delete().eq('id', horseId);

      if (error) return handleDatabaseError(error, 'horses.delete');
      return jsonResponse({ message: 'Cheval supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}

// GET /api/horses/:id/riders - Get riders for a horse
export async function handleHorseRiders(request, env, horseId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  try {
    const horseIdNum = parseInt(horseId);
    if (isNaN(horseIdNum)) {
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
    }

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
          activity_end_date
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
