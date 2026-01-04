import React from 'react';
import { Icons } from '../../../../lib/libraries/icons.jsx';
import BasicInfoFields from './BasicInfoFields.jsx';
import StatusFields from './StatusFields.jsx';
import SpecialFields from './SpecialFields.jsx';
import AdditionalFields from './AdditionalFields.jsx';

/**
 * Lesson Edit Form Component - Refactored into modular sections
 */
const LessonEditForm = ({
  editFormData,
  editError,
  lessonData,
  handleEditChange,
  handleTypeChange,
}) => {
  return (
    <div className="edit-form">
      {/* Error Display */}
      {editError && (
        <div className="alert alert-error" style={{ marginBottom: '15px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          {editError}
        </div>
      )}

      {/* Template Warning */}
      {lessonData.template_id && (
        <div className="alert alert-warning" style={{ marginBottom: '15px' }}>
          <Icons.Warning style={{ marginRight: '8px' }} />
          Ce cours provient d'un template. Les modifications ne s'appliqueront qu'à cette instance
          spécifique et n'affecteront pas le template ni les autres cours.
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {/* Basic Information Fields */}
        <BasicInfoFields
          editFormData={editFormData}
          lessonData={lessonData}
          handleEditChange={handleEditChange}
          handleTypeChange={handleTypeChange}
        />

        {/* Status Fields */}
        <StatusFields
          editFormData={editFormData}
          lessonData={lessonData}
          handleEditChange={handleEditChange}
        />

        {/* Special Fields (Not Given by Laury) */}
        <SpecialFields editFormData={editFormData} handleEditChange={handleEditChange} />

        {/* Additional Fields */}
        <AdditionalFields editFormData={editFormData} handleEditChange={handleEditChange} />
      </form>
    </div>
  );
};

export default LessonEditForm;
