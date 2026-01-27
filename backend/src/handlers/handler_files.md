# 📁 Project Files Export

Generated on: Tue Jan 27 09:45:47 CET 2026

## 📄 slots.js

**Path:** `calendar/slots.js`

```
import { getSecurityHeaders, jsonResponse, validateRequired, getDatabase } from '../../db.js';
import { handleDatabaseError, handleUnexpectedError } from '../../utils/errorHandler.js';

const SLOT_STATUSES = ['scheduled', 'confirmed', 'cancelled', 'blocked'];

export async function handlePlanningSlots(request, env, idParam) {
  const id = idParam ? parseInt(idParam, 10) : null;
  if (idParam && isNaN(id))
    return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

  const db = getDatabase(env);
  const url = new URL(request.url); // <-- On utilise url.pathname partout
  const slotColumns = [
    'slot_status',
    'actual_instructor_id',
    'cancellation_reason',
    'start_time',
    'end_time',
    'is_all_day',
    'slot_date',
    'event_id',
  ];

  try {
    // GET scheduled events only
    if (request.method === 'GET' && url.pathname.endsWith('/scheduled')) {
      const { data: slots, error: slotsError } = await db
        .from('planning_slots')
        .select(
          `
        *,
        events (*),
        event_participants (
          planning_slot_id,
          rider_id,
          horse_id,
          horse_assignment_type,
          is_cancelled,
          riders (
            id,
            name
          ),
          horses (
            id,
            name,
            kind
          )
        )
      `
        )
        .eq('slot_status', 'scheduled')
        .is('deleted_at', null)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (slotsError) return handleDatabaseError(slotsError, 'slots.scheduled', env);

      return jsonResponse(slots, 200, getSecurityHeaders());
    }

    // GET single slot with full details
    if (request.method === 'GET' && id && url.pathname.endsWith('/full-details')) {
      const { data: slot, error: slotError } = await db
        .from('planning_slots')
        .select(
          `
          *,
          events(*)
        `
        )
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      // Get participants linked to the slot (planning_slot_id)
      const { data: participantsData, error: participantsError } = await db
        .from('event_participants')
        .select(
          `
          *,
          rider:riders (id, name, email, phone, rider_type),
          horse:horses (id, name, kind, ownership_type)
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
        { slot, participants: participantsData || [] },
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
        ['slot_date', 'start_time', 'end_time', 'slot_status', 'event_id'],
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
        event_id: body.event_id,
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

    // PUT cancel slot
    if (request.method === 'PUT' && id && url.pathname.endsWith('/cancel')) {
      const body = await request.json().catch(() => null);

      if (!body || typeof body.cancellation_reason !== 'string') {
        return jsonResponse(
          { error: 'cancellation_reason requis (string)' },
          400,
          getSecurityHeaders()
        );
      }

      const { data, error } = await db
        .from('planning_slots')
        .update({
          slot_status: 'cancelled',
          cancellation_reason: body.cancellation_reason,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) return handleDatabaseError(error, 'slots.cancel', env);

      return jsonResponse(data, 200, getSecurityHeaders());
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
```

---

## 📄 week.js

**Path:** `calendar/week.js`

```
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
```

---

**Path:** `horses.js`

```
import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError, handleRateLimitError } from '../utils/errorHandler.js';

const HORSE_TYPES = ['horse', 'pony'];
const OWNERS = ['laury', 'private_owner', 'club', 'other'];
const isActiveBetween = (start, end, today) =>
  (!start || new Date(start) <= today) && (!end || new Date(end) >= today);

/**
 * Helper to extract and deduplicate loan days from pairings
 */
function extractLoanDays(pairings, horseId, today) {
  const loanDaysSet = new Set();

  pairings
    .filter(
      (p) =>
        p.horse_id === horseId &&
        p.link_type === 'loan' &&
        isActiveBetween(p.pairing_start_date, p.pairing_end_date, today) &&
        p.riders &&
        !p.riders.deleted_at &&
        isActiveBetween(p.riders.activity_start_date, p.riders.activity_end_date, today)
    )
    .forEach((p) => {
      if (p.loan_days && Array.isArray(p.loan_days)) {
        p.loan_days.forEach((day) => loanDaysSet.add(day));
      }
    });

  // Convert to array and sort in week order
  const weekOrder = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const weekOrderEn = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return Array.from(loanDaysSet).sort((a, b) => {
    const indexA = weekOrderEn.indexOf(a.toLowerCase());
    const indexB = weekOrderEn.indexOf(b.toLowerCase());
    return indexA - indexB;
  });
}

/**
 * /api/horses
 */
export async function handleHorses(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) return handleRateLimitError('horses.rateLimit');
  if (request.method === 'OPTIONS') return jsonResponse({}, 204, getSecurityHeaders());

  try {
    const today = new Date();

    // -----------------------------
    // GET /api/horses
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data: horses, error: horsesError } = await db
        .from('horses')
        .select('*')
        .is('deleted_at', null)
        .order('name');
      if (horsesError) return handleDatabaseError(horsesError, 'horses.list');

      // Fetch pairings with riders info for counting and loan days
      const { data: pairings, error: pairingsError } = await db.from('rider_horse_pairings')
        .select(`
          id,
          horse_id,
          rider_id,
          link_type,
          loan_days,
          pairing_start_date,
          pairing_end_date,
          riders (
            id,
            name,
            activity_start_date,
            activity_end_date,
            deleted_at
          )
        `);

      if (pairingsError) return handleDatabaseError(pairingsError, 'horses.listPairings');

      // Count active riders per horse
      const countsByHorse = pairings.reduce((acc, pairing) => {
        const rider = pairing.riders;
        if (
          rider &&
          !rider.deleted_at &&
          isActiveBetween(pairing.pairing_start_date, pairing.pairing_end_date, today) &&
          isActiveBetween(rider.activity_start_date, rider.activity_end_date, today)
        ) {
          acc[pairing.horse_id] = (acc[pairing.horse_id] || 0) + 1;
        }
        return acc;
      }, {});

      // Build result with active_riders_count AND loan_days
      const result = horses.map((horse) => ({
        ...horse,
        active_riders_count: countsByHorse[horse.id] || 0,
        loan_days: extractLoanDays(pairings, horse.id, today),
      }));

      return jsonResponse(result, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/horses/:id
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const horseId = Number(pathParts[2]);
      if (!Number.isInteger(horseId))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data: horse, error: horseError } = await db
        .from('horses')
        .select(
          `
          *,
          rider_horse_pairings(
            *,
            riders (
              *
            )
          )
          `
        )
        .is('deleted_at', null)
        .eq('id', horseId)
        .single();
      if (horseError) return handleDatabaseError(horseError, 'horses.get');

      // Get pairings from the horse object
      const pairings = horse.rider_horse_pairings || [];

      // Count active riders
      const activeRidersCount = pairings.filter((pairing) => {
        const rider = pairing.riders;
        return (
          rider &&
          !rider.deleted_at &&
          isActiveBetween(pairing.pairing_start_date, pairing.pairing_end_date, today) &&
          isActiveBetween(rider.activity_start_date, rider.activity_end_date, today)
        );
      }).length;

      const result = {
        ...horse,
        active_riders_count: activeRidersCount,
      };

      return jsonResponse(result, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/horses
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const missingFields = validateRequired(['name', 'kind', 'ownership_type'], body);
      if (missingFields)
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );

      if (!HORSE_TYPES.includes(body.kind))
        return jsonResponse(
          { error: 'Le type doit être "horse" ou "pony"' },
          400,
          getSecurityHeaders()
        );
      if (!OWNERS.includes(body.ownership_type))
        return jsonResponse({ error: 'Propriétaire invalide' }, 400, getSecurityHeaders());

      if (
        body.activity_start_date &&
        body.activity_end_date &&
        new Date(body.activity_start_date) > new Date(body.activity_end_date)
      ) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      const horseData = {
        name: body.name.trim(),
        kind: body.kind,
        activity_start_date: body.activity_start_date ?? null,
        activity_end_date: body.activity_end_date ?? null,
        ownership_type: body.ownership_type,
      };

      const { data, error } = await db.from('horses').insert(horseData).select().single();
      if (error) return handleDatabaseError(error, 'horses.create');

      // Nouveau cheval = pas de pensions actives
      const result = {
        ...data,
        active_riders_count: 0,
        loan_days: [],
      };

      return jsonResponse(result, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/horses/:id
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 3) {
      const horseId = Number(pathParts[2]);
      const body = await request.json().catch(() => null);
      if (!Number.isInteger(horseId) || !body)
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );

      if (body.kind && !HORSE_TYPES.includes(body.kind))
        return jsonResponse(
          { error: 'Le type doit être "horse" ou "pony"' },
          400,
          getSecurityHeaders()
        );
      if (body.ownership_type && !OWNERS.includes(body.ownership_type))
        return jsonResponse({ error: 'Propriétaire invalide' }, 400, getSecurityHeaders());

      if (
        body.activity_start_date &&
        body.activity_end_date &&
        new Date(body.activity_start_date) > new Date(body.activity_end_date)
      ) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = {
        name: body.name?.trim(),
        kind: body.kind,
        activity_start_date: body.activity_start_date ?? null,
        activity_end_date: body.activity_end_date ?? null,
        ownership_type: body.ownership_type,
        updated_at: new Date().toISOString(),
      };

      Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

      const { data: horse, error: updateError } = await db
        .from('horses')
        .update(updateData)
        .eq('id', horseId)
        .select()
        .single();
      if (updateError) return handleDatabaseError(updateError, 'horses.update');

      // Fetch pairings to enrich response
      const { data: pairings, error: pairingsError } = await db
        .from('rider_horse_pairings')
        .select(
          `
          id,
          horse_id,
          rider_id,
          link_type,
          loan_days,
          pairing_start_date,
          pairing_end_date,
          riders (
            id,
            activity_start_date,
            activity_end_date,
            deleted_at
          )
        `
        )
        .eq('horse_id', horseId);

      if (pairingsError) return handleDatabaseError(pairingsError, 'horses.updatePairings');

      // Count active riders
      const activeRidersCount = pairings.filter((pairing) => {
        const rider = pairing.riders;
        return (
          rider &&
          !rider.deleted_at &&
          isActiveBetween(pairing.pairing_start_date, pairing.pairing_end_date, today) &&
          isActiveBetween(rider.activity_start_date, rider.activity_end_date, today)
        );
      }).length;

      // Extract loan days
      const loanDays = extractLoanDays(pairings, horseId, today);

      const result = {
        ...horse,
        active_riders_count: activeRidersCount,
        loan_days: loanDays,
      };

      return jsonResponse(result, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/horses/:id
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const horseId = Number(pathParts[2]);
      if (!Number.isInteger(horseId))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { count } = await db
        .from('rider_horse_pairings')
        .select('id', { count: 'exact', head: true })
        .eq('horse_id', horseId);
      if (count > 0)
        return jsonResponse(
          { error: 'Impossible de supprimer un cheval avec des cavaliers actifs' },
          409,
          getSecurityHeaders()
        );

      const { error } = await db
        .from('horses')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', horseId);
      if (error) return handleDatabaseError(error, 'horses.delete');

      return jsonResponse({ message: 'Cheval supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}

/**
 * GET /api/horses/:id/riders
 * Retourne le cheval avec ses pairings pour la HorseCard
 */
export async function handleHorseRiders(request, env, horseId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000))
    return handleRateLimitError('horses.getRiders.rateLimit');

  try {
    const horseIdNum = Number(horseId);
    if (!Number.isInteger(horseIdNum))
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    // Fetch horse with all its data
    const { data: horse, error: horseError } = await db
      .from('horses')
      .select('*')
      .eq('id', horseIdNum)
      .is('deleted_at', null)
      .single();

    if (horseError) return handleDatabaseError(horseError, 'horses.getRiders.horse');
    if (!horse) return jsonResponse({ error: 'Cheval non trouvé' }, 404, getSecurityHeaders());

    // Fetch pairings with rider details
    const { data: pairings, error: pairingsError } = await db
      .from('rider_horse_pairings')
      .select(
        `
        id,
        rider_id,
        link_type,
        loan_days,
        loan_days_per_week,
        pairing_start_date,
        pairing_end_date,
        riders (
          id,
          name,
          rider_type,
          activity_start_date,
          activity_end_date,
          deleted_at
        )
      `
      )
      .eq('horse_id', horseIdNum)
      .order('pairing_start_date', { ascending: false });

    if (pairingsError) return handleDatabaseError(pairingsError, 'horses.getRiders.pairings');

    // Transform pairings to flatten rider data
    const formattedPairings = (pairings || []).map((pairing) => ({
      id: pairing.id,
      rider_id: pairing.rider_id,
      rider_name: pairing.riders?.name || 'N/A',
      link_type: pairing.link_type,
      loan_days: pairing.loan_days || [],
      loan_days_per_week: pairing.loan_days_per_week || 0,
      pairing_start_date: pairing.pairing_start_date,
      pairing_end_date: pairing.pairing_end_date,
    }));

    // Return horse with pairings array
    const result = {
      ...horse,
      pairings: formattedPairings,
    };

    return jsonResponse(result, 200, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}
```

---

## 📄 riderMonthlyBilling.js

**Path:** `stats/riderMonthlyBilling.js`

```
import { getSecurityHeaders, jsonResponse, getDatabase } from '../../db.js';
import {
  handleDatabaseError,
  handleUnexpectedError,
  handleValidationError,
} from '../../utils/errorHandler.js';
import { format, startOfMonth, endOfMonth } from 'date-fns';

/**
 * GET /api/calendar/rider-billing?month=YYYY-MM
 * Returns monthly billing summary per rider
 */
export async function handleRiderMonthlyBilling(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  }

  const url = new URL(request.url);
  const month = url.searchParams.get('month');

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return handleValidationError(
      'Paramètre "month" requis au format YYYY-MM',
      'riderBilling.validate',
      { month },
      env
    );
  }

  const db = getDatabase(env);

  try {
    const monthDate = new Date(`${month}-01`);
    const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');

    // Fetch billing data
    const { data: billing, error: billingError } = await db
      .from('rider_monthly_billing')
      .select('*')
      .gte('billing_month', monthStart)
      .lte('billing_month', monthEnd)
      .order('rider_id');

    if (billingError) return handleDatabaseError(billingError, 'riderBilling.fetch', env);

    return jsonResponse(billing || [], 200, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'riderBilling', env);
  }
}
```

---

## 📄 stats.js

**Path:** `stats/stats.js`

```
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
```

---
