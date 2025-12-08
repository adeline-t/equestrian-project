/**
 * Cron job pour générer automatiquement les cours à venir
 * À exécuter quotidiennement pour maintenir une fenêtre de 4 semaines
 */

import { getDatabase } from '../db.js';
import { generateUpcomingInstances } from '../services/lesson-generator.js';

/**
 * Handler pour le cron trigger Cloudflare
 */
export async function scheduledGenerateLessons(env) {
  console.log('Starting scheduled lesson generation...');

  try {
    const db = getDatabase(env);
    // Générer les cours pour les 4 prochaines semaines
    const results = await generateUpcomingInstances(4, db);

    const totalGenerated = results.reduce((sum, r) => sum + (r.generated || 0), 0);
    const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);
    const errors = results.filter((r) => r.error);

    console.log(`Lesson generation completed:
            - Generated: ${totalGenerated}
            - Skipped: ${totalSkipped}
            - Errors: ${errors.length}
        `);

    if (errors.length > 0) {
      console.error('Errors during generation:', errors);
    }

    return {
      success: true,
      generated: totalGenerated,
      skipped: totalSkipped,
      errors: errors.length,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Fatal error during lesson generation:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}
