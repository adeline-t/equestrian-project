import {
  getDatabase,
  handleDbError,
  jsonResponse,
  validateRequired,
  checkRateLimit,
  getSecurityHeaders,
} from '../db.js';

/**
 * /api/packages
 */
export async function handlePackages(request, env) {
  const db = getDatabase(env);
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting
  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  if (request.method === 'OPTIONS') {
    return jsonResponse({}, 204, getSecurityHeaders());
  }

  try {
    // -----------------------------
    // GET /api/packages - List all active (non-deleted) packages
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 2) {
      const { data, error } = await db
        .from('packages')
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          rider_id,
          created_at,
          updated_at,
          deleted_at
        `
        )
        .is('deleted_at', null)
        .order('id', { ascending: true });

      if (error) return handleDbError(error);

      const activeData = data.filter((pkg) => !pkg.riders?.deleted_at);

      return jsonResponse(activeData, 200, getSecurityHeaders());
    }

    // -----------------------------
    // GET /api/packages/:id - Single package
    // -----------------------------
    if (request.method === 'GET' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      const { data, error } = await db
        .from('packages')
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          rider_id,
          created_at,
          updated_at,
          deleted_at
        `
        )
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (error) return handleDbError(error);
      if (!data || data.riders?.deleted_at)
        return jsonResponse({ error: 'Package non trouvé' }, 404, getSecurityHeaders());

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // POST /api/packages - Create package
    // -----------------------------
    if (request.method === 'POST' && pathParts.length === 2) {
      const body = await request.json().catch(() => null);
      if (!body)
        return jsonResponse({ error: 'Corps de requête invalide' }, 400, getSecurityHeaders());

      const requiredFields = ['services_per_week', 'group_lessons_per_week', 'rider_id'];
      const missingFields = validateRequired(requiredFields, body);
      if (missingFields)
        return jsonResponse(
          { error: `Champs requis: ${missingFields}` },
          400,
          getSecurityHeaders()
        );

      const riderId = parseInt(body.rider_id);
      if (isNaN(riderId))
        return jsonResponse({ error: 'rider_id invalide' }, 400, getSecurityHeaders());

      // Check if rider exists and is not deleted
      const { data: rider, error: riderError } = await db
        .from('riders')
        .select('id')
        .eq('id', riderId)
        .is('deleted_at', null)
        .single();

      if (riderError || !rider)
        return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());

      const isActive = body.is_active !== undefined ? Boolean(body.is_active) : true;

      // ✅ SOLUTION ROBUSTE : Si on crée un package actif,
      // on SOFT DELETE tous les packages actifs existants
      // (évite les problèmes de séquence causés par le hard delete)
      if (isActive) {
        console.log(`[CLEANUP] Deactivating all active packages for rider ${riderId}...`);

        // Récupérer TOUS les packages actifs (sans filtre deleted_at)
        const { data: existingPackages, error: fetchError } = await db
          .from('packages')
          .select('id, is_active, deleted_at')
          .eq('rider_id', riderId)
          .eq('is_active', true);

        if (fetchError) {
          console.error('[CLEANUP] Error fetching existing packages:', fetchError);
        } else if (existingPackages && existingPackages.length > 0) {
          console.log(`[CLEANUP] Found ${existingPackages.length} active package(s) to deactivate`);

          // SOFT DELETE : désactiver et marquer comme supprimé
          const idsToUpdate = existingPackages.map((pkg) => pkg.id);
          const { error: updateError } = await db
            .from('packages')
            .update({
              is_active: false,
              deleted_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .in('id', idsToUpdate);

          if (updateError) {
            console.error('[CLEANUP] Error deactivating existing packages:', updateError);
          } else {
            console.log(`[CLEANUP] Successfully deactivated ${idsToUpdate.length} package(s)`);
          }
        } else {
          console.log('[CLEANUP] No active packages found, proceeding with insert');
        }
      }

      const packageData = {
        services_per_week: parseInt(body.services_per_week),
        group_lessons_per_week: parseInt(body.group_lessons_per_week),
        rider_id: riderId,
        is_active: isActive,
      };

      const { data, error } = await db
        .from('packages')
        .insert(packageData)
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          rider_id,
          created_at,
          updated_at,
          deleted_at
        `
        )
        .single();

      if (error) {
        console.error('[INSERT] Error inserting package:', error);

        // Erreur de séquence (ID dupliqué)
        if (error.code === '23505' && error.message.includes('packages_pkey')) {
          return jsonResponse(
            {
              error: 'SEQUENCE_ERROR',
              message:
                "Erreur de séquence d'ID. Exécutez la commande SQL suivante puis réessayez : SELECT setval('packages_id_seq', (SELECT COALESCE(MAX(id), 0) FROM packages) + 1, false);",
              details: error.message,
            },
            409,
            getSecurityHeaders()
          );
        }

        // Erreur de contrainte unique (package actif existant)
        if (error.code === '23505') {
          return jsonResponse(
            {
              error: 'ACTIVE_PACKAGE_EXISTS',
              message:
                "Impossible de créer le forfait. Un conflit de contrainte unique s'est produit. Veuillez réessayer.",
            },
            409,
            getSecurityHeaders()
          );
        }

        return handleDbError(error);
      }

      return jsonResponse(data, 201, getSecurityHeaders());
    }

    // -----------------------------
    // PUT /api/packages/:id - Update package
    // -----------------------------
    if (request.method === 'PUT' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      const body = await request.json().catch(() => null);
      if (isNaN(id) || !body)
        return jsonResponse(
          { error: 'ID ou corps de requête invalide' },
          400,
          getSecurityHeaders()
        );

      const { data: currentPackage, error: fetchError } = await db
        .from('packages')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (fetchError) return handleDbError(fetchError);
      if (!currentPackage)
        return jsonResponse({ error: 'Package non trouvé' }, 404, getSecurityHeaders());

      // Validate rider if updating
      let riderId = currentPackage.rider_id;
      if (body.rider_id !== undefined) {
        riderId = parseInt(body.rider_id);
        if (isNaN(riderId))
          return jsonResponse({ error: 'rider_id invalide' }, 400, getSecurityHeaders());
        const { data: rider, error: riderError } = await db
          .from('riders')
          .select('id')
          .eq('id', riderId)
          .is('deleted_at', null)
          .single();
        if (riderError || !rider)
          return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());
      }

      const willBeActive =
        body.is_active !== undefined ? Boolean(body.is_active) : currentPackage.is_active;

      const wasInactive = !currentPackage.is_active;

      // ✅ Si on passe de inactif à actif, soft delete tous les autres packages actifs
      if (willBeActive && wasInactive) {
        const { data: existingPackages, error: fetchError } = await db
          .from('packages')
          .select('id, is_active, deleted_at')
          .eq('rider_id', riderId)
          .eq('is_active', true)
          .neq('id', id);

        if (fetchError) {
          console.error('Error fetching existing packages:', fetchError);
        } else if (existingPackages && existingPackages.length > 0) {
          const idsToUpdate = existingPackages.map((pkg) => pkg.id);
          const { error: updateError } = await db
            .from('packages')
            .update({
              is_active: false,
              deleted_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .in('id', idsToUpdate);

          if (updateError) {
            console.error('Error deactivating existing packages:', updateError);
          } else {
            console.log(
              `Deactivated ${idsToUpdate.length} existing package(s) for rider ${riderId}`
            );
          }
        }
      }

      const updateData = {
        services_per_week:
          body.services_per_week !== undefined
            ? parseInt(body.services_per_week)
            : currentPackage.services_per_week,
        group_lessons_per_week:
          body.group_lessons_per_week !== undefined
            ? parseInt(body.group_lessons_per_week)
            : currentPackage.group_lessons_per_week,
        is_active: willBeActive,
        rider_id,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await db
        .from('packages')
        .update(updateData)
        .eq('id', id)
        .select(
          `
          id,
          services_per_week,
          group_lessons_per_week,
          is_active,
          rider_id,
          created_at,
          updated_at,
          deleted_at
        `
        )
        .single();

      if (error) {
        // Erreur de séquence (ID dupliqué)
        if (error.code === '23505' && error.message.includes('packages_pkey')) {
          return jsonResponse(
            {
              error: 'SEQUENCE_ERROR',
              message:
                "Erreur de séquence d'ID. Exécutez : SELECT setval('packages_id_seq', (SELECT COALESCE(MAX(id), 0) FROM packages) + 1, false);",
            },
            409,
            getSecurityHeaders()
          );
        }

        // Erreur de contrainte unique
        if (error.code === '23505') {
          return jsonResponse(
            {
              error: 'ACTIVE_PACKAGE_EXISTS',
              message:
                "Impossible de modifier le forfait. Un conflit de contrainte unique s'est produit. Veuillez réessayer.",
            },
            409,
            getSecurityHeaders()
          );
        }

        return handleDbError(error);
      }

      return jsonResponse(data, 200, getSecurityHeaders());
    }

    // -----------------------------
    // DELETE /api/packages/:id - Soft delete
    // -----------------------------
    if (request.method === 'DELETE' && pathParts.length === 3) {
      const id = parseInt(pathParts[2]);
      if (isNaN(id)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

      // Vérifier que le package existe et n'est pas déjà supprimé
      const { data: currentPackage, error: fetchError } = await db
        .from('packages')
        .select('id, rider_id, is_active')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

      if (fetchError) return handleDbError(fetchError);
      if (!currentPackage)
        return jsonResponse({ error: 'Package non trouvé' }, 404, getSecurityHeaders());

      // ✅ Soft delete: mettre deleted_at et is_active à false
      const { data, error } = await db
        .from('packages')
        .update({
          deleted_at: new Date().toISOString(),
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select('id, rider_id, deleted_at, is_active')
        .single();

      if (error) return handleDbError(error);

      return jsonResponse(
        {
          message: 'Package supprimé avec succès',
          package: data,
        },
        200,
        getSecurityHeaders()
      );
    }

    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  } catch (error) {
    console.error('Error in handlePackages:', error);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: error.message },
      500,
      getSecurityHeaders()
    );
  }
}

/**
 * GET /api/riders/:id/packages - Get all packages for a rider
 */
export async function handleRiderPackages(request, env, riderId) {
  const db = getDatabase(env);
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';

  if (!checkRateLimit(clientIP, 60, 60000)) {
    return jsonResponse({ error: 'Trop de requêtes' }, 429, getSecurityHeaders());
  }

  try {
    const riderIdNum = parseInt(riderId);
    if (isNaN(riderIdNum)) return jsonResponse({ error: 'ID invalide' }, 400, getSecurityHeaders());

    // Check rider exists and is not deleted
    const { data: rider, error: riderError } = await db
      .from('riders')
      .select('id')
      .eq('id', riderIdNum)
      .is('deleted_at', null)
      .single();
    if (riderError || !rider)
      return jsonResponse({ error: 'Cavalier non trouvé' }, 404, getSecurityHeaders());

    const { data, error } = await db
      .from('packages')
      .select(
        `
        id,
        services_per_week,
        group_lessons_per_week,
        is_active,
        rider_id,
        created_at,
        updated_at,
        deleted_at
      `
      )
      .eq('rider_id', riderIdNum)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) return handleDbError(error);
    return jsonResponse(data, 200, getSecurityHeaders());
  } catch (error) {
    console.error('Unexpected error in handleRiderPackages:', error);
    return jsonResponse(
      { error: 'Erreur serveur interne', message: error.message },
      500,
      getSecurityHeaders()
    );
  }
}
