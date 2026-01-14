import {
  getDatabase,
  handleDbError,
  jsonResponse,
  validateRequired,
  checkRateLimit,
  getSecurityHeaders,
} from '../db.js';

/**
 * /api/packages
 */
export async function handlePackages(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // -----------------------------
    // GET /api/packages - List all packages with rider info
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('packages')
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          activity_start_date,
          activity_end_date,
          rider_id,
          created_at,
          updated_at,
          riders (
            id,
            name,
            email,
            phone,
            deleted_at
          )
        `
        )
        .order('id', { ascending: true });

      if (error) return handleDbError(error);

      const activeData = data.filter((pkg) => !pkg.riders?.deleted_at);

      return jsonResponse(activeData, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/packages/:id - Single package
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('packages')
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          activity_start_date,
          activity_end_date,
          rider_id,
          created_at,
          updated_at,
          riders (
            id,
            name,
            email,
            phone,
            deleted_at
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) return handleDbError(error);
      if (!data || data.riders?.deleted_at)
        return jsonResponse({ error: 'Package non trouvé' }, 404, getSecurityHeaders());

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/packages - Create package
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const requiredFields = ['services_per_week', 'group_lessons_per_week', 'rider_id'];
      const missingFields = validateRequired(requiredFields, body);
      if (missingFields)
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );

      const riderId = parseInt(body.rider_id);
      if (isNaN(riderId))
        return jsonResponse({ error: 'rider_id invalide' }, 400, getSecurityHeaders());

      // Check if rider exists and is not deleted
      const { data: rider, error: riderError } = await db
        .from('riders')
        .select('id')
        .eq('id', riderId)
        .is('deleted_at', null)
        .single();

      if (riderError || !rider)
        return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());

      // Validate dates
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

      const packageData = {
        services_per_week: parseInt(body.services_per_week),
        group_lessons_per_week: parseInt(body.group_lessons_per_week),
        rider_id: riderId,
        is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
      };

      const { data, error } = await db
        .from('packages')
        .insert(packageData)
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          activity_start_date,
          activity_end_date,
          rider_id,
          created_at,
          updated_at,
          riders (
            id,
            name,
            email,
            phone
          )
        `
        )
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/packages/:id - Update package
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);
      if (isNaN(id) || !body)
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );

      const { data: currentPackage, error: fetchError } = await db
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchError) return handleDbError(fetchError);

      // Validate rider if updating
      let riderId = currentPackage.rider_id;
      if (body.rider_id !== undefined) {
        riderId = parseInt(body.rider_id);
        if (isNaN(riderId))
          return jsonResponse({ error: 'rider_id invalide' }, 400, getSecurityHeaders());
        const { data: rider, error: riderError } = await db
          .from('riders')
          .select('id')
          .eq('id', riderId)
          .is('deleted_at', null)
          .single();
        if (riderError || !rider)
          return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());
      }

      // Validate dates
      const startDate =
        body.activity_start_date !== undefined
          ? body.activity_start_date
          : currentPackage.activity_start_date;
      const endDate =
        body.activity_end_date !== undefined
          ? body.activity_end_date
          : currentPackage.activity_end_date;

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = {
        services_per_week:
          body.services_per_week !== undefined
            ? parseInt(body.services_per_week)
            : currentPackage.services_per_week,
        group_lessons_per_week:
          body.group_lessons_per_week !== undefined
            ? parseInt(body.group_lessons_per_week)
            : currentPackage.group_lessons_per_week,
        is_active:
          body.is_active !== undefined ? Boolean(body.is_active) : currentPackage.is_active,
        activity_start_date: startDate,
        activity_end_date: endDate,
        rider_id,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('packages')
        .update(updateData)
        .eq('id', id)
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          activity_start_date,
          activity_end_date,
          rider_id,
          created_at,
          updated_at,
          riders (
            id,
            name,
            email,
            phone
          )
        `
        )
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/packages/:id
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { error } = await db.from('packages').delete().eq('id', id);
      if (error) return handleDbError(error);

      return jsonResponse({ message: 'Package supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (error) {
    console.error('Error in handlePackages:', error);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: error.message },
      500,
      getSecurityHeaders()
    );
  }
}

/**
 * GET /api/riders/:id/packages - Get all packages for a rider
 */
export async function handleRiderPackages(request, env, riderId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  try {
    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    // Check rider exists and is not deleted
    const { data: rider, error: riderError } = await db
      .from('riders')
      .select('id')
      .eq('id', riderIdNum)
      .is('deleted_at', null)
      .single();
    if (riderError || !rider)
      return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());

    const { data, error } = await db
      .from('packages')
      .select(
        `
        id,
        services_per_week,
        group_lessons_per_week,
        is_active,
        activity_start_date,
        activity_end_date,
        rider_id,
        created_at,
        updated_at
      `
      )
      .eq('rider_id', riderIdNum)
      .order('created_at', { ascending: false });

    if (error) return handleDbError(error);
    return jsonResponse(data, 200, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error in handleRiderPackages:', error);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: error.message },
      500,
      getSecurityHeaders()
    );
  }
}
