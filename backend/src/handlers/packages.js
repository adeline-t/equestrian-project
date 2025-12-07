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
    // GET /api/packages - List all packages
    if (request.method === 'GET' && pathParts.length === 2) {
      // FIX: Changed order from 'name' to 'id' since packages table has no name column
      const { data, error } = await db
        .from('packages')
        .select('*')
        .order('id', { ascending: true });

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET /api/packages/:id - Get single package
    if (request.method === 'GET' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);

      if (isNaN(id)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db.from('packages').select('*').eq('id', id).single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/packages - Create package
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);

      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate required fields
      const requiredFields = ['private_lesson_count', 'joint_lesson_count'];
      const missingFields = validateRequired(requiredFields, body);
      if (missingFields) {
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );
      }

      // FIX: Added activity_start_date and activity_end_date fields
      const packageData = {
        private_lesson_count: body.private_lesson_count
          ? parseInt(body.private_lesson_count)
          : 0,
        joint_lesson_count: body.joint_lesson_count ? parseInt(body.joint_lesson_count) : 0,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
      };

      const { data, error } = await db.from('packages').insert(packageData).select().single();

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

      // FIX: Added activity_start_date and activity_end_date fields
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
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('packages')
        .update(updateData)
        .eq('id', id)
        .select()
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
        details: error.stack 
      }, 
      500, 
      getSecurityHeaders()
    );
  }
}