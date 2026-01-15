import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';
import { usePackageForm } from '../../hooks/usePackageForm.js';

/**
 * PackageForm - Version complète, préremplie et minimale
 * Props:
 *  - initialPackage : objet du forfait à éditer (ou null pour création)
 *  - riderId : id du cavalier
 *  - onSubmit : fonction (riderId, packageData) => Promise
 *  - onCancel : fonction pour fermer/annuler
 */
function PackageForm({ initialPackage = null, riderId, onSubmit, onCancel }) {
  const { formData, error, submitting, handleChange, handleSubmit } = usePackageForm(
    initialPackage,
    riderId,
    onSubmit
  );

  const isEdit = !!initialPackage;

  return (
    <form onSubmit={handleSubmit} className="form-group" noValidate>
      {error && (
        <div
          className="alert alert-error"
          style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}
        >
          <Icons.Warning />
          <span>{error}</span>
        </div>
      )}

      <div
        className="form-row"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <label
            htmlFor="services_per_week"
            style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}
          >
            Services / semaine
          </label>
          <input
            type="number"
            id="services_per_week"
            name="services_per_week"
            value={formData.services_per_week}
            onChange={handleChange}
            min="0"
            step="1"
            disabled={submitting}
            style={{ width: '100%', padding: '8px', fontSize: '16px', textAlign: 'center' }}
            required
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="group_lessons_per_week"
            style={{ display: 'block', marginBottom: '6px', fontWeight: 500 }}
          >
            Cours collectifs / semaine
          </label>
          <input
            type="number"
            id="group_lessons_per_week"
            name="group_lessons_per_week"
            value={formData.group_lessons_per_week}
            onChange={handleChange}
            min="0"
            step="1"
            disabled={submitting}
            style={{ width: '100%', padding: '8px', fontSize: '16px', textAlign: 'center' }}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? (
            <>
              <Icons.Loading className="spin" />
              <span style={{ marginLeft: 8 }}>Enregistrement...</span>
            </>
          ) : (
            <>{isEdit ? 'Modifier' : 'Créer'}</>
          )}
        </button>
      </div>
    </form>
  );
}

PackageForm.propTypes = {
  initialPackage: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    services_per_week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    group_lessons_per_week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    is_active: PropTypes.bool,
  }),
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSubmit: PropTypes.func.isRequired, // signature: (riderId, packageData) => Promise
  onCancel: PropTypes.func.isRequired,
};

export default PackageForm;
