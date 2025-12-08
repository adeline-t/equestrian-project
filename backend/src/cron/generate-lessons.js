/**
 * Cron job pour générer automatiquement les cours à venir
 * À exécuter quotidiennement pour maintenir une fenêtre de 4 semaines
 */

import { getDatabase } from '../db.js';
import { generateUpcomingInstances } from '../services/lesson-generator.js';
import { LessonRepository } from '../repositories/lesson-repository.js';

/**
 * Handler pour le cron trigger Cloudflare
 */
export async function scheduledGenerateLessons(env) {
  console.log('Starting scheduled lesson generation...');

  try {
    const db = getDatabase(env);
    const lessonRepo = new LessonRepository(db);
    
    // Générer les cours pour les 4 prochaines semaines avec vérification des conflits
    const results = await generateUpcomingInstances(4, db);

    const totalGenerated = results.reduce((sum, r) => sum + (r.generated || 0), 0);
    const totalSkipped = results.reduce((sum, r) => sum + (r.skipped || 0), 0);
    const errors = results.filter((r) => r.error);

    // Vérifier les conflits pour les cours générés
    const conflictCheckResults = [];
    for (const result of results) {
      if (result.instances && result.instances.length > 0) {
        for (const instance of result.instances) {
          try {
            const conflicts = await lessonRepo.checkAllConflicts(
              instance.lesson_date,
              instance.start_time,
              instance.end_time
            );
            
            if (conflicts.has_conflicts) {
              conflictCheckResults.push({
                instance_id: instance.id,
                lesson_name: instance.name,
                conflicts: conflicts,
                lesson_date: instance.lesson_date,
                start_time: instance.start_time
              });
              
              console.warn(`Conflict detected for generated lesson ${instance.name} on ${instance.lesson_date}:`, conflicts);
            }
          } catch (error) {
            console.error(`Error checking conflicts for instance ${instance.id}:`, error);
          }
        }
      }
    }

    console.log(`Lesson generation completed:
            - Generated: ${totalGenerated}
            - Skipped: ${totalSkipped}
            - Errors: ${errors.length}
            - Conflicts: ${conflictCheckResults.length}
        `);

    if (errors.length > 0) {
      console.error('Errors during generation:', errors);
    }

    if (conflictCheckResults.length > 0) {
      console.warn('Conflicts detected in generated lessons:', conflictCheckResults);
    }

    return {
      success: true,
      generated: totalGenerated,
      skipped: totalSkipped,
      errors: errors.length,
      conflicts: conflictCheckResults.length,
      timestamp: new Date().toISOString(),
      conflict_details: conflictCheckResults.slice(0, 10), // Limiter à 10 détails
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
