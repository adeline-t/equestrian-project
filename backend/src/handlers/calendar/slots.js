import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError, handleUnexpectedError } from '../../utils/errorHandler.js';

const SLOT_STATUSES = ['scheduled', 'confirmed', 'cancelled', 'blocked'];

export async function handlePlanningSlots(request, env, idParam) {
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  const db = getDatabase(env);
  const slotColumns = [
    'slot_status',
    'actual_instructor_id',
    'cancellation_reason',
    'start_time',
    'end_time',
    'is_all_day',
  ];

  try {
    // GET list
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('planning_slots')
        .select('*')
        .is('deleted_at', null)
        .order('start_time');
      if (error) return handleDatabaseError(error, 'slots.list', env);
      return jsonResponse(data || [], 200, getSecurityHeaders());
    }

    // GET single
    if (request.method === 'GET' && id) {
      const { data, error } = await db
        .from('planning_slots')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();
      if (error) return handleDatabaseError(error, 'slots.get', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());
      const missing = validateRequired(['start_time', 'end_time', 'slot_status'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!SLOT_STATUSES.includes(body.slot_status))
        return jsonResponse(
          { error: `slot_status invalide. Valeurs: ${SLOT_STATUSES.join(', ')}` },
          400,
          getSecurityHeaders()
        );

      if (new Date(body.start_time) >= new Date(body.end_time))
        return jsonResponse(
          { error: 'start_time doit précéder end_time' },
          400,
          getSecurityHeaders()
        );

      const slotData = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      for (const col of slotColumns) if (body[col] !== undefined) slotData[col] = body[col];
      if (slotData.is_all_day === undefined) slotData.is_all_day = false;

      const { data, error } = await db.from('planning_slots').insert(slotData).select().single();
      if (error) return handleDatabaseError(error, 'slots.create', env);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      if (body.start_time && body.end_time && new Date(body.start_time) >= new Date(body.end_time))
        return jsonResponse(
          { error: 'start_time doit précéder end_time' },
          400,
          getSecurityHeaders()
        );

      if (body.slot_status && !SLOT_STATUSES.includes(body.slot_status))
        return jsonResponse(
          { error: `slot_status invalide. Valeurs: ${SLOT_STATUSES.join(', ')}` },
          400,
          getSecurityHeaders()
        );

      const updateData = { updated_at: new Date().toISOString() };
      for (const col of slotColumns) if (body[col] !== undefined) updateData[col] = body[col];

      const { data, error } = await db
        .from('planning_slots')
        .update(updateData)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'slots.update', env);
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('planning_slots')
        .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'slots.delete', env);
      return jsonResponse(
        { message: 'Planning slot supprimé', slot: data },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'slots', env);
  }
}
