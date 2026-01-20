import { getDatabase } from './db.js';

/**
 * Runs the recurrence cron job: generates planning slots, events, and participants
 */
export async function runRecurrenceCron(env) {
  console.log(`[${new Date().toISOString()}] Cron job started`);
  const db = getDatabase(env);

  try {
    // 1️⃣ Fetch all recurrences (assume all are active)
    const { data: recurrences, error } = await db.from('recurrences').select('*');

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
          .eq('slot_date', slot.slot_date)
          .single();

        let slotId;

        if (!existingSlot) {
          // Insert the planning slot
          const { data: insertedSlot, error: insertError } = await db
            .from('planning_slots')
            .insert({
              slot_status: 'confirmed',
              actual_instructor_id: null,
              cancellation_reason: null,
              slot_date: slot.slot_date,
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
          .eq('event_type', rec.event_type || 'lesson')
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
              name: null,
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
