import { getDatabase, jsonResponse, getSecurityHeaders } from '../../db.js';
import {
  handleDatabaseError,
  handleUnexpectedError,
  handleValidationError,
} from '../../utils/errorHandler.js';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  format,
} from 'date-fns';

/**
 * GET /api/stats/weekly?month=YYYY-MM
 * Returns weekly usage per rider (services / private lessons / extras)
 * Simplified version using rider_usage_weekly view
 */
export async function handleRiderUsageWeekly(request, env) {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Méthode non autorisée' }, 405, getSecurityHeaders());
  }

  const url = new URL(request.url);
  const monthParam = url.searchParams.get('month');
  if (!monthParam || !/^\d{4}-\d{2}$/.test(monthParam)) {
    return handleValidationError(
      'Paramètre "month" requis au format YYYY-MM',
      'riderWeeklyUsage.validate',
      { month: monthParam },
      env
    );
  }

  const db = getDatabase(env);

  try {
    const monthDate = new Date(`${monthParam}-01`);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // Determine weeks for the month (including partial weeks)
    const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const weeks = eachWeekOfInterval(
      { start: firstWeekStart, end: lastWeekEnd },
      { weekStartsOn: 1 }
    );

    // Fetch data from the view
    const { data: weeklyUsage, error: usageError } = await db
      .from('rider_usage_weekly')
      .select('*')
      .gte('week_start', format(firstWeekStart, 'yyyy-MM-dd'))
      .lte('week_start', format(lastWeekEnd, 'yyyy-MM-dd'));

    if (usageError) return handleDatabaseError(usageError, 'riderWeeklyUsage.fetch', env);

    // Group by rider
    const ridersMap = {};
    weeklyUsage.forEach((row) => {
      if (!ridersMap[row.rider_id]) {
        ridersMap[row.rider_id] = {
          riderId: row.rider_id,
          riderName: row.rider_name,
          servicesPerWeek: row.services_per_week,
          privateLessonsPerWeek: row.private_lessons_per_week,
          weeks: [],
        };
      }
      ridersMap[row.rider_id].weeks.push({
        weekStart: format(row.week_start, 'yyyy-MM-dd'),
        servicesConsumed: Number(row.services_consumed),
        privateLessonsConsumed: Number(row.private_lessons_consumed),
        competitionExtras: Number(row.competition_extras),
        specialExtras: Number(row.special_extras),
        remainingServices: Number(row.remaining_services),
        extraServices: Number(row.extra_services),
      });
    });

    const activeRiders = Object.values(ridersMap);

    return jsonResponse(activeRiders, 200, getSecurityHeaders());
  } catch (err) {
    return handleUnexpectedError(err, 'riderWeeklyUsage', env);
  }
}
