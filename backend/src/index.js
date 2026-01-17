import { runRecurrenceCron } from './cron';
import { getSecurityHeaders, jsonResponse } from './db.js';
import {
  handleCalendar,
  handleLessonParticipants,
  handlePlanningSlots,
} from './handlers/calendar.js';
import { handleHorseRiders, handleHorses } from './handlers/horses.js';
import { handlePackages, handleRiderPackages } from './handlers/packages.js';
import { handlePairings } from './handlers/pairings.js';
import { handleRecurrences } from './handlers/recurrences.js';
import { handleRiderHorses, handleRiders } from './handlers/riders.js';

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
      // Calendar routes
      // -----------------------
      if (path.startsWith('/api/calendar/lessons/participants')) {
        return handleLessonParticipants(request, env, path.split('/').filter(Boolean));
      }
      if (path.startsWith('/api/calendar/lessons')) {
        return handleCalendar(request, env);
      }
      if (path.startsWith('/api/calendar/slots')) {
        return handlePlanningSlots(request, env);
      }
      if (path.startsWith('/api/calendar/recurrences')) {
        return handleRecurrences(request, env);
      }

      // -----------------------
      // Health check
      // -----------------------
      if (['/api/health', '/api', '/api/'].includes(path)) {
        return jsonResponse(
          {
            status: 'ok',
            message: 'API opérationnelle',
            timestamp: new Date().toISOString(),
            version: '1.2.0',
            environment: env.ENVIRONMENT || 'unknown',
            features: [
              'riders',
              'horses',
              'pairings',
              'packages',
              'calendar',
              'slots',
              'recurrences',
            ],
          },
          200
        );
      }

      // -----------------------
      // API documentation
      // -----------------------
      if (path === '/api/docs') {
        return jsonResponse(
          {
            title: 'Equestrian Management API',
            version: '1.2.0',
            endpoints: {
              riders: {
                'GET /api/riders': 'List all riders',
                'GET /api/riders/:id': 'Get single rider',
                'POST /api/riders': 'Create rider',
                'PUT /api/riders/:id': 'Update rider',
                'DELETE /api/riders/:id': 'Delete rider',
                'GET /api/riders/:id/horses': 'Get horses for rider',
                'GET /api/riders/:id/packages': 'Get packages for rider',
              },
              horses: {
                'GET /api/horses': 'List all horses',
                'GET /api/horses/:id': 'Get single horse',
                'POST /api/horses': 'Create horse',
                'PUT /api/horses/:id': 'Update horse',
                'DELETE /api/horses/:id': 'Delete horse',
                'GET /api/horses/:id/riders': 'Get riders for horse',
              },
              pairings: {
                'GET /api/pairings': 'List all pairings',
                'GET /api/pairings/:id': 'Get single pairing',
                'POST /api/pairings': 'Create pairing',
                'PUT /api/pairings/:id': 'Update pairing',
                'DELETE /api/pairings/:id': 'Delete pairing',
              },
              packages: {
                'GET /api/packages': 'List all packages (with rider info)',
                'GET /api/packages/:id': 'Get single package (with rider info)',
                'POST /api/packages': 'Create package (requires rider_id)',
                'PUT /api/packages/:id': 'Update package',
                'DELETE /api/packages/:id': 'Delete package',
              },
              calendar: {
                'GET /api/calendar/lessons': 'List all lessons',
                'GET /api/calendar/lessons/:id': 'Get single lesson',
                'POST /api/calendar/lessons': 'Create lesson',
                'PUT /api/calendar/lessons/:id': 'Update lesson',
                'DELETE /api/calendar/lessons/:id': 'Soft delete lesson',
                'GET /api/calendar/lessons/participants/:lesson_id':
                  'Get participants for a lesson',
                'POST /api/calendar/lessons/participants': 'Add participant',
                'PUT /api/calendar/lessons/participants/:id': 'Update participant',
                'DELETE /api/calendar/lessons/participants/:id': 'Soft delete participant',
                'GET /api/calendar/slots': 'List all planning slots',
                'POST /api/calendar/slots': 'Create planning slot',
                'PUT /api/calendar/slots/:id': 'Update planning slot',
                'DELETE /api/calendar/slots/:id': 'Delete planning slot',
                'GET /api/calendar/recurrences': 'List all recurrences',
                'GET /api/calendar/recurrences/:id': 'Get single recurrence',
                'POST /api/calendar/recurrences': 'Create recurrence',
                'PUT /api/calendar/recurrences/:id': 'Update recurrence',
                'DELETE /api/calendar/recurrences/:id': 'Delete recurrence',
              },
              utility: {
                'GET /api/health': 'Health check',
                'GET /api/docs': 'API documentation',
              },
            },
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
          available_endpoints: [
            '/api/health',
            '/api/docs',
            '/api/riders',
            '/api/horses',
            '/api/pairings',
            '/api/packages',
            '/api/calendar/lessons',
            '/api/calendar/slots',
            '/api/calendar/recurrences',
          ],
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
  async scheduled(event, env, ctx) {
    await runRecurrenceCron(env);
  },
};
