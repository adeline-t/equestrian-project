import {
  checkRateLimit,
  getDatabase,
  getSecurityHeaders,
  handleDbError,
  jsonResponse,
  validateEmail,
  validatePhone,
  validateRequired,
} from '../db.js';

const RIDER_TYPES = ['owner', 'club', 'loaner'];
const isValidRiderType = (type) => RIDER_TYPES.includes(type);

/**
 * /api/riders
 */
export async function handleRiders(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limit
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    const today = new Date();

    // -----------------------------
    // GET /api/riders
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data: riders, error: ridersError } = await db
        .from('riders')
        .select('*')
        .is('deleted_at', null)
        .order('name');

      if (ridersError) return handleDbError(ridersError);

      const ridersWithCounts = await Promise.all(
        riders.map(async (rider) => {
          // Active horses
          const { data: pairings } = await db
            .from('rider_horse_pairings')
            .select(
              `
              pairing_start_date,
              pairing_end_date,
              horses (
                activity_start_date,
                activity_end_date
              )
            `
            )
            .eq('rider_id', rider.id);

          const activeHorsesCount =
            pairings?.filter((pairing) => {
              const pairingActive =
                (!pairing.pairing_start_date || new Date(pairing.pairing_start_date) <= today) &&
                (!pairing.pairing_end_date || new Date(pairing.pairing_end_date) >= today);

              const horse = pairing.horses;
              const horseActive =
                horse &&
                (!horse.activity_start_date || new Date(horse.activity_start_date) <= today) &&
                (!horse.activity_end_date || new Date(horse.activity_end_date) >= today);

              return pairingActive && horseActive;
            }).length || 0;

          // Active packages
          const { data: packages } = await db.from('packages').select('*').eq('rider_id', rider.id);

          let activePackagesCount = 0;
          let servicesPerWeek = 0;
          let groupLessonsPerWeek = 0;

          packages?.forEach((pkg) => {
            const active = pkg.is_active;

            if (active) {
              activePackagesCount++;
              servicesPerWeek += pkg.services_per_week || 0;
              groupLessonsPerWeek += pkg.group_lessons_per_week || 0;
            }
          });

          return {
            ...rider,
            active_horses_count: activeHorsesCount,
            active_packages_count: activePackagesCount,
            services_per_week: servicesPerWeek,
            group_lessons_per_week: groupLessonsPerWeek,
          };
        })
      );

      return jsonResponse(ridersWithCounts, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/riders/:id
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const riderId = Number(pathParts[2]);
      if (!Number.isInteger(riderId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db
        .from('riders')
        .select('*')
        .is('deleted_at', null)
        .eq('id', riderId)
        .single();

      if (error) return handleDbError(error);

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/riders
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const missingFields = validateRequired(['name', 'rider_type'], body);
      if (missingFields)
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );

      if (!isValidRiderType(body.rider_type))
        return jsonResponse(
          { error: 'Le type doit être "owner", "club" ou "loaner"' },
          400,
          getSecurityHeaders()
        );

      if (body.email && !validateEmail(body.email))
        return jsonResponse({ error: "Format d'email invalide" }, 400, getSecurityHeaders());
      if (body.phone && !validatePhone(body.phone))
        return jsonResponse({ error: 'Format de téléphone invalide' }, 400, getSecurityHeaders());

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

      const riderData = {
        name: body.name.trim(),
        rider_type: body.rider_type,
        phone: body.phone?.trim() || null,
        email: body.email?.trim().toLowerCase() || null,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
      };

      const { data, error } = await db.from('riders').insert(riderData).select().single();
      if (error) return handleDbError(error);

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/riders/:id
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 3) {
      const riderId = Number(pathParts[2]);
      const body = await request.json().catch(() => null);
      if (!Number.isInteger(riderId) || !body)
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );

      if (body.rider_type !== undefined && !isValidRiderType(body.rider_type))
        return jsonResponse(
          { error: 'Le type doit être "owner", "club" ou "loaner"' },
          400,
          getSecurityHeaders()
        );
      if (body.email !== undefined && body.email && !validateEmail(body.email))
        return jsonResponse({ error: "Format d'email invalide" }, 400, getSecurityHeaders());
      if (body.phone !== undefined && body.phone && !validatePhone(body.phone))
        return jsonResponse({ error: 'Format de téléphone invalide' }, 400, getSecurityHeaders());

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

      const updateData = { updated_at: new Date().toISOString() };
      ['name', 'rider_type', 'phone', 'email', 'activity_start_date', 'activity_end_date'].forEach(
        (field) => {
          if (body[field] !== undefined)
            updateData[field] = body[field] !== null ? body[field].toString().trim() : null;
        }
      );

      const { data, error } = await db
        .from('riders')
        .update(updateData)
        .eq('id', riderId)
        .select()
        .single();
      if (error) return handleDbError(error);

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/riders/:id
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const riderId = Number(pathParts[2]);
      if (!Number.isInteger(riderId))
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { error } = await db
        .from('riders')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', riderId);
      if (error) return handleDbError(error);

      return jsonResponse({ message: 'Cavalier supprimé avec succès' }, 200, getSecurityHeaders());
    }

    return jsonResponse({ error: 'Route non trouvée' }, 404, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}

