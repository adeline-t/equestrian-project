import {
  getDatabase,
  handleDbError,
  jsonResponse,
  validateRequired,
  checkRateLimit,
  getSecurityHeaders,
} from '../db.js';

export async function handlePackages(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429);
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // GET /api/packages - List all packages with rider information
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('packages')
        .select(
          `
          id,
          private_lesson_count,
          joint_lesson_count,
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
        .order('id', { ascending: true });

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET /api/packages/:id - Get single package with rider information
    if (request.method === 'GET' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);

      if (isNaN(id)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db
        .from('packages')
        .select(
          `
          id,
          private_lesson_count,
          joint_lesson_count,
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
        .eq('id', id)
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/packages - Create package
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);

      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate required fields (including rider_id)
      const requiredFields = ['private_lesson_count', 'joint_lesson_count', 'rider_id'];
      const missingFields = validateRequired(requiredFields, body);
      if (missingFields) {
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );
      }

      // Validate rider_id
      const riderId = parseInt(body.rider_id);
      if (isNaN(riderId)) {
        return jsonResponse({ error: 'rider_id invalide' }, 400, getSecurityHeaders());
      }

      // Check if rider exists
      const { data: riderExists, error: riderError } = await db
        .from('riders')
        .select('id')
        .eq('id', riderId)
        .single();

      if (riderError || !riderExists) {
        return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());
      }

      const packageData = {
        private_lesson_count: body.private_lesson_count ? parseInt(body.private_lesson_count) : 0,
        joint_lesson_count: body.joint_lesson_count ? parseInt(body.joint_lesson_count) : 0,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
        rider_id: riderId,
      };

      const { data, error } = await db
        .from('packages')
        .insert(packageData)
        .select(
          `
          id,
          private_lesson_count,
          joint_lesson_count,
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

    // PUT /api/packages/:id - Update package
    if (request.method === 'PUT' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);

      if (isNaN(id) || !body) {
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );
      }

      // Get current package
      const { data: currentPackage, error: fetchError } = await db
        .from('packages')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) return handleDbError(fetchError);

      // If rider_id is being updated, validate it
      if (body.rider_id !== undefined) {
        const riderId = parseInt(body.rider_id);
        if (isNaN(riderId)) {
          return jsonResponse({ error: 'rider_id invalide' }, 400, getSecurityHeaders());
        }

        // Check if rider exists
        const { data: riderExists, error: riderError } = await db
          .from('riders')
          .select('id')
          .eq('id', riderId)
          .single();

        if (riderError || !riderExists) {
          return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());
        }
      }

      const updateData = {
        private_lesson_count:
          body.private_lesson_count !== undefined
            ? parseInt(body.private_lesson_count)
            : currentPackage.private_lesson_count,
        joint_lesson_count:
          body.joint_lesson_count !== undefined
            ? parseInt(body.joint_lesson_count)
            : currentPackage.joint_lesson_count,
        activity_start_date:
          body.activity_start_date !== undefined
            ? body.activity_start_date
            : currentPackage.activity_start_date,
        activity_end_date:
          body.activity_end_date !== undefined
            ? body.activity_end_date
            : currentPackage.activity_end_date,
        rider_id: body.rider_id !== undefined ? parseInt(body.rider_id) : currentPackage.rider_id,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('packages')
        .update(updateData)
        .eq('id', id)
        .select(
          `
          id,
          private_lesson_count,
          joint_lesson_count,
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

    // DELETE /api/packages/:id - Delete package
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);

      if (isNaN(id)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { error } = await db.from('packages').delete().eq('id', id);

      if (error) return handleDbError(error);
      return jsonResponse({ message: 'Package supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (error) {
    console.error('Error in handlePackages:', error);
    return jsonResponse(
      {
        error: 'Erreur serveur interne',
        message: error.message,
        details: error.stack,
      },
      500,
      getSecurityHeaders()
    );
  }
}

// New function: Get all packages for a specific rider
export async function handleRiderPackages(request, env, riderId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  try {
    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) {
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
    }

    // Check if rider exists
    const { data: riderExists, error: riderError } = await db
      .from('riders')
      .select('id')
      .eq('id', riderIdNum)
      .single();

    if (riderError || !riderExists) {
      return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());
    }

    const { data, error } = await db
      .from('packages')
      .select(
        `
        id,
        private_lesson_count,
        joint_lesson_count,
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
      {
        error: 'Erreur serveur interne',
        message: error.message,
      },
      500,
      getSecurityHeaders()
    );
  }
}
