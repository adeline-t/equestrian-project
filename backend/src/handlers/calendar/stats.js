import { getSecurityHeaders, jsonResponse, getDatabase } from '../../db.js';
import {
  handleDatabaseError,
  handleUnexpectedError,
  handleValidationError,
} from '../../utils/errorHandler.js';
import {
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns';

/**
 * GET /api/calendar/stats/horses?month=YYYY-MM
 * Returns weekly event counts for club and Laury horses
 */
export async function handleHorseStats(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  }

  const url = new URL(request.url);
  const month = url.searchParams.get('month');

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return handleValidationError(
      'Paramètre "month" requis au format YYYY-MM',
      'stats.horses.validate',
      { month },
      env
    );
  }

  const db = getDatabase(env);

  try {
    const monthDate = new Date(`${month}-01`);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // Get weeks (including partial weeks from adjacent months)
    const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weeks = eachWeekOfInterval(
      { start: firstWeekStart, end: lastWeekEnd },
      { weekStartsOn: 1 }
    );

    // Fetch horses (club and laury only)
    const { data: horses, error: horsesError } = await db
      .from('horses')
      .select('id, name, ownership_type')
      .in('ownership_type', ['club', 'laury'])
      .is('deleted_at', null)
      .order('name');

    if (horsesError) return handleDatabaseError(horsesError, 'stats.horses.fetchHorses', env);

    // Fetch event participants for the date range
    const { data: participants, error: participantsError } = await db
      .from('event_participants')
      .select(
        `
        horse_id,
        planning_slot_id,
        is_cancelled,
        planning_slots (
          id,
          slot_date,
          slot_status,
          deleted_at
        )
      `
      )
      .gte('planning_slots.slot_date', format(firstWeekStart, 'yyyy-MM-dd'))
      .lte('planning_slots.slot_date', format(lastWeekEnd, 'yyyy-MM-dd'))
      .not('planning_slots.slot_status', 'eq', 'cancelled')
      .is('planning_slots.deleted_at', null)
      .eq('is_cancelled', false);

    if (participantsError)
      return handleDatabaseError(participantsError, 'stats.horses.fetchParticipants', env);

    // Build statistics
    const horseStats = horses.map((horse) => {
      const weekStats = weeks.map((weekStart, index) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

        // Count events for this horse in this week
        const eventCount = participants.filter((p) => {
          if (p.horse_id !== horse.id || !p.planning_slots) return false;

          const slotDate = new Date(p.planning_slots.slot_date);
          return slotDate >= weekStart && slotDate <= weekEnd;
        }).length;

        return {
          weekNumber: index + 1,
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd'),
          eventCount,
        };
      });

      return {
        horseId: horse.id,
        horseName: horse.name,
        ownershipType: horse.ownership_type,
        weeks: weekStats,
      };
    });

    return jsonResponse(horseStats, 200, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'stats.horses', env);
  }
}

/**
 * GET /api/calendar/stats/riders?month=YYYY-MM
 * Returns weekly event counts by type for all riders
 */
export async function handleRiderStats(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  }

  const url = new URL(request.url);
  const month = url.searchParams.get('month');

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return handleValidationError(
      'Paramètre "month" requis au format YYYY-MM',
      'stats.riders.validate',
      { month },
      env
    );
  }

  const db = getDatabase(env);

  try {
    const monthDate = new Date(`${month}-01`);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weeks = eachWeekOfInterval(
      { start: firstWeekStart, end: lastWeekEnd },
      { weekStartsOn: 1 }
    );

    // Fetch riders
    const { data: riders, error: ridersError } = await db
      .from('riders')
      .select('id, name, rider_type')
      .is('deleted_at', null)
      .order('name');

    if (ridersError) return handleDatabaseError(ridersError, 'stats.riders.fetchRiders', env);

    // Fetch event participants with event type for the date range
    const { data: participants, error: participantsError } = await db
      .from('event_participants')
      .select(
        `
        rider_id,
        planning_slot_id,
        is_cancelled,
        planning_slots (
          id,
          slot_date,
          slot_status,
          deleted_at,
          event_id
        )
      `
      )
      .gte('planning_slots.slot_date', format(firstWeekStart, 'yyyy-MM-dd'))
      .lte('planning_slots.slot_date', format(lastWeekEnd, 'yyyy-MM-dd'))
      .not('planning_slots.slot_status', 'eq', 'cancelled')
      .is('planning_slots.deleted_at', null)
      .eq('is_cancelled', false);

    if (participantsError)
      return handleDatabaseError(participantsError, 'stats.riders.fetchParticipants', env);

    // Fetch events to get event types
    const eventIds = [
      ...new Set(participants.map((p) => p.planning_slots?.event_id).filter(Boolean)),
    ];

    const { data: events, error: eventsError } = await db
      .from('events')
      .select('id, event_type')
      .in('id', eventIds);

    if (eventsError) return handleDatabaseError(eventsError, 'stats.riders.fetchEvents', env);

    // Create event type lookup
    const eventTypeMap = {};
    events.forEach((e) => {
      eventTypeMap[e.id] = e.event_type;
    });

    // Build statistics
    const riderStats = riders.map((rider) => {
      const weekStats = weeks.map((weekStart, index) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

        // Count events by type for this rider in this week
        const eventsByType = {};

        participants.forEach((p) => {
          if (p.rider_id !== rider.id || !p.planning_slots) return;

          const slotDate = new Date(p.planning_slots.slot_date);
          if (slotDate < weekStart || slotDate > weekEnd) return;

          const eventType = eventTypeMap[p.planning_slots.event_id];
          if (eventType) {
            eventsByType[eventType] = (eventsByType[eventType] || 0) + 1;
          }
        });

        return {
          weekNumber: index + 1,
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd'),
          eventsByType,
        };
      });

      return {
        riderId: rider.id,
        riderName: rider.name,
        riderType: rider.rider_type,
        weeks: weekStats,
      };
    });

    // Filter out riders with no events
    const activeRiderStats = riderStats.filter((rider) =>
      rider.weeks.some((week) => Object.keys(week.eventsByType).length > 0)
    );

    return jsonResponse(activeRiderStats, 200, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'stats.riders', env);
  }
}

/**
 * GET /api/calendar/stats/monthly?month=YYYY-MM
 * Returns complete monthly stats (horses + riders)
 */
export async function handleMonthlyStats(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  }

  const url = new URL(request.url);
  const month = url.searchParams.get('month');

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return handleValidationError(
      'Paramètre "month" requis au format YYYY-MM',
      'stats.monthly.validate',
      { month },
      env
    );
  }

  try {
    // Create new requests for each endpoint
    const baseUrl = url.origin;

    const [horsesResponse, ridersResponse] = await Promise.all([
      handleHorseStats(new Request(`${baseUrl}/api/calendar/stats/horses?month=${month}`), env),
      handleRiderStats(new Request(`${baseUrl}/api/calendar/stats/riders?month=${month}`), env),
    ]);

    const horses = await horsesResponse.json();
    const riders = await ridersResponse.json();

    return jsonResponse(
      {
        month,
        horses: horses.error ? [] : horses,
        riders: riders.error ? [] : riders,
      },
      200,
      getSecurityHeaders()
    );
  } catch (err) {
    return handleUnexpectedError(err, 'stats.monthly', env);
  }
}
