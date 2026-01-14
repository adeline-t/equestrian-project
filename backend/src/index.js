import { handleRiders, handleRiderHorses } from './handlers/riders.js';
import { handleHorses, handleHorseRiders } from './handlers/horses.js';
import { handlePairings } from './handlers/pairings.js';
import { handlePackages, handleRiderPackages } from './handlers/packages.js';
import { handleCalendar } from './handlers/calendar.js';
import { jsonResponse, getSecurityHeaders } from './db.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`${method} ${path} - ${new Date().toISOString()}`);

    // CORS preflight
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
      // Calendar routes (lessons)
      // -----------------------
      if (path.startsWith('/api/calendar/lessons')) {
        return handleCalendar(request, env);
      }

      // -----------------------
      // Calendar routes (slots)
      // -----------------------
      if (path.startsWith('/api/calendar/slots')) {
        return jsonResponse(
          {
            error: 'Not yet implemented',
            message: error.message,
            timestamp: new Date().toISOString(),
          },
          404
        );
      }

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
            features: ['riders', 'horses', 'pairings', 'packages', 'calendar', 'slots'],
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
              calendar: {
                'GET /api/calendar/lessons': 'List lessons',
                'POST /api/calendar/lessons': 'Create lesson',
                'GET /api/calendar/lessons/:id': 'Get lesson details',
                'PUT /api/calendar/lessons/:id': 'Update lesson',
                'DELETE /api/calendar/lessons/:id': 'Cancel lesson',
                'POST /api/calendar/lessons/:id/mark-not-given':
                  'Mark lesson as not given by Laury',
                'GET /api/calendar/schedule/week': 'Get week schedule',
                'GET /api/calendar/schedule/blocked-periods': 'Get blocked periods',
                'GET /api/calendar/schedule/not-given': 'Get lessons not given',
                'GET /api/calendar/slots': 'List all planning slots',
                'POST /api/calendar/slots': 'Create planning slot',
                'GET /api/calendar/slots/:id': 'Get planning slot details',
                'PUT /api/calendar/slots/:id': 'Update planning slot',
                'DELETE /api/calendar/slots/:id': 'Delete planning slot',
              },
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
};
