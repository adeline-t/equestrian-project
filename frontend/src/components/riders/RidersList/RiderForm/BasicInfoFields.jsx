import React from 'react';
import { Icons } from '../../../../lib/icons';
import { RIDER_KIND_LABELS } from '../../../../lib/domains/riders/kinds';

const BasicInfoFields = ({ formData, onChange, errors = {} }) => (
  <div className="form-section">
    <h3>Informations générales</h3>

    <div className="form-group">
      <label htmlFor="name">
        Nom complet <span className="required">*</span>
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={onChange}
        className={`form-input ${errors.name ? 'error' : ''}`}
        placeholder="Entrez le nom complet du cavalier"
      />
      {errors.name && (
        <span className="error-message">
          <Icons.Warning style={{ marginRight: '4px', fontSize: '12px' }} />
          {errors.name}
        </span>
      )}
    </div>

    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        className={`form-input ${errors.email ? 'error' : ''}`}
        placeholder="cavalier@exemple.com"
      />
      {errors.email && (
        <span className="error-message">
          <Icons.Warning style={{ marginRight: '4px', fontSize: '12px' }} />
          {errors.email}
        </span>
      )}
    </div>

    <div className="form-group">
      <label htmlFor="phone">Téléphone</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        className={`form-input ${errors.phone ? 'error' : ''}`}
        placeholder="06 12 34 56 78"
      />
      {errors.phone && (
        <span className="error-message">
          <Icons.Warning style={{ marginRight: '4px', fontSize: '12px' }} />
          {errors.phone}
        </span>
      )}
    </div>

    <div className="form-group">
      <label htmlFor="kind">
        Type de cavalier <span className="required">*</span>
      </label>
      <select
        id="kind"
        name="kind"
        value={formData.kind}
        onChange={onChange}
        className={`form-input ${errors.kind ? 'error' : ''}`}
      >
        {Object.values(RIDER_KIND_LABELS).map((k) => (
          <option key={k.value} value={k.value}>
            {k.label}
          </option>
        ))}
      </select>
      {errors.kind && (
        <span className="error-message">
          <Icons.Warning style={{ marginRight: '4px', fontSize: '12px' }} />
          {errors.kind}
        </span>
      )}
    </div>
  </div>
);

export default BasicInfoFields;
