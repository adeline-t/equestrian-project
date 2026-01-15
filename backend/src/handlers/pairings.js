import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  jsonResponse,
  validateRequired,
} from '../db.js';
import { handleDatabaseError, handleRateLimitError } from '../utils/errorHandler.js';

const LINK_TYPES = ['own', 'loan'];

/**
 * Helper function to convert empty strings to null
 */
function sanitizeDate(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }
  return value;
}

/**
 * /api/pairings
 */
export async function handlePairings(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return handleRateLimitError('pairings.rateLimit');
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // -----------------------------
    // GET /api/pairings
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('rider_horse_pairings')
        .select(
          `
          id,
          rider_id,
          horse_id,
          link_type,
          loan_days_per_week,
          pairing_start_date,
          pairing_end_date,
          riders (
            id,
            name,
            deleted_at
          ),
          horses (
            id,
            name,
            kind,
            ownership_type,
            deleted_at
          )
        `
        )
        .order('pairing_start_date', { ascending: false });

      if (error) return handleDatabaseError(error, 'pairings.list');

      const activeData = data.filter((p) => !p.riders?.deleted_at && !p.horses?.deleted_at);

      return jsonResponse(activeData, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/pairings/:id
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2], 10);
      if (isNaN(pairingId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db
        .from('rider_horse_pairings')
        .select(
          `
          id,
          rider_id,
          horse_id,
          link_type,
          loan_days_per_week,
          pairing_start_date,
          pairing_end_date,
          riders (id, name, phone, email, deleted_at),
          horses (id, name, kind, ownership_type, deleted_at)
        `
        )
        .eq('id', pairingId)
        .single();

      if (error) return handleDatabaseError(error, 'pairings.get');

      if (data.riders?.deleted_at || data.horses?.deleted_at) {
        return jsonResponse({ error: 'Pairing non trouvée' }, 404, getSecurityHeaders());
      }

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/pairings
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      const missingFields = validateRequired(['rider_id', 'horse_id'], body);
      if (missingFields) {
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );
      }

      const riderId = parseInt(body.rider_id, 10);
      const horseId = parseInt(body.horse_id, 10);
      if (isNaN(riderId) || isNaN(horseId)) {
        return jsonResponse({ error: 'IDs invalides' }, 400, getSecurityHeaders());
      }

      const linkType = body.link_type ?? 'own';
      const loanDaysPerWeek = body.loan_days_per_week ?? null;
      const loanDays = body.loan_days ?? [];

      if (!LINK_TYPES.includes(linkType)) {
        return jsonResponse({ error: 'link_type invalide' }, 400, getSecurityHeaders());
      }

      // Validation loan_days_per_week et loan_days
      if (linkType === 'loan') {
        if (!Number.isInteger(loanDaysPerWeek) || loanDaysPerWeek < 1 || loanDaysPerWeek > 7) {
          return jsonResponse(
            { error: 'loan_days_per_week doit être un entier entre 1 et 7' },
            400,
            getSecurityHeaders()
          );
        }

        // Validation des jours
        const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        if (!Array.isArray(loanDays) || !loanDays.every((d) => validDays.includes(d))) {
          return jsonResponse(
            { error: 'loan_days doit être un tableau valide de jours (mon, tue, ...)' },
            400,
            getSecurityHeaders()
          );
        }
      } else {
        // lien own : pas de jours
        if (loanDaysPerWeek !== null || loanDays.length > 0) {
          return jsonResponse(
            { error: 'loan_days_per_week et loan_days interdits pour link_type own' },
            400,
            getSecurityHeaders()
          );
        }
      }

      // ✅ CORRECTION : Traiter les chaînes vides comme null pour les dates
      const pairingData = {
        rider_id: riderId,
        horse_id: horseId,
        link_type: linkType,
        loan_days_per_week: linkType === 'loan' ? loanDaysPerWeek : null,
        loan_days: linkType === 'loan' ? loanDays : [],
        pairing_start_date: sanitizeDate(body.pairing_start_date),
        pairing_end_date: sanitizeDate(body.pairing_end_date),
      };

      const { data, error } = await db
        .from('rider_horse_pairings')
        .insert(pairingData)
        .select(
          `
    id,
    rider_id,
    horse_id,
    link_type,
    loan_days_per_week,
    loan_days,
    pairing_start_date,
    pairing_end_date,
    riders (id, name),
    horses (id, name, kind, ownership_type)
  `
        )
        .single();

      if (error) return handleDatabaseError(error, 'pairings.create');

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/pairings/:id
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2], 10);
      const body = await request.json().catch(() => null);

      if (isNaN(pairingId) || !body) {
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );
      }

      const updateData = { updated_at: new Date().toISOString() };

      // ✅ CORRECTION : Valider les dates seulement si elles ne sont pas vides
      const startDate = sanitizeDate(body.pairing_start_date);
      const endDate = sanitizeDate(body.pairing_end_date);

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return jsonResponse(
          { error: 'La date de début doit précéder la date de fin' },
          400,
          getSecurityHeaders()
        );
      }

      if (body.pairing_start_date !== undefined) {
        updateData.pairing_start_date = sanitizeDate(body.pairing_start_date);
      }
      if (body.pairing_end_date !== undefined) {
        updateData.pairing_end_date = sanitizeDate(body.pairing_end_date);
      }

      if (body.link_type !== undefined) {
        if (!LINK_TYPES.includes(body.link_type)) {
          return jsonResponse({ error: 'link_type invalide' }, 400, getSecurityHeaders());
        }
        updateData.link_type = body.link_type;
      }

      if (body.loan_days_per_week !== undefined) {
        updateData.loan_days_per_week = body.loan_days_per_week;
      }
      if (body.loan_days !== undefined) {
        updateData.loan_days = body.loan_days;
      }

      // Cohérence link_type / loan_days_per_week / loan_days
      const finalLinkType = updateData.link_type ?? body.link_type;
      const finalLoanDaysPerWeek =
        updateData.loan_days_per_week !== undefined
          ? updateData.loan_days_per_week
          : body.loan_days_per_week;
      const finalLoanDays = updateData.loan_days ?? body.loan_days ?? [];

      if (finalLinkType === 'loan') {
        if (
          !Number.isInteger(finalLoanDaysPerWeek) ||
          finalLoanDaysPerWeek < 1 ||
          finalLoanDaysPerWeek > 7
        ) {
          return jsonResponse(
            { error: 'loan_days_per_week doit être un entier entre 1 et 7' },
            400,
            getSecurityHeaders()
          );
        }
        const validDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        if (!Array.isArray(finalLoanDays) || !finalLoanDays.every((d) => validDays.includes(d))) {
          return jsonResponse(
            { error: 'loan_days doit être un tableau valide de jours (mon, tue, ...)' },
            400,
            getSecurityHeaders()
          );
        }
      } else {
        if (finalLoanDaysPerWeek != null || finalLoanDays.length > 0) {
          return jsonResponse(
            { error: 'loan_days_per_week et loan_days interdits pour link_type own' },
            400,
            getSecurityHeaders()
          );
        }
      }

      const { data, error } = await db
        .from('rider_horse_pairings')
        .update(updateData)
        .eq('id', pairingId)
        .select(
          `
          id,
          rider_id,
          horse_id,
          link_type,
          loan_days_per_week,
          pairing_start_date,
          pairing_end_date,
          riders (id, name),
          horses (id, name, kind, ownership_type)
        `
        )
        .single();

      if (error) return handleDatabaseError(error, 'pairings.update');

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/pairings/:id
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const pairingId = parseInt(pathParts[2], 10);
      if (isNaN(pairingId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { error } = await db.from('rider_horse_pairings').delete().eq('id', pairingId);

      if (error) return handleDatabaseError(error, 'pairings.delete');

      return jsonResponse({ message: 'Pairing supprimée avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}
