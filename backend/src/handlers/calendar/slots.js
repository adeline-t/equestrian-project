import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError, handleUnexpectedError } from '../../utils/errorHandler.js';

const SLOT_STATUSES = ['scheduled', 'confirmed', 'cancelled', 'blocked'];

export async function handlePlanningSlots(request, env, idParam) {
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  const db = getDatabase(env);
  const url = new URL(request.url);
  const slotColumns = [
    'slot_status',
    'actual_instructor_id',
    'cancellation_reason',
    'start_time',
    'end_time',
    'is_all_day',
    'slot_date',
  ];

  try {
    // GET single slot with full details
    if (request.method === 'GET' && id && url.pathname.endsWith('/full-details')) {
      const { data: slot, error: slotError } = await db
        .from('planning_slots')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (slotError) return handleDatabaseError(slotError, 'slots.get', env);
      if (!slot) return jsonResponse({ error: 'Slot non trouvé' }, 404, getSecurityHeaders());

      // Get the single event for the slot
      const { data: event, error: eventError } = await db
        .from('events')
        .select('*')
        .eq('planning_slot_id', id)
        .is('deleted_at', null)
        .maybeSingle();

      if (eventError && eventError.code !== 'PGRST116')
        return handleDatabaseError(eventError, 'events.get', env);

      // Get participants linked to the slot (planning_slot_id)
      const { data: participantsData, error: participantsError } = await db
        .from('event_participants')
        .select(
          `
          *,
          rider:riders (id, name, email, phone, rider_type, activity_start_date, activity_end_date),
          horse:horses (id, name, kind, ownership_type, activity_start_date, activity_end_date)
        `
        )
        .eq('planning_slot_id', id)
        .order('created_at');

      if (participantsError)
        return handleDatabaseError(participantsError, 'participants.list', env);

      // Enrich participants with pairings and packages if needed
      for (const participant of participantsData || []) {
        if (participant.rider_id && participant.horse_id) {
          const { data: pairing } = await db
            .from('rider_horse_pairings')
            .select('*')
            .eq('rider_id', participant.rider_id)
            .eq('horse_id', participant.horse_id)
            .or(
              `pairing_end_date.is.null,pairing_end_date.gte.${
                new Date().toISOString().split('T')[0]
              }`
            )
            .maybeSingle();
          participant.pairing = pairing;
        }

        if (participant.rider_id) {
          const { data: packageData } = await db
            .from('packages')
            .select('*')
            .eq('rider_id', participant.rider_id)
            .eq('is_active', true)
            .is('deleted_at', null)
            .maybeSingle();
          participant.package = packageData;
        }
      }

      return jsonResponse(
        { slot, event, participants: participantsData || [] },
        200,
        getSecurityHeaders()
      );
    }

    // GET list of slots
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('planning_slots')
        .select('*')
        .is('deleted_at', null)
        .order('start_time');

      if (error) return handleDatabaseError(error, 'slots.list', env);
      return jsonResponse(data || [], 200, getSecurityHeaders());
    }

    // GET single slot basic
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

    // POST create slot
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(
        ['slot_date', 'start_time', 'end_time', 'slot_status'],
        body
      );
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!SLOT_STATUSES.includes(body.slot_status))
        return jsonResponse(
          { error: `slot_status invalide. Valeurs: ${SLOT_STATUSES.join(', ')}` },
          400,
          getSecurityHeaders()
        );

      const slotData = {
        slot_date: body.slot_date,
        start_time: body.start_time,
        end_time: body.end_time,
        slot_status: body.slot_status,
        actual_instructor_id: body.actual_instructor_id ?? null,
        cancellation_reason: body.cancellation_reason ?? null,
        is_all_day: body.is_all_day ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db.from('planning_slots').insert(slotData).select().single();
      if (error) return handleDatabaseError(error, 'slots.create', env);
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update slot
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

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

    // DELETE slot
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
