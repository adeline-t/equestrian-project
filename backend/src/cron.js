import { getDatabase } from './db.js';

/**
 * Runs the recurrence cron job: generates planning slots, events, and participants
 */
export async function runRecurrenceCron(env) {
  console.log(`[${new Date().toISOString()}] Cron job started`);
  const db = getDatabase(env);

  try {
    // 1️⃣ Fetch all active recurrences
    const { data: recurrences, error } = await db
      .from('recurrences')
      .select('*')
      .eq('is_active', true); // make sure you have an is_active column

    if (error) throw new Error(`Error fetching recurrences: ${error.message}`);

    for (const rec of recurrences) {
      // 2️⃣ Fetch recurrence participants
      const { data: participants, error: participantsError } = await db
        .from('recurrence_participants')
        .select('*')
        .eq('recurrence_id', rec.id);

      if (participantsError) {
        console.error('Error fetching recurrence participants:', participantsError);
        continue;
      }

      // 3️⃣ Generate slots
      const nextSlots = generateNextSlots(rec, 3);

      for (const slot of nextSlots) {
        // Check if slot already exists
        const { data: existingSlot } = await db
          .from('planning_slots')
          .select('*')
          .eq('recurrence_id', rec.id)
          .eq('start_time', slot.start_time)
          .single();

        let slotId;

        if (!existingSlot) {
          // Insert the planning slot
          const { data: insertedSlot, error: insertError } = await db
            .from('planning_slots')
            .insert({
              slot_status: 'confirmed', // default status
              actual_instructor_id: null,
              cancellation_reason: null,
              start_time: slot.start_time,
              end_time: slot.end_time,
              is_all_day: slot.is_all_day,
              recurrence_id: rec.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error inserting slot:', insertError);
            continue;
          }
          slotId = insertedSlot.id;
        } else {
          slotId = existingSlot.id;
        }

        // 4️⃣ Create event for this slot if it doesn't exist
        const { data: existingEvent } = await db
          .from('events')
          .select('*')
          .eq('planning_slot_id', slotId)
          .eq('event_type', rec.event_type || 'lesson') // allow rec.event_type
          .eq('instructor_id', rec.instructor_id || null)
          .single();

        let eventId;

        if (!existingEvent) {
          const { data: insertedEvent, error: eventError } = await db
            .from('events')
            .insert({
              planning_slot_id: slotId,
              event_type: rec.event_type || 'lesson',
              instructor_id: rec.instructor_id || null,
              min_participants: rec.min_participants || 0,
              max_participants: rec.max_participants || null,
              deleted_at: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (eventError) {
            console.error('Error inserting event:', eventError);
            continue;
          }

          eventId = insertedEvent.id;
        } else {
          eventId = existingEvent.id;
        }

        // 5️⃣ Insert participants for this event
        if (participants?.length) {
          const participantInserts = participants.map((p) => ({
            event_id: eventId,
            planning_slot_id: slotId,
            rider_id: p.rider_id,
            horse_id: p.horse_id,
            horse_assignment_type: 'automatic',
            is_cancelled: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }));

          await db.from('event_participants').insert(participantInserts);
        }
      }
    }

    console.log(`[${new Date().toISOString()}] Cron job finished`);
  } catch (err) {
    console.error('Cron job error:', err);
  }
}

/**
 * Generate planning slots from a recurrence for the next X weeks
 * If start_time or end_time is missing, the slot will be all-day
 */
function generateNextSlots(rec, weeksAhead = 3) {
  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= weeksAhead * 7; i++) {
    const currentDay = new Date(today);
    currentDay.setDate(today.getDate() + i);

    // Map JS getDay() (0=Sun) -> DB by_week_days (1=Mon ... 7=Sun)
    const dayOfWeek = currentDay.getDay() === 0 ? 7 : currentDay.getDay();
    if (!rec.by_week_days?.includes(dayOfWeek)) continue;

    let start, end, isAllDay;

    if (rec.start_time && rec.end_time) {
      start = new Date(currentDay);
      start.setHours(rec.start_time.getHours(), rec.start_time.getMinutes(), 0, 0);

      end = new Date(currentDay);
      end.setHours(rec.end_time.getHours(), rec.end_time.getMinutes(), 0, 0);

      isAllDay = rec.all_day || false;
    } else {
      start = new Date(currentDay);
      start.setHours(0, 0, 0, 0);

      end = new Date(currentDay);
      end.setHours(23, 59, 59, 999);

      isAllDay = true;
    }

    slots.push({
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      is_all_day: isAllDay,
    });
  }

  return slots;
}
