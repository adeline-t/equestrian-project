/**
 * Repository pour la gestion des cours et du calendrier
 * Compatible avec Supabase
 */
export class LessonRepository {
  constructor(db) {
    this.db = db;
  }

  // ============================================
  // TEMPLATES
  // ============================================

  /**
   * Récupérer tous les templates avec filtres
   */
  async findTemplates(filters = {}) {
    let query = this.db.from('lesson_templates').select('*');

    if (filters.active !== undefined) {
      query = query.eq('is_active', filters.active);
    }

    if (filters.lessonType) {
      query = query.eq('lesson_type', filters.lessonType);
    }

    if (filters.excludeBlocked) {
      query = query.neq('lesson_type', 'blocked');
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { results: data };
  }

  /**
   * Récupérer un template par ID
   */
  async findTemplateById(id) {
    const { data, error } = await this.db
      .from('lesson_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Créer un nouveau template
   */
  async createTemplate(data) {
    const { data: result, error } = await this.db
      .from('lesson_templates')
      .insert({
        name: data.name,
        description: data.description || null,
        lesson_type: data.lesson_type,
        recurrence_rule: data.recurrence_rule,
        start_time: data.start_time,
        duration_minutes: data.duration_minutes,
        valid_from: data.valid_from,
        valid_until: data.valid_until || null,
        max_participants: data.max_participants || null,
        min_participants: data.min_participants || 1,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result;
  }

  /**
   * Mettre à jour un template
   */
  async updateTemplate(id, data) {
    const updateData = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.lesson_type !== undefined) updateData.lesson_type = data.lesson_type;
    if (data.recurrence_rule !== undefined) updateData.recurrence_rule = data.recurrence_rule;
    if (data.start_time !== undefined) updateData.start_time = data.start_time;
    if (data.duration_minutes !== undefined) updateData.duration_minutes = data.duration_minutes;
    if (data.valid_from !== undefined) updateData.valid_from = data.valid_from;
    if (data.valid_until !== undefined) updateData.valid_until = data.valid_until;
    if (data.max_participants !== undefined) updateData.max_participants = data.max_participants;
    if (data.min_participants !== undefined) updateData.min_participants = data.min_participants;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    const { data: result, error } = await this.db
      .from('lesson_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result;
  }

  /**
   * Supprimer un template
   */
  async deleteTemplate(id) {
    const { error } = await this.db.from('lesson_templates').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  }

  // ============================================
  // INSTANCES
  // ============================================

  /**
   * Récupérer les instances dans une plage de dates
   */
  async findInstancesByDateRange(startDate, endDate, filters = {}) {
    // Since Supabase doesn't support complex joins with counts easily,
    // we'll do a simpler query and then fetch participants separately if needed
    let query = this.db
      .from('lesson_instances')
      .select('*')
      .gte('lesson_date', startDate)
      .lte('lesson_date', endDate);

    if (filters.lessonType) {
      query = query.eq('lesson_type', filters.lessonType);
    }

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.excludeBlocked) {
      query = query.neq('lesson_type', 'blocked');
    }

    const { data, error } = await query.order('lesson_date, start_time');

    if (error) {
      throw error;
    }

    // Get template names if needed
    const templateIds = [...new Set(data.map((item) => item.template_id).filter(Boolean))];
    const templates =
      templateIds.length > 0
        ? await this.db.from('lesson_templates').select('id, name').in('id', templateIds)
        : [];

    const templateMap = templates.data
      ? templates.data.reduce((acc, t) => {
          acc[t.id] = t.name;
          return acc;
        }, {})
      : {};

    // Format the response to match expected structure
    const results = data.map((item) => ({
      ...item,
      template_name: templateMap[item.template_id] || null,
      participant_count: 0, // Will be updated if participants are included
    }));

    return { results };
  }

  /**
   * Récupérer une instance par ID
   */
  async findInstanceById(id, includeParticipants = true) {
    let query = this.db.from('lesson_instances').select('*').eq('id', id);

    if (includeParticipants) {
      query = query.select(`
                *,
                lesson_participants(*)
            `);
    }

    const { data, error } = await query.single();

    if (error) {
      throw error;
    }

    // Get template name if needed
    if (data.template_id) {
      const { data: template } = await this.db
        .from('lesson_templates')
        .select('name')
        .eq('id', data.template_id)
        .single();

      if (template) {
        data.template_name = template.name;
      }
    }

    return data;
  }

  /**
   * Créer une nouvelle instance
   */
  async createInstance(data) {
    const { data: result, error } = await this.db
      .from('lesson_instances')
      .insert({
        template_id: data.template_id || null,
        lesson_date: data.lesson_date,
        start_time: data.start_time,
        end_time: data.end_time,
        lesson_type: data.lesson_type,
        title: data.title,
        description: data.description || null,
        max_participants: data.max_participants || null,
        min_participants: data.min_participants || 1,
        location: data.location || null,
        instructor_id: data.instructor_id || null,
        status: data.status || 'scheduled',
        is_blocker: data.is_blocker || false,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add participants if provided
    if (data.participants && data.participants.length > 0) {
      for (const participant of data.participants) {
        await this.db.from('lesson_participants').insert({
          lesson_instance_id: result.id,
          rider_id: participant.rider_id,
          horse_id: participant.horse_id || null,
          status: participant.status || 'registered',
          notes: participant.notes || null,
        });
      }
    }

    return result;
  }

  /**
   * Mettre à jour une instance
   */
  async updateInstance(id, data) {
    const updateData = {};

    if (data.lesson_date !== undefined) updateData.lesson_date = data.lesson_date;
    if (data.start_time !== undefined) updateData.start_time = data.start_time;
    if (data.end_time !== undefined) updateData.end_time = data.end_time;
    if (data.lesson_type !== undefined) updateData.lesson_type = data.lesson_type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.max_participants !== undefined) updateData.max_participants = data.max_participants;
    if (data.min_participants !== undefined) updateData.min_participants = data.min_participants;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.instructor_id !== undefined) updateData.instructor_id = data.instructor_id;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.is_blocker !== undefined) updateData.is_blocker = data.is_blocker;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.cancellation_reason !== undefined)
      updateData.cancellation_reason = data.cancellation_reason;
    if (data.not_given_reason !== undefined) updateData.not_given_reason = data.not_given_reason;

    const { data: result, error } = await this.db
      .from('lesson_instances')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result;
  }

  /**
   * Supprimer une instance
   */
  async deleteInstance(id) {
    const { error } = await this.db.from('lesson_instances').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  }

  // ============================================
  // PARTICIPANTS
  // ============================================

  /**
   * Ajouter un participant à une instance
   */
  async addParticipant(instanceId, participantData) {
    const { data, error } = await this.db
      .from('lesson_participants')
      .insert({
        lesson_instance_id: instanceId,
        rider_id: participantData.rider_id,
        horse_id: participantData.horse_id || null,
        status: participantData.status || 'registered',
        notes: participantData.notes || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Mettre à jour un participant
   */
  async updateParticipant(instanceId, participantId, data) {
    const updateData = {};

    if (data.rider_id !== undefined) updateData.rider_id = data.rider_id;
    if (data.horse_id !== undefined) updateData.horse_id = data.horse_id;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const { data: result, error } = await this.db
      .from('lesson_participants')
      .update(updateData)
      .eq('id', participantId)
      .eq('lesson_instance_id', instanceId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return result;
  }

  /**
   * Supprimer un participant
   */
  async removeParticipant(instanceId, participantId) {
    const { error } = await this.db
      .from('lesson_participants')
      .delete()
      .eq('id', participantId)
      .eq('lesson_instance_id', instanceId);

    if (error) {
      throw error;
    }

    return true;
  }

  /**
   * Récupérer les participants d'une instance
   */
  async getInstanceParticipants(instanceId) {
    const { data, error } = await this.db
      .from('lesson_participants')
      .select(
        `
                *,
                riders(id, first_name, last_name, email),
                horses(id, name, breed, color)
            `
      )
      .eq('lesson_instance_id', instanceId);

    if (error) {
      throw error;
    }

    return data;
  }

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * Obtenir des statistiques sur les leçons
   */
  async getLessonStats(startDate, endDate) {
    // Get all lessons in date range
    const { data: lessons, error: lessonsError } = await this.db
      .from('lesson_instances')
      .select('status, lesson_type')
      .gte('lesson_date', startDate)
      .lte('lesson_date', endDate);

    if (lessonsError) {
      throw lessonsError;
    }

    // Count by status
    const statusCounts = lessons.reduce((acc, lesson) => {
      acc[lesson.status] = (acc[lesson.status] || 0) + 1;
      return acc;
    }, {});

    // Count by type
    const typeCounts = lessons.reduce((acc, lesson) => {
      acc[lesson.lesson_type] = (acc[lesson.lesson_type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: lessons.length,
      by_status: statusCounts,
      by_type: typeCounts,
    };
  }
}
