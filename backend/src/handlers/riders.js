import { getDatabase, handleDbError, jsonResponse, validateEmail, validatePhone, validateRequired, checkRateLimit, getSecurityHeaders } from '../db.js';

export async function handleRiders(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429);
  }

  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // GET /api/riders - List all riders
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('riders')
        .select('*')
        .order('name');

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET /api/riders/:id - Get single rider
    if (request.method === 'GET' && pathParts.length === 3) {
      const riderId = parseInt(pathParts[2]);
      
      if (isNaN(riderId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db
        .from('riders')
        .select('*')
        .eq('id', riderId)
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/riders - Create rider
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      
      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate required fields
      const missingFields = validateRequired(['name'], body);
      if (missingFields) {
        return jsonResponse({ error: `Champs requis: ${missingFields}` }, 400, getSecurityHeaders());
      }

      // Validate email format if provided
      if (body.email && !validateEmail(body.email)) {
        return jsonResponse({ error: 'Format d\'email invalide' }, 400, getSecurityHeaders());
      }

      // Validate phone format if provided
      if (body.phone && !validatePhone(body.phone)) {
        return jsonResponse({ error: 'Format de téléphone invalide' }, 400, getSecurityHeaders());
      }

      const riderData = {
        name: body.name.trim(),
        phone: body.phone?.trim() || null,
        email: body.email?.trim().toLowerCase() || null,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
      };

      const { data, error } = await db
        .from('riders')
        .insert(riderData)
        .select()
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT /api/riders/:id - Update rider
    if (request.method === 'PUT' && pathParts.length === 3) {
      const riderId = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);
      
      if (isNaN(riderId) || !body) {
        return jsonResponse({ error: 'ID ou corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate email format if provided
      if (body.email && !validateEmail(body.email)) {
        return jsonResponse({ error: 'Format d\'email invalide' }, 400, getSecurityHeaders());
      }

      // Validate phone format if provided
      if (body.phone && !validatePhone(body.phone)) {
        return jsonResponse({ error: 'Format de téléphone invalide' }, 400, getSecurityHeaders());
      }

      const updateData = {
        name: body.name?.trim(),
        phone: body.phone?.trim() || null,
        email: body.email?.trim().toLowerCase() || null,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
        updated_at: new Date().toISOString(),
      };

      // Remove undefined fields
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );

      const { data, error } = await db
        .from('riders')
        .update(updateData)
        .eq('id', riderId)
        .select()
        .single();

      if (error) return handleDbError(error);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE /api/riders/:id - Delete rider
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const riderId = parseInt(pathParts[2]);
      
      if (isNaN(riderId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }
      
      const { error } = await db
        .from('riders')
        .delete()
        .eq('id', riderId);

      if (error) return handleDbError(error);
      return jsonResponse({ message: 'Cavalier supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());

  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}

// GET /api/riders/:id/horses - Get horses for a rider
export async function handleRiderHorses(request, env, riderId) {
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

    const { data, error } = await db
      .from('rider_horse_associations')
      .select(`
        id,
        association_start_date,
        association_end_date,
        horses (
          id,
          name,
          kind,
          activity_start_date,
          activity_end_date
        )
      `)
      .eq('rider_id', riderIdNum)
      .order('association_start_date', { ascending: false });

    if (error) return handleDbError(error);
    return jsonResponse(data, 200, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}