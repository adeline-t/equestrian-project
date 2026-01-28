import { getSecurityHeaders, jsonResponse, getDatabase } from '../../db.js';
import {
  handleDatabaseError,
  handleUnexpectedError,
  handleValidationError,
} from '../../utils/errorHandler.js';
import { format, startOfMonth } from 'date-fns';

/**
 * GET /api/stats/rider-billing?month=YYYY-MM
 * Returns monthly billing summary per rider with rider_type
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

    // Fetch billing data - use .eq() for exact match on month_start
    const { data: billing, error: billingError } = await db
      .from('rider_monthly_billing')
      .select('*')
      .eq('month_start', monthStart) // ← Changement ici
      .order('rider_id');

    if (billingError) return handleDatabaseError(billingError, 'riderBilling.fetch', env);

    // Extract unique rider IDs
    const riderIds = [...new Set((billing || []).map((b) => b.rider_id))];

    // Fetch rider types for these IDs
    const { data: riders, error: ridersError } = await db
      .from('riders')
      .select('id, rider_type')
      .in('id', riderIds);

    if (ridersError) return handleDatabaseError(ridersError, 'riderBilling.fetchRiders', env);

    // Create a lookup map
    const riderTypeMap = (riders || []).reduce((acc, rider) => {
      acc[rider.id] = rider.rider_type;
      return acc;
    }, {});

    // Enrich billing data with rider_type
    const enrichedBilling = (billing || []).map((bill) => ({
      ...bill,
      rider_type: riderTypeMap[bill.rider_id] || null,
    }));

    return jsonResponse(enrichedBilling, 200, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'riderBilling', env);
  }
}
