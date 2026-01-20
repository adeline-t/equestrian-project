import { getSecurityHeaders, jsonResponse, getDatabase } from '../../db.js';
import { handleDatabaseError, handleUnexpectedError } from '../../utils/errorHandler.js';

export async function handleCalendarWeek(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  }

  const url = new URL(request.url);
  const startParam = url.searchParams.get('start');
  if (!startParam) {
    return jsonResponse(
      { error: 'Paramètre "start" requis (YYYY-MM-DD)' },
      400,
      getSecurityHeaders()
    );
  }

  const db = getDatabase(env);
  const weekStart = new Date(startParam);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6); // 7-day week

  try {
    // 1️⃣ Fetch slots in the week with their single event
    const { data: slots, error: slotsError } = await db
      .from('planning_slots')
      .select(
        `
        id, slot_date, start_time, end_time, slot_status, is_all_day, actual_instructor_id,
        cancellation_reason, created_at, updated_at,
        events!inner (
          id, event_type, instructor_id, min_participants, max_participants
        )
      `
      )
      .gte('slot_date', weekStart.toISOString().slice(0, 10))
      .lte('slot_date', weekEnd.toISOString().slice(0, 10))
      .is('deleted_at', null)
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (slotsError) return handleDatabaseError(slotsError, 'calendar.week.fetch', env);

    const slotIds = slots.map((s) => s.id);

    // 2️⃣ Fetch participants linked to these slots
    const { data: participantsData, error: participantsError } = await db
      .from('event_participants')
      .select(
        `
        id, planning_slot_id, rider_id, horse_id, horse_assignment_type, is_cancelled,
        riders(id, name),
        horses(id, name)
      `
      )
      .in('planning_slot_id', slotIds);

    if (participantsError)
      return handleDatabaseError(participantsError, 'calendar.week.participants', env);

    // 3️⃣ Merge participants into their slots
    const slotsWithParticipants = slots.map((slot) => {
      const event = slot.events ?? null; // single event
      const slotParticipants = participantsData
        .filter((p) => p.planning_slot_id === slot.id && !p.is_cancelled)
        .map((p) => ({
          participant_id: p.id,
          rider_id: p.rider_id,
          rider_name: p.riders?.name ?? null,
          horse_id: p.horse_id,
          horse_name: p.horses?.name ?? null,
          horse_assignment_type: p.horse_assignment_type,
        }));

      return {
        ...slot,
        event,
        participants: slotParticipants,
      };
    });

    const weekData = buildWeekReadModel(weekStart, slotsWithParticipants);
    return jsonResponse(weekData, 200, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'calendar.week', env);
  }
}

function buildWeekReadModel(weekStart, slots) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().slice(0, 10), slots: [] };
  });

  for (const slot of slots) {
    const dateStr = slot.slot_date;
    const day = days.find((d) => d.date === dateStr);
    if (!day) continue;

    const event = slot.event; // single event
    const participants = slot.participants ?? [];

    day.slots.push({
      id: slot.id,
      slot_id: slot.id,
      event_id: event?.id ?? null,
      event_type: event?.event_type ?? 'blocked',
      status: slot.slot_status,
      start_time: slot.start_time,
      end_time: slot.end_time,
      is_all_day: slot.is_all_day,
      instructor_id: event?.instructor_id ?? slot.actual_instructor_id,
      min_participants: event?.min_participants ?? 0,
      max_participants: event?.max_participants ?? 0,
      participant_count: participants.length,
      participants,
      cancellation_reason: slot.cancellation_reason,
    });
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return {
    week_start: weekStart.toISOString().slice(0, 10),
    week_end: weekEnd.toISOString().slice(0, 10),
    days,
  };
}