/**
 * GET /api/riders/:id/horses
 * ✅ CORRECTION: Ajout de tous les champs nécessaires du pairing
 */
export async function handleRiderHorses(request, env, riderId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000))
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());

  try {
    const riderIdNum = Number(riderId);
    if (!Number.isInteger(riderIdNum))
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    const { data, error } = await db
      .from('rider_horse_pairings')
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
        horses (
          id,
          name,
          kind,
          activity_start_date,
          activity_end_date,
          ownership_type
        )
      `
      )
      .eq('rider_id', riderIdNum)
      .order('pairing_start_date', { ascending: false });

    if (error) return handleDbError(error);

    return jsonResponse(data, 200, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}

/**
 * GET /api/riders/list
 * Route optimisée qui retourne tous les cavaliers avec leurs pairings actifs
 */
export async function handleRidersList(request, env) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    const today = new Date();

    // Récupérer tous les cavaliers
    const { data: riders, error: ridersError } = await db
      .from('riders')
      .select('*')
      .is('deleted_at', null)
      .order('name');

    if (ridersError) return handleDbError(ridersError);

    // Pour chaque cavalier, récupérer ses pairings actifs avec les infos des chevaux
    const ridersWithPairings = await Promise.all(
      riders.map(async (rider) => {
        // Récupérer tous les pairings du cavalier avec les données des chevaux
        const { data: pairings } = await db
          .from('rider_horse_pairings')
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
            horses (
              id,
              name,
              kind,
              activity_start_date,
              activity_end_date,
              ownership_type
            )
          `
          )
          .eq('rider_id', rider.id)
          .order('pairing_start_date', { ascending: false });

        // Filtrer les pairings actifs côté serveur
        const activePairings =
          pairings?.filter((pairing) => {
            // Vérifier si le pairing est actif
            const pairingActive =
              (!pairing.pairing_start_date || new Date(pairing.pairing_start_date) <= today) &&
              (!pairing.pairing_end_date || new Date(pairing.pairing_end_date) >= today);

            // Vérifier si le cheval est actif
            const horse = pairing.horses;
            const horseActive =
              horse &&
              (!horse.activity_start_date || new Date(horse.activity_start_date) <= today) &&
              (!horse.activity_end_date || new Date(horse.activity_end_date) >= today);

            return pairingActive && horseActive;
          }) || [];

        // Calculer les statistiques des packages
        const { data: packages } = await db
          .from('packages')
          .select('*')
          .eq('rider_id', rider.id)
          .eq('is_active', true);

        const activePackagesCount = packages?.length || 0;
        const servicesPerWeek =
          packages?.reduce((sum, pkg) => sum + (pkg.services_per_week || 0), 0) || 0;
        const groupLessonsPerWeek =
          packages?.reduce((sum, pkg) => sum + (pkg.group_lessons_per_week || 0), 0) || 0;

        return {
          ...rider,
          pairings: activePairings,
          active_horses_count: activePairings.length,
          active_packages_count: activePackagesCount,
          services_per_week: servicesPerWeek,
          group_lessons_per_week: groupLessonsPerWeek,
        };
      })
    );

    return jsonResponse(ridersWithPairings, 200, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error in handleRidersList:', error);
    return jsonResponse({ error: 'Erreur serveur interne' }, 500, getSecurityHeaders());
  }
}
