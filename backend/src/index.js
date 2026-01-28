import { runRecurrenceCron } from './crons/cron.js';
import { getSecurityHeaders, jsonResponse } from './db.js';
import { runBillingCron } from './crons/cronBillingRefresh.js';

// Riders & Horses
import { handleRiderHorses, handleRiders, handleRidersList } from './handlers/riders.js';
import { handleHorseRiders, handleHorses } from './handlers/horses.js';
import { handlePackages, handleRiderPackages } from './handlers/packages.js';
import { handlePairings } from './handlers/pairings.js';
import { handleRiderMonthlyBilling } from './handlers/stats/riderMonthlyBilling.js';
import { handleHorseStats, handleRiderStats, handleMonthlyStats } from './handlers/stats/stats.js';
import { handleRiderUsageWeekly } from './handlers/stats/riderWeeklyUsage.js';

// Calendar modular
import { handleCalendarWeek } from './handlers/calendar/week.js';
import { handlePlanningSlots } from './handlers/calendar/slots.js';
import { handleEvents } from './handlers/calendar/events.js';
import { handleEventParticipants } from './handlers/calendar/participants.js';
import { handleRecurrences } from './handlers/calendar/recurrences.js';
import { handleSlotStats } from './handlers/stats/slotMonthlyStats.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`${method} ${path} - ${new Date().toISOString()}`);

    // -----------------------
    // CORS preflight
    // -----------------------
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
          'Access-Control-Max-Age': '86400',
          ...getSecurityHeaders(),
        },
      });
    }

    try {
      // -----------------------
      // Riders routes
      // -----------------------
      if (path === '/api/riders/list' && request.method === 'GET') {
        return handleRidersList(request, env);
      }
      if (path.match(/^\/api\/riders\/\d+\/horses$/)) {
        const riderId = path.split('/')[3];
        return handleRiderHorses(request, env, riderId);
      }
      if (path.match(/^\/api\/riders\/\d+\/packages$/)) {
        const riderId = path.split('/')[3];
        return handleRiderPackages(request, env, riderId);
      }
      if (path.startsWith('/api/riders')) {
        return handleRiders(request, env);
      }

      // -----------------------
      // Horses routes
      // -----------------------
      if (path.match(/^\/api\/horses\/\d+\/riders$/)) {
        const horseId = path.split('/')[3];
        return handleHorseRiders(request, env, horseId);
      }
      if (path.startsWith('/api/horses')) {
        return handleHorses(request, env);
      }

      // -----------------------
      // Pairings routes
      // -----------------------
      if (path.startsWith('/api/pairings')) {
        return handlePairings(request, env);
      }

      // -----------------------
      // Packages routes
      // -----------------------
      if (path.startsWith('/api/packages')) {
        return handlePackages(request, env);
      }

      // -----------------------
      // Rider Monthly Billing
      // -----------------------
      if (path.startsWith('/api/stats/rider-billing')) {
        return handleRiderMonthlyBilling(request, env);
      }

      // -----------------------
      // Calendar Stats routes
      // -----------------------
      if (path.startsWith('/api/stats/monthly')) {
        return handleMonthlyStats(request, env);
      }
      if (path.startsWith('/api/stats/horses')) {
        return handleHorseStats(request, env);
      }
      if (path.startsWith('/api/stats/riders')) {
        return handleRiderStats(request, env);
      }
      if (path.startsWith('/api/stats/weekly')) {
        return handleRiderUsageWeekly(request, env);
      }
      if (path.startsWith('/api/stats/slots')) {
        return handleSlotStats(request, env);
      }

      // -----------------------
      // Calendar routes (modular)
      // -----------------------
      if (path.startsWith('/api/calendar/week')) return handleCalendarWeek(request, env);

      // Scheduled events route
      if (path === '/api/calendar/slots/scheduled') {
        return handlePlanningSlots(request, env, null);
      }

      // Full details route before general slots
      if (path.match(/^\/api\/calendar\/slots\/\d+\/cancel$/)) {
        const slotId = path.split('/')[4];
        return handlePlanningSlots(request, env, slotId);
      }

      if (path.match(/^\/api\/calendar\/slots\/\d+\/full-details$/)) {
        const slotId = path.split('/')[4];
        return handlePlanningSlots(request, env, slotId);
      }

      if (path.startsWith('/api/calendar/slots'))
        return handlePlanningSlots(request, env, path.split('/')[4]);

      if (path.startsWith('/api/calendar/events'))
        return handleEvents(request, env, path.split('/')[4]);
      if (path.startsWith('/api/calendar/participants'))
        return handleEventParticipants(request, env, path.split('/')[4]);
      if (path.startsWith('/api/calendar/recurrences'))
        return handleRecurrences(request, env, path.split('/')[4]);

      // -----------------------
      // Health check
      // -----------------------
      if (['/api/health', '/api', '/api/'].includes(path)) {
        return jsonResponse(
          {
            status: 'ok',
            message: 'API opérationnelle',
            timestamp: new Date().toISOString(),
            version: '1.4.0',
            environment: env.ENVIRONMENT || 'unknown',
          },
          200
        );
      }

      // -----------------------
      // 404 - Route not found
      // -----------------------
      return jsonResponse(
        {
          error: 'Route non trouvée',
          message: 'Utilisez /api/docs pour voir la documentation disponible',
        },
        404
      );
    } catch (error) {
      console.error('Unhandled error:', error);
      return jsonResponse(
        {
          error: 'Erreur serveur interne',
          message: error.message,
          timestamp: new Date().toISOString(),
        },
        500
      );
    }
  },

  // -----------------------
  // Cron tasks
  // -----------------------
  async scheduled(event, env, ctx) {
    await runRecurrenceCron(env);
    await runBillingCron(env);
  },
};
