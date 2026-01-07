import React from 'react';
import { useTemplateManagement } from '../../../hooks/useTemplateManagement';
import TemplateModal from '../TemplateModal';
import TemplateFilters from './TemplateFilters';
import TemplatesTable from './TemplatesTable';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Icons } from '../../../lib/icons';
import '../../../styles/components/templates.css';

const TemplateManagement = () => {
  const {
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
    stats,

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
  } = useTemplateManagement();

  // Format templates for display
  const formattedTemplates = templates.map(formatTemplateInfo);

  return (
    <div className="template-management">
      <div className="card">
        <div className="flex-between mb-20">
          <h2>Gestion des Templates</h2>
          <button className="btn btn-primary" onClick={handleCreateTemplate}>
            <Icons.Add /> Nouveau Template
          </button>
        </div>

        <TemplateFilters filters={filters} onFilterChange={handleFilterChange} stats={stats} />

        {error && (
          <div className="error" style={{ marginBottom: '20px' }}>
            <Icons.Warning /> {error}
            <button className="btn btn-sm btn-secondary ml-10" onClick={clearError}>
              Effacer
            </button>
          </div>
        )}

        {successMessage && (
          <div className="success" style={{ marginBottom: '20px' }}>
            <Icons.Check /> {successMessage}
          </div>
        )}

        <TemplatesTable
          templates={formattedTemplates}
          onEdit={handleEditTemplate}
          onDelete={handleDeleteTemplate}
          loading={loading}
        />
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <TemplateModal
          template={null}
          onClose={closeCreateModal}
          onSuccess={handleTemplateSuccess}
        />
      )}

      {/* Edit Template Modal */}
      {showEditModal && selectedTemplate && (
        <TemplateModal
          template={selectedTemplate}
          onClose={closeEditModal}
          onSuccess={handleTemplateSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        templateName={selectedTemplate?.name}
      />
    </div>
  );
};

export default TemplateManagement;
