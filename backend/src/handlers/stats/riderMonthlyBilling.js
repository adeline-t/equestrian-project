import { getSecurityHeaders, jsonResponse, getDatabase } from '../../db.js';
import {
  handleDatabaseError,
  handleUnexpectedError,
  handleValidationError,
} from '../../utils/errorHandler.js';
import { format, startOfMonth, endOfMonth } from 'date-fns';

/**
 * GET /api/stats/rider-billing?month=YYYY-MM
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
      .gte('month_start', monthStart)
      .lte('month_start', monthEnd)
      .order('rider_id');

    if (billingError) return handleDatabaseError(billingError, 'riderBilling.fetch', env);

    return jsonResponse(billing || [], 200, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'riderBilling', env);
  }
}
