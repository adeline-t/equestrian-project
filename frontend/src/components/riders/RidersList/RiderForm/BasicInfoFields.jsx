import React from 'react';

const BasicInfoFields = ({ formData, onChange, error }) => {
  return (
    <div className="form-section">
      <h3>Informations générales</h3>
      
      <div className="form-group">
        <label htmlFor="name">Nom complet *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          className={`form-input ${error && !formData.name.trim() ? 'error' : ''}`}
          placeholder="Entrez le nom complet du cavalier"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`form-input ${error && !formData.email.trim() ? 'error' : ''}`}
          placeholder="cavalier@exemple.com"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Téléphone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className="form-input"
          placeholder="06 12 34 56 78"
        />
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginTop: '16px' }}>
          <strong>Erreur:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default BasicInfoFields;