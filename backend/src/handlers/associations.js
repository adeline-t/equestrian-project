import { getDatabase, handleDbError, jsonResponse, validateRequired, checkRateLimit, getSecurityHeaders } from '../db.js';
import { 
  handleDatabaseError, 
  handleValidationError, 
  handleNotFoundError, 
  handleRateLimitError 
} from '../utils/errorHandler.js';
import { sanitizeAssociationData, removeEmptyValues } from '../utils/inputSanitizer.js';

export async function handleAssociations(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return handleRateLimitError('associations.rateLimit');
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // GET /api/associations - List all associations
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('rider_horse_associations')
        .select(`
          id,
          rider_id,
          horse_id,
          association_start_date,
          association_end_date,
          riders (id, name),
          horses (id, name, kind)
        `)
        .order('association_start_date', { ascending: false });

      if (error) return handleDatabaseError(error, 'associations.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET /api/associations/:id - Get single association
    if (request.method === 'GET' && pathParts.length === 3) {
      const associationId = parseInt(pathParts[2]);
      
      if (isNaN(associationId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db
        .from('rider_horse_associations')
        .select(`
          id,
          rider_id,
          horse_id,
          association_start_date,
          association_end_date,
          riders (id, name, phone, email),
          horses (id, name, kind)
        `)
        .eq('id', associationId)
        .single();

      if (error) return handleDatabaseError(error, 'associations.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST /api/associations - Create association
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      
      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      // Validate required fields
      const missingFields = validateRequired(['rider_id', 'horse_id'], body);
      if (missingFields) {
        return jsonResponse({ error: `Champs requis: ${missingFields}` }, 400, getSecurityHeaders());
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
        db.from('horses').select('id').eq('id', horseId).single()
      ]);

      if (riderCheck.error || horseCheck.error) {
        return jsonResponse({ error: 'Cavalier ou cheval invalide' }, 400, getSecurityHeaders());
      }

      const associationData = {
        rider_id: riderId,
        horse_id: horseId,
        association_start_date: body.association_start_date || null,
        association_end_date: body.association_end_date || null,
      };

      const { data, error } = await db
        .from('rider_horse_associations')
        .insert(associationData)
        .select(`
          id,
          rider_id,
          horse_id,
          association_start_date,
          association_end_date,
          riders (id, name),
          horses (id, name, kind)
        `)
        .single();

      if (error) return handleDatabaseError(error, 'associations.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT /api/associations/:id - Update association
    if (request.method === 'PUT' && pathParts.length === 3) {
      const associationId = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);
      
      if (isNaN(associationId) || !body) {
        return jsonResponse({ error: 'ID ou corps de requête invalide' }, 400, getSecurityHeaders());
      }

      const updateData = {
        association_start_date: body.association_start_date || null,
        association_end_date: body.association_end_date || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('rider_horse_associations')
        .update(updateData)
        .eq('id', associationId)
        .select(`
          id,
          rider_id,
          horse_id,
          association_start_date,
          association_end_date,
          riders (id, name),
          horses (id, name, kind)
        `)
        .single();

      if (error) return handleDatabaseError(error, 'associations.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE /api/associations/:id - Delete association
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const associationId = parseInt(pathParts[2]);
      
      if (isNaN(associationId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }
      
      const { error } = await db
        .from('rider_horse_associations')
        .delete()
        .eq('id', associationId);

      if (error) return handleDatabaseError(error, 'associations.delete');
      return jsonResponse({ message: 'Association supprimée avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());

  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}