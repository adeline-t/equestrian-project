import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../../utils/icons';

function PackagePreview({ formData, selectedRider }) {
  if (
    !formData.rider_id &&
    formData.private_lesson_count === 0 &&
    formData.joint_lesson_count === 0
  ) {
    return null;
  }

  return (
    <div className="form-group">
      <div
        style={{
          padding: '16px',
          background: '#f7fafc',
          borderRadius: '8px',
          border: '2px solid #e2e8f0',
        }}
      >
        <h4
          style={{
            margin: '0 0 12px 0',
            color: '#4a5568',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Icons.Info />
          Aperçu du forfait
        </h4>
        {selectedRider && (
          <p
            style={{
              margin: '4px 0',
              color: '#2d3748',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Icons.User style={{ color: '#4299e1' }} />
            Pour: <strong>{selectedRider.name}</strong>
          </p>
        )}
        {formData.private_lesson_count > 0 && (
          <p
            style={{
              margin: '8px 0 4px 24px',
              color: '#718096',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Icons.PrivateLesson style={{ fontSize: '0.875rem' }} />
            <strong>{formData.private_lesson_count}</strong> cours privé(s) par semaine
          </p>
        )}
        {formData.joint_lesson_count > 0 && (
          <p
            style={{
              margin: '4px 0 4px 24px',
              color: '#718096',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Icons.GroupLesson style={{ fontSize: '0.875rem' }} />
            <strong>{formData.joint_lesson_count}</strong> cours collectif(s) par semaine
          </p>
        )}
        {formData.activity_start_date && (
          <p
            style={{
              margin: '8px 0 0 24px',
              color: '#718096',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Icons.Calendar style={{ fontSize: '0.875rem' }} />
            Depuis: {formData.activity_start_date}
            {formData.activity_end_date && ` → ${formData.activity_end_date}`}
          </p>
        )}
      </div>
    </div>
  );
}

PackagePreview.propTypes = {
  formData: PropTypes.shape({
    rider_id: PropTypes.string,
    private_lesson_count: PropTypes.number,
    joint_lesson_count: PropTypes.number,
    activity_start_date: PropTypes.string,
    activity_end_date: PropTypes.string,
  }).isRequired,
  selectedRider: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default PackagePreview;