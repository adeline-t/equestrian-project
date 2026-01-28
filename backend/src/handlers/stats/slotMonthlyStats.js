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
 * GET /api/stats/slots?month=YYYY-MM&instructor_id=X
 * Returns all valid slots with events and participants, grouped by week
 * Optionally filtered by instructor (actual_instructor_id or event instructor_id)
 */
export async function handleSlotStats(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  }

  const url = new URL(request.url);
  const month = url.searchParams.get('month');
  const instructorId = url.searchParams.get('instructor_id') ?? 1;

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return handleValidationError(
      'Paramètre "month" requis au format YYYY-MM',
      'stats.slots.validate',
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

    // Fetch all valid slots with their events
    const { data: slots, error: slotsError } = await db
      .from('planning_slots')
      .select(
        `
        id,
        slot_date,
        start_time,
        end_time,
        is_all_day,
        slot_status,
        actual_instructor_id,
        event_id,
        events (
          id,
          name,
          event_type,
          instructor_id,
          min_participants,
          max_participants
        )
      `
      )
      .gte('slot_date', format(firstWeekStart, 'yyyy-MM-dd'))
      .lte('slot_date', format(lastWeekEnd, 'yyyy-MM-dd'))
      .not('slot_status', 'eq', 'cancelled')
      .is('deleted_at', null)
      .order('slot_date')
      .order('start_time');

    if (slotsError) return handleDatabaseError(slotsError, 'stats.slots.fetchSlots', env);

    // Filter by instructor if specified
    let filteredSlots = slots;
    if (instructorId) {
      const instructorIdNum = parseInt(instructorId, 10);
      filteredSlots = slots.filter((slot) => {
        const effectiveInstructor =
          slot.actual_instructor_id !== null
            ? slot.actual_instructor_id
            : slot.events?.instructor_id;
        return effectiveInstructor === instructorIdNum;
      });
    }

    // Get all slot IDs to fetch participants
    const slotIds = filteredSlots.map((s) => s.id);

    // Fetch participants for these slots (only if we have slots)
    let participants = [];
    if (slotIds.length > 0) {
      const { data: participantsData, error: participantsError } = await db
        .from('event_participants')
        .select(
          `
          id,
          planning_slot_id,
          rider_id,
          horse_id,
          horse_assignment_type,
          is_cancelled,
          riders (
            id,
            name,
            rider_type
          ),
          horses (
            id,
            name,
            ownership_type
          )
        `
        )
        .in('planning_slot_id', slotIds)
        .eq('is_cancelled', false);

      if (participantsError)
        return handleDatabaseError(participantsError, 'stats.slots.fetchParticipants', env);

      participants = participantsData;
    }

    // Group participants by slot
    const participantsBySlot = {};
    participants.forEach((p) => {
      if (!participantsBySlot[p.planning_slot_id]) {
        participantsBySlot[p.planning_slot_id] = [];
      }
      participantsBySlot[p.planning_slot_id].push({
        id: p.id,
        riderId: p.rider_id,
        riderName: p.riders?.name,
        riderType: p.riders?.rider_type,
        horseId: p.horse_id,
        horseName: p.horses?.name,
        horseOwnershipType: p.horses?.ownership_type,
        assignmentType: p.horse_assignment_type,
      });
    });

    // Group slots by week
    const weeklyStats = weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      const weekSlots = filteredSlots
        .filter((slot) => {
          const slotDate = new Date(slot.slot_date);
          return slotDate >= weekStart && slotDate <= weekEnd;
        })
        .map((slot) => {
          const effectiveInstructor =
            slot.actual_instructor_id !== null
              ? slot.actual_instructor_id
              : slot.events?.instructor_id;

          return {
            slotId: slot.id,
            date: slot.slot_date,
            startTime: slot.start_time,
            endTime: slot.end_time,
            isAllDay: slot.is_all_day,
            status: slot.slot_status,
            actualInstructorId: slot.actual_instructor_id,
            effectiveInstructorId: effectiveInstructor,
            event: {
              id: slot.events?.id,
              name: slot.events?.name,
              type: slot.events?.event_type,
              instructorId: slot.events?.instructor_id,
              minParticipants: slot.events?.min_participants,
              maxParticipants: slot.events?.max_participants,
            },
            participants: participantsBySlot[slot.id] || [],
          };
        });

      return {
        weekNumber: index + 1,
        startDate: format(weekStart, 'yyyy-MM-dd'),
        endDate: format(weekEnd, 'yyyy-MM-dd'),
        slots: weekSlots,
        totalSlots: weekSlots.length,
      };
    });

    return jsonResponse(
      {
        month,
        instructorId: instructorId ? parseInt(instructorId, 1) : 1,
        weeks: weeklyStats,
        totalSlots: filteredSlots.length,
      },
      200,
      getSecurityHeaders()
    );
  } catch (err) {
    return handleUnexpectedError(err, 'stats.slots', env);
  }
}
