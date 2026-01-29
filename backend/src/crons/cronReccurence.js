import { getDatabase } from '../db.js';

/**
 * Runs the recurrence cron job: generates planning slots and participants
 *
 * Architecture:
 * - recurrences.event_id → events.id (l'event est créé avant la recurrence)
 * - planning_slots.event_id → events.id (les slots référencent l'event)
 * - event_participants.planning_slot_id → planning_slots.id
 */
export async function runRecurrenceCron(env) {
  console.log(`[${new Date().toISOString()}] Cron job started`);
  const db = getDatabase(env);

  try {
    // 1️⃣ Fetch all active recurrences
    const { data: recurrences, error } = await db
      .from('recurrences')
      .select('*, events(*)')
      .not('event_id', 'is', null);

    if (error) throw new Error(`Error fetching recurrences: ${error.message}`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    for (const rec of recurrences) {
      const eventId = rec.event_id;

      // 2️⃣ Fetch existing slots for this event from today onwards
      const { data: existingSlots, error: slotsError } = await db
        .from('planning_slots')
        .select('slot_date, start_time, end_time')
        .eq('event_id', eventId)
        .gte('slot_date', todayStr);

      if (slotsError) {
        console.error(`Error fetching existing slots for event ${eventId}:`, slotsError);
        continue;
      }

      // 3️⃣ Create a Set of existing slot keys for quick lookup
      const existingSlotKeys = new Set(
        existingSlots?.map((s) => `${s.slot_date}_${s.start_time}_${s.end_time}`) || []
      );

      // 4️⃣ Generate slots for the next X weeks
      const nextSlots = generateNextSlots(rec, 3);

      // 5️⃣ Filter out slots that already exist
      const slotsToCreate = nextSlots.filter((slot) => {
        const key = `${slot.slot_date}_${slot.start_time}_${slot.end_time}`;
        return !existingSlotKeys.has(key);
      });

      if (slotsToCreate.length === 0) {
        console.log(`No new slots to create for recurrence ${rec.id} (event ${eventId})`);
        continue;
      }

      // 6️⃣ Insert new planning slots
      const slotInserts = slotsToCreate.map((slot) => ({
        slot_status: 'scheduled',
        actual_instructor_id: null,
        cancellation_reason: null,
        slot_date: slot.slot_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_all_day: slot.is_all_day,
        event_id: eventId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      const { data: insertedSlots, error: insertError } = await db
        .from('planning_slots')
        .insert(slotInserts)
        .select();

      if (insertError) {
        console.error(`Error inserting slots for event ${eventId}:`, insertError);
        continue;
      }

      console.log(
        `Created ${insertedSlots.length} new slots for recurrence ${rec.id} (event ${eventId})`
      );

      // 7️⃣ Fetch recurrence participants
      const { data: participants, error: participantsError } = await db
        .from('recurrence_participants')
        .select('*')
        .eq('recurrence_id', rec.id);

      if (participantsError) {
        console.error(`Error fetching participants for recurrence ${rec.id}:`, participantsError);
        continue;
      }

      // 8️⃣ Insert participants for each new slot
      if (participants?.length && insertedSlots?.length) {
        const participantInserts = [];

        for (const slot of insertedSlots) {
          for (const p of participants) {
            participantInserts.push({
              planning_slot_id: slot.id,
              rider_id: p.rider_id,
              horse_id: p.horse_id,
              horse_assignment_type: 'automatic',
              is_cancelled: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }

        const { error: participantError } = await db
          .from('event_participants')
          .insert(participantInserts);

        if (participantError) {
          console.error(`Error inserting participants for event ${eventId}:`, participantError);
        } else {
          console.log(
            `Created ${participantInserts.length} participant entries for event ${eventId}`
          );
        }
      }
    }

    console.log(`[${new Date().toISOString()}] Cron job finished successfully`);
  } catch (err) {
    console.error('Cron job error:', err);
  }
}

/**
 * Generate planning slots from a recurrence for the next X weeks
 * Returns { slot_date: YYYY-MM-DD, start_time: HH:mm:ss, end_time: HH:mm:ss, is_all_day }
 */
function generateNextSlots(rec, weeksAhead = 3) {
  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= weeksAhead * 7; i++) {
    const currentDay = new Date(today);
    currentDay.setDate(today.getDate() + i);

    // Map JS getDay() (0=Sun) -> DB week_days (1=Mon ... 7=Sun)
    const dayOfWeek = currentDay.getDay() === 0 ? 7 : currentDay.getDay();
    if (!rec.week_days?.includes(dayOfWeek)) continue;

    const slotDate = currentDay.toISOString().split('T')[0]; // YYYY-MM-DD

    let startTime, endTime, isAllDay;

    if (rec.start_time && rec.end_time) {
      startTime = rec.start_time; // time string from DB: HH:mm:ss
      endTime = rec.end_time;
      isAllDay = false;
    } else {
      startTime = '00:00:00';
      endTime = '23:59:59';
      isAllDay = true;
    }

    slots.push({
      slot_date: slotDate,
      start_time: startTime,
      end_time: endTime,
      is_all_day: isAllDay,
    });
  }

  return slots;
}
