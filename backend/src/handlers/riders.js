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

const RIDER_KINDS = ['owner', 'club', 'boarder'];

const isValidRiderKind = (kind) => RIDER_KINDS.includes(kind);

/**
 * /api/riders
 */
export async function handleRiders(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  // Handle OPTIONS for CORS
  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    /**
     * GET /api/riders
     */
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data: riders, error: ridersError } = await db
        .from('riders')
        .select('*')
        .order('name');

      if (ridersError) return handleDbError(ridersError);

      const today = new Date();

      const ridersWithCounts = await Promise.all(
        riders.map(async (rider) => {
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

          const { data: packages } = await db.from('packages').select('*').eq('rider_id', rider.id);

          let activePackagesCount = 0;
          let privateLessonsCount = 0;
          let jointLessonsCount = 0;

          packages?.forEach((pkg) => {
            const active =
              (!pkg.activity_start_date || new Date(pkg.activity_start_date) <= today) &&
              (!pkg.activity_end_date || new Date(pkg.activity_end_date) >= today);

            if (active) {
              activePackagesCount++;
              privateLessonsCount += pkg.private_lesson_count || 0;
              jointLessonsCount += pkg.joint_lesson_count || 0;
            }
          });

          return {
            ...rider,
            active_horses_count: activeHorsesCount,
            active_packages_count: activePackagesCount,
            private_lessons_count: privateLessonsCount,
            joint_lessons_count: jointLessonsCount,
          };
        })
      );

      return jsonResponse(ridersWithCounts, 200, getSecurityHeaders());
    }

    /**
     * GET /api/riders/:id
     */
    if (request.method === 'GET' && pathParts.length === 3) {
      const riderId = Number(pathParts[2]);
      if (!Number.isInteger(riderId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { data, error } = await db.from('riders').select('*').eq('id', riderId).single();

      if (error) return handleDbError(error);

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    /**
     * POST /api/riders
     */
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body) {
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());
      }

      const missingFields = validateRequired(['name', 'kind'], body);
      if (missingFields) {
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );
      }

      if (!isValidRiderKind(body.kind)) {
        return jsonResponse(
          { error: 'Le type doit être "owner", "club" ou "boarder"' },
          400,
          getSecurityHeaders()
        );
      }

      if (body.email && !validateEmail(body.email)) {
        return jsonResponse({ error: "Format d'email invalide" }, 400, getSecurityHeaders());
      }

      if (body.phone && !validatePhone(body.phone)) {
        return jsonResponse({ error: 'Format de téléphone invalide' }, 400, getSecurityHeaders());
      }

      const riderData = {
        name: body.name.trim(),
        kind: body.kind,
        phone: body.phone?.trim() || null,
        email: body.email?.trim().toLowerCase() || null,
        activity_start_date: body.activity_start_date || null,
        activity_end_date: body.activity_end_date || null,
      };

      const { data, error } = await db.from('riders').insert(riderData).select().single();

      if (error) return handleDbError(error);

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    /**
     * PUT /api/riders/:id
     */
    if (request.method === 'PUT' && pathParts.length === 3) {
      const riderId = Number(pathParts[2]);
      const body = await request.json().catch(() => null);

      if (!Number.isInteger(riderId) || !body) {
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );
      }

      // Validate kind if provided
      if (body.kind !== undefined && !isValidRiderKind(body.kind)) {
        return jsonResponse(
          { error: 'Le type doit être "owner", "club" ou "boarder"' },
          400,
          getSecurityHeaders()
        );
      }

      if (body.email !== undefined && body.email && !validateEmail(body.email)) {
        return jsonResponse({ error: "Format d'email invalide" }, 400, getSecurityHeaders());
      }

      if (body.phone !== undefined && body.phone && !validatePhone(body.phone)) {
        return jsonResponse({ error: 'Format de téléphone invalide' }, 400, getSecurityHeaders());
      }

      // Build update data - only include fields that are present in body
      const updateData = {
        updated_at: new Date().toISOString(),
      };

      if (body.name !== undefined) {
        updateData.name = body.name.trim();
      }

      if (body.kind !== undefined) {
        updateData.kind = body.kind;
      }

      if (body.phone !== undefined) {
        updateData.phone = body.phone ? body.phone.trim() : null;
      }

      if (body.email !== undefined) {
        updateData.email = body.email ? body.email.trim().toLowerCase() : null;
      }

      if (body.activity_start_date !== undefined) {
        updateData.activity_start_date = body.activity_start_date || null;
      }

      if (body.activity_end_date !== undefined) {
        updateData.activity_end_date = body.activity_end_date || null;
      }

      const { data, error } = await db
        .from('riders')
        .update(updateData)
        .eq('id', riderId)
        .select()
        .single();

      if (error) {
        console.error('❌ Database error:', error);
        return handleDbError(error);
      }

      console.log('✅ Updated rider:', JSON.stringify(data, null, 2));
      return jsonResponse(data, 200, getSecurityHeaders());
    }

    /**
     * DELETE /api/riders/:id
     */
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const riderId = Number(pathParts[2]);
      if (!Number.isInteger(riderId)) {
        return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
      }

      const { error } = await db.from('riders').delete().eq('id', riderId);
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
 */
export async function handleRiderHorses(request, env, riderId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  try {
    const riderIdNum = Number(riderId);
    if (!Number.isInteger(riderIdNum)) {
      return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());
    }

    const { data, error } = await db
      .from('rider_horse_pairings')
      .select(
        `
        id,
        pairing_start_date,
        pairing_end_date,
        horses (
          id,
          name,
          kind,
          activity_start_date,
          activity_end_date
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
