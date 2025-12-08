import React, { useState, useEffect } from 'react';
import { templatesApi } from '../../services/calendarApi';
import TemplateModal from '../calendar/TemplateModal';
import './TemplateManagement.css';

const TemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filters, setFilters] = useState({
    active: true,
    lessonType: 'all',
  });

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, [filters]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      if (filters.active !== 'all') {
        filterParams.active = filters.active === 'active';
      }
      if (filters.lessonType !== 'all') {
        filterParams.lessonType = filters.lessonType;
      }

      const response = await templatesApi.getAll(filterParams);
      setTemplates(response.results || []);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setShowCreateModal(true);
  };

  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowEditModal(true);
  };

  const handleDelete = (template) => {
    setSelectedTemplate(template);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await templatesApi.delete(selectedTemplate.id);
      setShowDeleteConfirm(false);
      loadTemplates();
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete template');
    }
  };

  const handleToggleActive = async (template) => {
    try {
      await templatesApi.update(template.id, { is_active: !template.is_active });
      loadTemplates();
    } catch (err) {
      console.error('Error toggling template:', err);
      setError('Failed to update template');
    }
  };

  const getLessonTypeLabel = (type) => {
    const types = {
      private: 'Cours particulier',
      group: 'Cours collectif',
      training: 'Stage',
      competition: 'Concours',
      event: 'Événement',
      blocked: 'Plage bloquée',
    };
    return types[type] || type;
  };

  const getLessonTypeColor = (type) => {
    const colors = {
      private: '#4CAF50',
      group: '#2196F3',
      training: '#FF9800',
      competition: '#9C27B0',
      event: '#607D8B',
      blocked: '#F44336',
    };
    return colors[type] || '#666';
  };

  const formatRecurrenceRule = (rule) => {
    if (!rule) return 'Non défini';

    let desc = '';
    if (rule.frequency === 'weekly') {
      desc = rule.interval === 1 ? 'Chaque semaine' : `Toutes les ${rule.interval} semaines`;
      if (rule.byDay && rule.byDay.length > 0) {
        const days = {
          monday: 'Lun',
          tuesday: 'Mar',
          wednesday: 'Mer',
          thursday: 'Jeu',
          friday: 'Ven',
          saturday: 'Sam',
          sunday: 'Dim',
        };
        desc += ` : ${rule.byDay.map((d) => days[d.toLowerCase()] || d).join(', ')}`;
      }
    } else if (rule.frequency === 'daily') {
      desc = rule.interval === 1 ? 'Chaque jour' : `Tous les ${rule.interval} jours`;
    } else if (rule.frequency === 'monthly') {
      desc = rule.interval === 1 ? 'Chaque mois' : `Tous les ${rule.interval} mois`;
    }

    return desc;
  };

  if (loading) {
    return (
      <div className="template-management">
        <div className="loading">Chargement des templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="template-management">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadTemplates}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="template-management">
      <div className="template-header">
        <h1>Gestion des Templates de Cours</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          <i className="icon-plus"></i>
          Nouveau Template
        </button>
      </div>

      <div className="template-filters">
        <div className="filter-group">
          <label>Statut:</label>
          <select
            value={filters.active}
            onChange={(e) => setFilters({ ...filters, active: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Type:</label>
          <select
            value={filters.lessonType}
            onChange={(e) => setFilters({ ...filters, lessonType: e.target.value })}
          >
            <option value="all">Tous</option>
            <option value="private">Cours particulier</option>
            <option value="group">Cours collectif</option>
            <option value="training">Stage</option>
            <option value="competition">Concours</option>
            <option value="event">Événement</option>
            <option value="blocked">Plage bloquée</option>
          </select>
        </div>
      </div>

      <div className="template-list">
        {templates.length === 0 ? (
          <div className="empty-state">
            <p>Aucun template trouvé</p>
            <button className="btn btn-primary" onClick={handleCreate}>
              Créer le premier template
            </button>
          </div>
        ) : (
          templates.map((template) => (
            <div
              key={template.id}
              className={`template-card ${!template.is_active ? 'inactive' : ''}`}
            >
              <div className="template-header">
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <span
                    className="lesson-type-badge"
                    style={{ backgroundColor: getLessonTypeColor(template.lesson_type) }}
                  >
                    {getLessonTypeLabel(template.lesson_type)}
                  </span>
                  {!template.is_active && <span className="status-badge inactive">Inactif</span>}
                </div>
                <div className="template-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleEdit(template)}
                    title="Modifier"
                  >
                    <i className="icon-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleToggleActive(template)}
                    title={template.is_active ? 'Désactiver' : 'Activer'}
                  >
                    <i className={template.is_active ? 'icon-pause' : 'icon-play'}></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(template)}
                    title="Supprimer"
                  >
                    <i className="icon-trash"></i>
                  </button>
                </div>
              </div>

              {template.description && (
                <p className="template-description">{template.description}</p>
              )}

              <div className="template-details">
                <div className="detail-item">
                  <label>Horaire:</label>
                  <span>
                    {template.start_time} ({template.duration_minutes} min)
                  </span>
                </div>
                <div className="detail-item">
                  <label>Récurrence:</label>
                  <span>{formatRecurrenceRule(template.recurrence_rule)}</span>
                </div>
                <div className="detail-item">
                  <label>Validité:</label>
                  <span>
                    {new Date(template.valid_from).toLocaleDateString('fr-FR')}
                    {template.valid_until &&
                      ` - ${new Date(template.valid_until).toLocaleDateString('fr-FR')}`}
                  </span>
                </div>
                {(template.max_participants || template.min_participants) && (
                  <div className="detail-item">
                    <label>Participants:</label>
                    <span>
                      {template.min_participants}
                      {template.max_participants && ` - ${template.max_participants}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals will be imported from the existing calendar components */}
      {showCreateModal && (
        <TemplateModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={loadTemplates}
        />
      )}

      {showEditModal && selectedTemplate && (
        <TemplateModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={loadTemplates}
          template={selectedTemplate}
        />
      )}

      {showDeleteConfirm && selectedTemplate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirmer la suppression</h3>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>
                <i className="icon-close"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Êtes-vous sûr de vouloir supprimer le template "{selectedTemplate.name}" ?</p>
              <p className="warning">Cette action est irréversible.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Annuler
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateManagement;
