import { handleRiders, handleRiderHorses } from './handlers/riders.js';
import { handleHorses, handleHorseRiders } from './handlers/horses.js';
import { handleAssociations } from './handlers/associations.js';
import { jsonResponse, getSecurityHeaders } from './db.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Log request for debugging
    console.log(`${method} ${path} - ${new Date().toISOString()}`);

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          ...getSecurityHeaders()
        }
      });
    }

    // Route to appropriate handler
    try {
      // Riders routes
      if (path.match(/^\/api\/riders\/\d+\/horses$/)) {
        const riderId = path.split('/')[3];
        return handleRiderHorses(request, env, riderId);
      }
      if (path.startsWith('/api/riders')) {
        return handleRiders(request, env);
      }

      // Horses routes
      if (path.match(/^\/api\/horses\/\d+\/riders$/)) {
        const horseId = path.split('/')[3];
        return handleHorseRiders(request, env, horseId);
      }
      if (path.startsWith('/api/horses')) {
        return handleHorses(request, env);
      }

      // Associations routes
      if (path.startsWith('/api/associations')) {
        return handleAssociations(request, env);
      }

      // Health check
      if (path === '/api/health') {
        return jsonResponse({ 
          status: 'ok', 
          message: 'API opérationnelle',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }, 200, getSecurityHeaders());
      }

      // API documentation endpoint
      if (path === '/api/docs') {
        return jsonResponse({
          title: 'Equestrian Management API',
          version: '1.0.0',
          endpoints: {
            riders: {
              'GET /api/riders': 'List all riders',
              'GET /api/riders/:id': 'Get single rider',
              'POST /api/riders': 'Create rider',
              'PUT /api/riders/:id': 'Update rider',
              'DELETE /api/riders/:id': 'Delete rider',
              'GET /api/riders/:id/horses': 'Get horses for rider'
            },
            horses: {
              'GET /api/horses': 'List all horses',
              'GET /api/horses/:id': 'Get single horse',
              'POST /api/horses': 'Create horse',
              'PUT /api/horses/:id': 'Update horse',
              'DELETE /api/horses/:id': 'Delete horse',
              'GET /api/horses/:id/riders': 'Get riders for horse'
            },
            associations: {
              'GET /api/associations': 'List all associations',
              'GET /api/associations/:id': 'Get single association',
              'POST /api/associations': 'Create association',
              'PUT /api/associations/:id': 'Update association',
              'DELETE /api/associations/:id': 'Delete association'
            },
            utility: {
              'GET /api/health': 'Health check',
              'GET /api/docs': 'API documentation'
            }
          }
        }, 200, getSecurityHeaders());
      }

      // 404 - Route not found
      return jsonResponse({ 
        error: 'Route non trouvée',
        message: 'Utilisez /api/docs pour voir la documentation disponible',
        available_endpoints: ['/api/health', '/api/docs', '/api/riders', '/api/horses', '/api/associations']
      }, 404, getSecurityHeaders());

    } catch (error) {
      console.error('Unhandled error:', error);
      return jsonResponse({ 
        error: 'Erreur serveur interne',
        message: 'Une erreur inattendue est survenue',
        timestamp: new Date().toISOString()
      }, 500, getSecurityHeaders());
    }
  }
};