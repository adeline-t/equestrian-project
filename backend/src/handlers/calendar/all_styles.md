# 📁 Project Files Export

Generated on: Sun Jan 18 06:39:19 CET 2026

## 📄 events.js
**Path:** `events.js`

```
import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError } from '../../utils/errorHandler.js';

const EVENT_TYPES = ['private_lesson', 'grouped_lesson', 'service', 'blocked'];

export async function handleEvents(request, env, idParam) {
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  const db = getDatabase(env);
  const eventColumns = [
    'planning_slot_id',
    'event_type',
    'instructor_id',
    'min_participants',
    'max_participants',
  ];

  try {
    // GET list
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('events')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });
      if (error) return handleDatabaseError(error, 'events.list');
      return jsonResponse(data || [], 200, getSecurityHeaders());
    }

    // GET single
    if (request.method === 'GET' && id) {
      const { data, error } = await db
        .from('events')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();
      if (error) return handleDatabaseError(error, 'events.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());
      const missing = validateRequired(['planning_slot_id', 'event_type', 'instructor_id'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!EVENT_TYPES.includes(body.event_type))
        return jsonResponse(
          { error: `event_type invalide. Valeurs: ${EVENT_TYPES.join(', ')}` },
          400,
          getSecurityHeaders()
        );
      if (body.min_participants != null && body.min_participants < 0)
        return jsonResponse({ error: 'min_participants >= 0' }, 400, getSecurityHeaders());
      if (body.max_participants != null && body.max_participants < 0)
        return jsonResponse({ error: 'max_participants >= 0' }, 400, getSecurityHeaders());

      const insertData = {
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      for (const col of eventColumns) if (body[col] !== undefined) insertData[col] = body[col];

      const { data, error } = await db.from('events').insert(insertData).select().single();
      if (error) return handleDatabaseError(error, 'events.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      if (body.event_type && !EVENT_TYPES.includes(body.event_type))
        return jsonResponse(
          { error: `event_type invalide. Valeurs: ${EVENT_TYPES.join(', ')}` },
          400,
          getSecurityHeaders()
        );
      if (body.min_participants != null && body.min_participants < 0)
        return jsonResponse({ error: 'min_participants >= 0' }, 400, getSecurityHeaders());
      if (body.max_participants != null && body.max_participants < 0)
        return jsonResponse({ error: 'max_participants >= 0' }, 400, getSecurityHeaders());

      const updateData = { updated_at: new Date().toISOString() };
      for (const col of eventColumns) if (body[col] !== undefined) updateData[col] = body[col];

      const { data, error } = await db
        .from('events')
        .update(updateData)
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'events.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE soft delete
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('events')
        .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .is('deleted_at', null)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'events.delete');
      return jsonResponse({ message: 'Event supprimé', event: data }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (err) {
    console.error('Events error:', err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}
```

---

## 📄 index.js
**Path:** `index.js`

```
export { handleCalendarWeek } from './week.js';
export { handlePlanningSlots } from './slots.js';
export { handleEvents } from './events.js';
export { handleEventParticipants } from './participants.js';
export { handleRecurrences } from './recurrences.js';
```

---

## 📄 participants.js
**Path:** `participants.js`

```
import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError } from '../../utils/errorHandler.js';

const HORSE_ASSIGNMENT_TYPES = ['manual', 'automatic'];

export async function handleEventParticipants(request, env, idParam) {
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  const db = getDatabase(env);
  const participantColumns = [
    'event_id',
    'planning_slot_id',
    'rider_id',
    'horse_id',
    'horse_assignment_type',
    'is_cancelled',
  ];

  try {
    // GET list
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('event_participants')
        .select('*')
        .is('is_cancelled', false)
        .order('created_at', { ascending: false });
      if (error) return handleDatabaseError(error, 'participants.list');
      return jsonResponse(data || [], 200, getSecurityHeaders());
    }

    // GET single
    if (request.method === 'GET' && id) {
      const { data, error } = await db.from('event_participants').select('*').eq('id', id).single();
      if (error) return handleDatabaseError(error, 'participants.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const missing = validateRequired(
        ['event_id', 'planning_slot_id', 'rider_id', 'horse_assignment_type'],
        body
      );
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
      if (error) return handleDatabaseError(error, 'participants.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update
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
      if (error) return handleDatabaseError(error, 'participants.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE cancel
    if (request.method === 'DELETE' && id) {
      const { data, error } = await db
        .from('event_participants')
        .update({ is_cancelled: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'participants.delete');
      return jsonResponse(
        { message: 'Participant annulé', participant: data },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (err) {
    console.error('Participants error:', err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}
```

---

## 📄 recurrences.js
**Path:** `recurrences.js`

