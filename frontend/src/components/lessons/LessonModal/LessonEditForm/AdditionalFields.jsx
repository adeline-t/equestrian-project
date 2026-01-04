import React from 'react';

const AdditionalFields = ({ formData, handleChange }) => {
  return (
    <>
      {/* Description */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          className="form-control"
          placeholder="Entrez la description de la leçon"
        />
      </div>

      {/* Lesson Options */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          Options de la leçon
        </label>

        <div className="form-check" style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            name="option_double"
            checked={formData.option_double || false}
            onChange={handleChange}
            className="form-check-input"
            style={{ marginRight: '8px', transform: 'translateY(2px)' }}
          />
          <label className="form-check-label" style={{ fontSize: '14px' }}>
            Leçon double (45 min)
          </label>
        </div>

        <div className="form-check" style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            name="option_sdj"
            checked={formData.option_sdj || false}
            onChange={handleChange}
            className="form-check-input"
            style={{ marginRight: '8px', transform: 'translateY(2px)' }}
          />
          <label className="form-check-label" style={{ fontSize: '14px' }}>
            Stage découverte jeunes (SDJ)
          </label>
        </div>
      </div>

      {/* Instructor Status */}
      <div className="form-group" style={{ marginBottom: '15px' }}>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>
          Statut de l'instructeur
        </label>

        <div className="form-check" style={{ marginBottom: '8px' }}>
          <input
            type="checkbox"
            name="cours_non_donne_par_laury"
            checked={formData.cours_non_donne_par_laury || false}
            onChange={handleChange}
            className="form-check-input"
            style={{ marginRight: '8px', transform: 'translateY(2px)' }}
          />
          <label className="form-check-label" style={{ fontSize: '14px' }}>
            Cours non donné par Laury
          </label>
        </div>
      </div>
    </>
  );
};

export default AdditionalFields;
