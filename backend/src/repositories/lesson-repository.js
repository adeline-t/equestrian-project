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
    // Handle participants based on lesson type
    let maxParticipants = data.max_participants;
    let minParticipants = data.min_participants;

    if (data.lesson_type === 'blocked') {
      maxParticipants = 0;
      minParticipants = 0;
    } else {
      // Only apply defaults for non-blocked lessons
      if (maxParticipants === undefined || maxParticipants === null) {
        maxParticipants = null;
      }
      if (minParticipants === undefined || minParticipants === null) {
        minParticipants = 1;
      }
    }

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
        max_participants: maxParticipants,
        min_participants: minParticipants,
        instructor_id: data.instructor_id || null,
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
    if (data.instructor_id !== undefined) updateData.instructor_id = data.instructor_id;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    // Handle participants - check for blocked type
    if (data.lesson_type === 'blocked') {
      updateData.max_participants = 0;
      updateData.min_participants = 0;
    } else {
      // Use !== undefined to allow 0 values
      if (data.max_participants !== undefined) updateData.max_participants = data.max_participants;
      if (data.min_participants !== undefined) updateData.min_participants = data.min_participants;
    }

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
        : { data: [] };

    const templateMap = templates.data
      ? templates.data.reduce((acc, t) => {
          acc[t.id] = t.name;
          return acc;
        }, {})
      : {};

    // Get participant counts
    const instanceIds = data.map((item) => item.id);
    const participantCounts = {};

    if (instanceIds.length > 0) {
      const { data: participantsData } = await this.db
        .from('lesson_participants')
        .select('lesson_instance_id')
        .in('lesson_instance_id', instanceIds);

      if (participantsData) {
        participantsData.forEach((p) => {
          participantCounts[p.lesson_instance_id] =
            (participantCounts[p.lesson_instance_id] || 0) + 1;
        });
      }
    }

    // Format the response to match expected structure
    const results = data.map((item) => ({
      ...item,
      template_name: templateMap[item.template_id] || null,
      participant_count: participantCounts[item.id] || 0,
    }));

    return { results };
  }

  /**
   * Récupérer une instance par ID
   */
  async findInstanceById(id, includeParticipants = true) {
    const { data, error } = await this.db
      .from('lesson_instances')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    // Get template name if needed
    if (data.template_id) {
      const { data: template } = await this.db
        .from('lesson_templates')
        .select('name')
        .eq('id', data.template_id)
        .maybeSingle();

      if (template) {
        data.template_name = template.name;
      }
    }

    // Get participants if requested
    if (includeParticipants) {
      const { data: participants } = await this.db
        .from('lesson_participants')
        .select('*')
        .eq('lesson_instance_id', id);

      data.lesson_participants = participants || [];
    }

    return data;
  }

  /**
   * Créer une nouvelle instance
   */
  async createInstance(data) {
    // Handle participants based on lesson type
    let maxParticipants = data.max_participants;
    let minParticipants = data.min_participants;

    if (data.lesson_type === 'blocked') {
      maxParticipants = 0;
      minParticipants = 0;
    } else {
      if (maxParticipants === undefined || maxParticipants === null) {
        maxParticipants = null;
      }
      if (minParticipants === undefined || minParticipants === null) {
        minParticipants = 1;
      }
    }

    const { data: result, error } = await this.db
      .from('lesson_instances')
      .insert({
        template_id: data.template_id || null,
        lesson_date: data.lesson_date,
        start_time: data.start_time,
        end_time: data.end_time,
        lesson_type: data.lesson_type,
        name: data.name || data.title, // Support both for backward compatibility
        description: data.description || null,
        max_participants: maxParticipants,
        min_participants: minParticipants,
        instructor_id: data.instructor_id || null,
        status: data.status || 'scheduled',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Add participants if provided (only for non-blocked lessons)
    if (data.lesson_type !== 'blocked' && data.participants && data.participants.length > 0) {
      for (const participant of data.participants) {
        await this.db.from('lesson_participants').insert({
          lesson_instance_id: result.id,
          rider_id: participant.rider_id,
          horse_id: participant.horse_id || null,
          participation_status:
            participant.status || participant.participation_status || 'registered',
          horse_assignment_type: participant.horse_assignment_type || 'auto',
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
    if (data.name !== undefined) updateData.name = data.name;
    if (data.title !== undefined) updateData.name = data.title; // Map title to name
    if (data.description !== undefined) updateData.description = data.description;
    if (data.instructor_id !== undefined) updateData.instructor_id = data.instructor_id;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.cancellation_reason !== undefined)
      updateData.cancellation_reason = data.cancellation_reason;
    if (data.not_given_by_laury !== undefined)
      updateData.not_given_by_laury = data.not_given_by_laury;
    if (data.not_given_reason !== undefined) updateData.not_given_reason = data.not_given_reason;
    if (data.is_modified !== undefined) updateData.is_modified = data.is_modified;
    if (data.modified_fields !== undefined) updateData.modified_fields = data.modified_fields;

    // Handle participants - check for blocked type
    if (data.lesson_type === 'blocked') {
      updateData.max_participants = 0;
      updateData.min_participants = 0;
    } else {
      // Use !== undefined to allow 0 values
      if (data.max_participants !== undefined) updateData.max_participants = data.max_participants;
      if (data.min_participants !== undefined) updateData.min_participants = data.min_participants;
    }

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
        participation_status:
          participantData.status || participantData.participation_status || 'registered',
        horse_assignment_type: participantData.horse_assignment_type || 'auto',
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
    if (data.status !== undefined) updateData.participation_status = data.status;
    if (data.participation_status !== undefined)
      updateData.participation_status = data.participation_status;
    if (data.horse_assignment_type !== undefined)
      updateData.horse_assignment_type = data.horse_assignment_type;
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
        riders:rider_id(id, first_name, last_name, email),
        horses:horse_id(id, name, breed, color)
      `
      )
      .eq('lesson_instance_id', instanceId);

    if (error) {
      throw error;
    }

    return data;
  }

  // ============================================
  // DEFAULT PARTICIPANTS
  // ============================================

  /**
   * Récupérer les participants par défaut d'un template
   */
  async findDefaultParticipantsByTemplateId(templateId) {
    const { data, error } = await this.db
      .from('template_default_participants')
      .select(
        `
        *,
        riders:rider_id(id, first_name, last_name, email),
        horses:horse_id(id, name, breed, color)
      `
      )
      .eq('template_id', templateId)
      .order('priority_order');

    if (error) {
      throw error;
    }

    return { results: data };
  }

  /**
   * Ajouter un participant par défaut à un template
   */
  async addDefaultParticipant(templateId, participantData) {
    const { data, error } = await this.db
      .from('template_default_participants')
      .insert({
        template_id: templateId,
        rider_id: participantData.rider_id,
        horse_id: participantData.horse_id || null,
        auto_assign_horse: participantData.auto_assign_horse !== false,
        priority_order: participantData.priority_order || 0,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Supprimer un participant par défaut d'un template
   */
  async removeDefaultParticipant(templateId, participantId) {
    const { error } = await this.db
      .from('template_default_participants')
      .delete()
      .eq('id', participantId)
      .eq('template_id', templateId);

    if (error) {
      throw error;
    }

    return true;
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

  /**
   * Marquer un cours comme non donné par Laury
   */
  async markLessonNotGiven(instanceId, reason = null) {
    const { data, error } = await this.db
      .from('lesson_instances')
      .update({
        not_given_by_laury: true,
        not_given_reason: reason,
        not_given_at: new Date().toISOString(),
      })
      .eq('id', instanceId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Vérifier les conflits avec les périodes bloquées
   */
  async checkBlockedPeriods(lessonDate, startTime, endTime, excludeInstanceId = null) {
    let query = this.db
      .from('lesson_instances')
      .select('id, name, start_time, end_time')
      .eq('lesson_type', 'blocked')
      .neq('status', 'cancelled')
      .eq('lesson_date', lessonDate);

    if (excludeInstanceId) {
      query = query.neq('id', excludeInstanceId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Filter for time overlaps
    const conflicts = data.filter((blocked) => {
      return blocked.start_time < endTime && blocked.end_time > startTime;
    });

    return conflicts;
  }

  /**
   * Vérifier les conflits avec d'autres cours (double-booking)
   */
  async checkLessonConflicts(lessonDate, startTime, endTime, excludeInstanceId = null) {
    let query = this.db
      .from('lesson_instances')
      .select('id, name, lesson_type, start_time, end_time, status')
      .in('lesson_type', ['private', 'group', 'training', 'competition', 'event'])
      .neq('status', 'cancelled')
      .eq('lesson_date', lessonDate);

    if (excludeInstanceId) {
      query = query.neq('id', excludeInstanceId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Filter for time overlaps
    const conflicts = data.filter((lesson) => {
      return lesson.start_time < endTime && lesson.end_time > startTime;
    });

    return conflicts;
  }

  /**
   * Vérifier tous les conflits (bloqués + double-booking)
   */
  async checkAllConflicts(lessonDate, startTime, endTime, excludeInstanceId = null) {
    const [blockedPeriods, lessonConflicts] = await Promise.all([
      this.checkBlockedPeriods(lessonDate, startTime, endTime, excludeInstanceId),
      this.checkLessonConflicts(lessonDate, startTime, endTime, excludeInstanceId)
    ]);

    return {
      blocked_periods: blockedPeriods,
      lesson_conflicts: lessonConflicts,
      has_conflicts: blockedPeriods.length > 0 || lessonConflicts.length > 0
    };
  }
}
