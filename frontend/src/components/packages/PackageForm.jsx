import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/Modal.jsx';
import { Icons } from '../../lib/libraries/icons.jsx';
import { usePackageForm } from '../../hooks/usePackageForm.js';
import '../../styles/common/forms.css';
import '../../styles/common/alerts.css';
import '../../styles/common/buttons.css';
import '../../styles/components/packages.css';

function PackageForm({
  package: packageData = null,
  riders = [],
  riderId = null,
  onSubmit,
  onCancel,
}) {
  const { formData, error, submitting, handleChange, handleSubmit } = usePackageForm(
    packageData,
    riderId,
    onSubmit
  );

  const selectedRider = riders?.find((r) => r.id === parseInt(formData.rider_id));
  const isEdit = !!packageData;

  // Create a ref to the form so we can submit it from the footer button
  const formRef = React.useRef(null);

  const handleFooterSubmit = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  const footer = (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={submitting}>
        <Icons.Cancel />
        Annuler
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleFooterSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Icons.Loading className="spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Icons.Save />
            {isEdit ? 'Mettre à jour' : 'Créer'} le forfait
          </>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isEdit ? (
            <>
              <Icons.Edit />
              Modifier le forfait
            </>
          ) : (
            <>
              <Icons.Add />
              Nouveau forfait
            </>
          )}
        </div>
      }
      size="medium"
      footer={footer}
    >
      <form ref={formRef} onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '20px' }}>
            <Icons.Warning style={{ marginRight: '8px' }} />
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="rider_id">
            Cavalier <span className="required">*</span>
          </label>
          <select
            id="rider_id"
            name="rider_id"
            value={formData.rider_id}
            onChange={handleChange}
            disabled={submitting || !!riderId}
            className="form-select"
            required
          >
            <option value="">Sélectionner un cavalier</option>
            {riders?.map((rider) => (
              <option key={rider.id} value={rider.id}>
                {rider.name} {rider.email && `(${rider.email})`}
              </option>
            ))}
          </select>
          {riderId && <small className="form-help">Le cavalier est pré-sélectionné</small>}
        </div>

        <div className="form-group">
          <label htmlFor="private_lesson_count">Nombre de cours particuliers par semaine</label>
          <input
            type="number"
            id="private_lesson_count"
            name="private_lesson_count"
            value={formData.private_lesson_count}
            onChange={handleChange}
            min="0"
            step="1"
            disabled={submitting}
            className="form-input"
          />
          <small className="form-help">Cours individuels (1 cavalier)</small>
        </div>

        <div className="form-group">
          <label htmlFor="joint_lesson_count">
            Nombre de cours collectifs ou prestations par semaine
          </label>
          <input
            type="number"
            id="joint_lesson_count"
            name="joint_lesson_count"
            value={formData.joint_lesson_count}
            onChange={handleChange}
            min="0"
            step="1"
            disabled={submitting}
            className="form-input"
          />
          <small className="form-help">Cours en groupe (plusieurs cavaliers)</small>
        </div>

        <div className="form-group">
          <label htmlFor="activity_start_date">Date de début</label>
          <input
            type="date"
            id="activity_start_date"
            name="activity_start_date"
            value={formData.activity_start_date}
            onChange={handleChange}
            max={formData.activity_end_date || undefined}
            disabled={submitting}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="activity_end_date">Date de fin</label>
          <input
            type="date"
            id="activity_end_date"
            name="activity_end_date"
            value={formData.activity_end_date}
            onChange={handleChange}
            min={formData.activity_start_date || undefined}
            disabled={submitting}
            className="form-input"
          />
          <small className="form-help">Laissez vide si le forfait est toujours actif</small>
        </div>
      </form>
    </Modal>
  );
}

PackageForm.propTypes = {
  package: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rider_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    private_lesson_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    joint_lesson_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    activity_start_date: PropTypes.string,
    activity_end_date: PropTypes.string,
  }),
  riders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string,
    })
  ),
  riderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PackageForm;
