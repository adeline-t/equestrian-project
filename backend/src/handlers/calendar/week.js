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
    // Fetch ALL data in one query
    const { data: slots, error: slotsError } = await db
      .from('planning_slots')
      .select(
        `
        *,
        events (
          *
        ),
        event_participants (
          *,
          riders (id, name),
          horses (id, name, kind)
        )
        `
      )
      .gte('slot_date', weekStart.toISOString().slice(0, 10))
      .lte('slot_date', weekEnd.toISOString().slice(0, 10))
      .is('deleted_at', null)
      .order('slot_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (slotsError) return handleDatabaseError(slotsError, 'calendar.week.fetch', env);

    const weekData = buildWeekReadModel(weekStart, slots);
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

    // Handle both single event or array of events
    const event = Array.isArray(slot.events)
      ? slot.events.length > 0
        ? slot.events[0]
        : null
      : slot.events;

    // Keep event_participants as-is, just filter cancelled
    const participants = (slot.event_participants || []).filter((p) => !p.is_cancelled);

    // Return data structure similar to database
    day.slots.push({
      ...slot,
      events: event, // Normalize to single event
      event_participants: participants,
    });
  }

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return {
    period: {
      start: weekStart.toISOString().slice(0, 10),
      end: weekEnd.toISOString().slice(0, 10),
    },
    days,
  };
}
