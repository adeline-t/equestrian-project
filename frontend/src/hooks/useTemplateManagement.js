import { useState, useEffect } from 'react';
import { templatesApi } from '../services/calendarApi';

/**
 * Custom hook for managing template data and operations
 * @returns {Object} Templates data, loading state, error, and handler functions
 */
export function useTemplateManagement() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState({
    active: 'all', // all, active, inactive
    lessonType: 'all',
  });

  // Load templates on component mount and filter changes
  useEffect(() => {
    loadTemplates();
  }, [filters]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const filterParams = {};

      if (filters.active !== 'all') {
        filterParams.active = filters.active === 'active';
      }
      if (filters.lessonType !== 'all') {
        filterParams.lessonType = filters.lessonType;
      }

      console.log('Loading templates with filters:', filterParams);

      const response = await templatesApi.getAll(filterParams);

      console.log('Templates loaded:', response);

      setTemplates(response.results || []);
    } catch (err) {
      console.error('Error loading templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setShowCreateModal(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setShowEditModal(true);
  };

  const handleDeleteTemplate = (template) => {
    setSelectedTemplate(template);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTemplate) return;

    try {
      await templatesApi.delete(selectedTemplate.id);
      setSuccessMessage('Template supprimé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowDeleteConfirm(false);
      setSelectedTemplate(null);
      loadTemplates();
    } catch (err) {
      setError('Erreur lors de la suppression du template');
      setShowDeleteConfirm(false);
      setSelectedTemplate(null);
    }
  };

  const handleTemplateSuccess = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedTemplate(null);
    loadTemplates();
    setSuccessMessage(
      selectedTemplate ? 'Template modifié avec succès' : 'Template créé avec succès'
    );
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedTemplate(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedTemplate(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteConfirm(false);
    setSelectedTemplate(null);
  };

  const clearSuccessMessage = () => setSuccessMessage('');
  const clearError = () => setError(null);

  // Helper functions
  const getFilteredStats = () => {
    return {
      total: templates.length,
      active: templates.filter(t => t.is_active).length,
      inactive: templates.filter(t => !t.is_active).length,
    };
  };

  const formatTemplateInfo = (template) => {
    const lessonTypeLabels = {
      private: 'Particulier',
      group: 'Collectif',
      training: 'Stage',
      competition: 'Concours',
      event: 'Événement',
      blocked: 'Bloqué',
    };

    return {
      ...template,
      lessonTypeLabel: lessonTypeLabels[template.lesson_type] || template.lesson_type,
      isActiveLabel: template.is_active ? 'Actif' : 'Inactif',
    };
  };

  return {
    // State
    templates,
    loading,
    error,
    showCreateModal,
    showEditModal,
    showDeleteConfirm,
    selectedTemplate,
    successMessage,
    filters,
    stats: getFilteredStats(),

    // Actions
    handleCreateTemplate,
    handleEditTemplate,
    handleDeleteTemplate,
    handleConfirmDelete,
    handleTemplateSuccess,
    handleFilterChange,
    
    // Modal handlers
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
    
    // Utility functions
    formatTemplateInfo,
    
    // State setters
    clearSuccessMessage,
    clearError,
  };
}