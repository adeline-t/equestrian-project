import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError, handleUnexpectedError } from '../../utils/errorHandler.js';

const HORSE_ASSIGNMENT_TYPES = ['manual', 'automatic'];

export async function handleEventParticipants(request, env, idParam) {
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  const db = getDatabase(env);
  const participantColumns = [
    'planning_slot_id',
    'rider_id',
    'horse_id',
    'horse_assignment_type',
    'is_cancelled',
  ];

  try {
    // GET list of participants
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('event_participants')
        .select('*')
        .eq('is_cancelled', false)
        .order('created_at', { ascending: false });
      if (error) return handleDatabaseError(error, 'participants.list', env);
      return jsonResponse(data || [], 200, getSecurityHeaders());
    }

    // GET single participant
    if (request.method === 'GET' && id) {
      const { data, error } = await db.from('event_participants').select('*').eq('id', id).single();
      if (error) return handleDatabaseError(error, 'participants.get', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create participant
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(['planning_slot_id', 'horse_assignment_type'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!HORSE_ASSIGNMENT_TYPES.includes(body.horse_assignment_type))
        return jsonResponse(
          {
            error: `horse_assignment_type invalide. Valeurs: ${HORSE_ASSIGNMENT_TYPES.join(', ')}`,
          },
          400,
          getSecurityHeaders()
        );

      const insertData = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_cancelled: false,
      };
      for (const col of participantColumns)
        if (body[col] !== undefined) insertData[col] = body[col];

      const { data, error } = await db
        .from('event_participants')
        .insert(insertData)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.create', env);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update participant
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      if (
        body.horse_assignment_type &&
        !HORSE_ASSIGNMENT_TYPES.includes(body.horse_assignment_type)
      )
        return jsonResponse(
          {
            error: `horse_assignment_type invalide. Valeurs: ${HORSE_ASSIGNMENT_TYPES.join(', ')}`,
          },
          400,
          getSecurityHeaders()
        );

      const updateData = { updated_at: new Date().toISOString() };
      for (const col of participantColumns)
        if (body[col] !== undefined) updateData[col] = body[col];

      const { data, error } = await db
        .from('event_participants')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.update', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE cancel (soft delete)
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('event_participants')
        .update({ is_cancelled: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.delete', env);
      return jsonResponse(
        { message: 'Participant annulé', participant: data },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'participants', env);
  }
}