```
import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError } from '../../utils/errorHandler.js';

const RECURRENCE_FREQUENCIES = ['daily', 'weekly', 'monthly'];

export async function handleRecurrences(request, env, idParam) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  try {
    // GET all
    if (request.method === 'GET' && !id) {
      const { data, error } = await db
        .from('recurrences')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return handleDatabaseError(error, 'recurrences.list');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // GET single
    if (request.method === 'GET' && id) {
      const { data, error } = await db.from('recurrences').select('*').eq('id', id).single();
      if (error) return handleDatabaseError(error, 'recurrences.get');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // POST create
    if (request.method === 'POST') {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());
      const missing = validateRequired(['frequency'], body);
      if (missing)
        return jsonResponse({ error: `Champs requis: ${missing}` }, 400, getSecurityHeaders());

      if (!RECURRENCE_FREQUENCIES.includes(body.frequency))
        return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());

      const insertData = {
        frequency: body.frequency,
        interval: body.interval ?? 1,
        by_week_days: Array.isArray(body.by_week_days)
          ? body.by_week_days.filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
          : null,
        start_time: body.start_time ?? null,
        end_time: body.end_time ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db.from('recurrences').insert(insertData).select().single();
      if (error) return handleDatabaseError(error, 'recurrences.create');
      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // PUT update
    if (request.method === 'PUT' && id) {
      const body = await request.json().catch(() => null);
      if (!body) return jsonResponse({ error: 'Corps invalide' }, 400, getSecurityHeaders());

      const updateData = { updated_at: new Date().toISOString() };
      if (body.frequency) {
        if (!RECURRENCE_FREQUENCIES.includes(body.frequency))
          return jsonResponse({ error: 'frequency invalide' }, 400, getSecurityHeaders());
        updateData.frequency = body.frequency;
      }
      if (body.interval !== undefined) {
        if (!Number.isInteger(body.interval) || body.interval < 1)
          return jsonResponse(
            { error: 'interval doit être un entier > 0' },
            400,
            getSecurityHeaders()
          );
        updateData.interval = body.interval;
      }
      if (body.by_week_days !== undefined)
        updateData.by_week_days = Array.isArray(body.by_week_days)
          ? body.by_week_days.filter((d) => Number.isInteger(d) && d >= 1 && d <= 7)
          : null;
      if (body.start_time !== undefined) updateData.start_time = body.start_time;
      if (body.end_time !== undefined) updateData.end_time = body.end_time;

      const { data, error } = await db
        .from('recurrences')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) return handleDatabaseError(error, 'recurrences.update');
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // DELETE
    if (request.method === 'DELETE' && id) {
      const { error } = await db.from('recurrences').delete().eq('id', id);
      if (error) return handleDatabaseError(error, 'recurrences.delete');
      return jsonResponse(
        { message: 'Récurrence supprimée avec succès' },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (err) {
    console.error('Recurrences error:', err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}
```

---

## 📄 slots.js
**Path:** `slots.js`

```
import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError } from '../../utils/errorHandler.js';

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
      if (error) return handleDatabaseError(error, 'slots.list');
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
      if (error) return handleDatabaseError(error, 'slots.get');
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
      if (error) return handleDatabaseError(error, 'slots.create');
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
      if (error) return handleDatabaseError(error, 'slots.update');
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
      if (error) return handleDatabaseError(error, 'slots.delete');
      return jsonResponse(
        { message: 'Planning slot supprimé', slot: data },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (err) {
    console.error('Planning slots error:', err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}
```

---

## 📄 week.js
**Path:** `week.js`

```
import { getSecurityHeaders, jsonResponse, getDatabase } from '../../db.js';
import { handleDatabaseError } from '../../utils/errorHandler.js';

// Week view for calendar
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
  weekEnd.setDate(weekEnd.getDate() + 7);

  try {
    const { data: slots, error } = await db
      .from('planning_slots')
      .select(
        `
        id, start_time, end_time, slot_status, is_all_day, actual_instructor_id,
        cancellation_reason, created_at, updated_at,
        events!inner (
          id, event_type, instructor_id, min_participants, max_participants,
          event_participants (
            id, rider_id, horse_id, horse_assignment_type, is_cancelled,
            riders(id, name), horses(id, name)
          )
        )
      `
      )
      .gte('start_time', weekStart.toISOString())
      .lt('start_time', weekEnd.toISOString())
      .is('deleted_at', null)
      .order('start_time', { ascending: true });

    if (error) return handleDatabaseError(error, 'calendar.week.fetch');

    const weekData = buildWeekReadModel(weekStart, slots || []);
    return jsonResponse(weekData, 200, getSecurityHeaders());
  } catch (err) {
    console.error('Week view error:', err);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: err.message },
      500,
      getSecurityHeaders()
    );
  }
}

function buildWeekReadModel(weekStart, slots) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().slice(0, 10), slots: [] };
  });

  for (const slot of slots) {
    const dateStr = slot.start_time.slice(0, 10);
    const day = days.find((d) => d.date === dateStr);
    if (!day) continue;

    const event = slot.events?.[0] ?? null;
    const participants =
      event?.event_participants
        ?.filter((p) => !p.is_cancelled)
        ?.map((p) => ({
          participant_id: p.id,
          rider_id: p.rider_id,
          rider_name: p.riders?.name ?? null,
          horse_id: p.horse_id,
          horse_name: p.horses?.name ?? null,
          horse_assignment_type: p.horse_assignment_type,
        })) ?? [];

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
```

---

