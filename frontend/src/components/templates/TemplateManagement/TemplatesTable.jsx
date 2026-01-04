import React from 'react';
import { Icons } from '../../../lib/libraries/icons';

const TemplatesTable = ({ 
  templates, 
  onEdit, 
  onDelete, 
  loading 
}) => {
  if (loading) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
        <Icons.Loading className="spin" style={{ fontSize: '32px', marginBottom: '12px' }} />
        <p>Chargement des templates...</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
        <Icons.Calendar style={{ fontSize: '48px', marginBottom: '12px', color: '#ccc' }} />
        <h3>Aucun template trouvé</h3>
        <p>Commencez par créer votre premier template de cours</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type de cours</th>
            <th>Jours</th>
            <th>Heure</th>
            <th>Durée</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>
                <strong>{template.name}</strong>
                {template.description && (
                  <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '4px' }}>
                    {template.description}
                  </div>
                )}
              </td>
              <td>
                <span className={`badge badge-${template.lesson_type}`}>
                  {template.lessonTypeLabel}
                </span>
              </td>
              <td>
                <div className="days-list" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {template.recurrence_rule?.byDay?.map((day) => (
                    <span key={day} className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                      {day.substring(0, 3).toUpperCase()}
                    </span>
                  ))}
                </div>
              </td>
              <td>{template.recurrence_rule?.startTime}</td>
              <td>{template.recurrence_rule?.duration} min</td>
              <td>
                <span className={`badge ${template.is_active ? 'badge-success' : 'badge-secondary'}`}>
                  {template.isActiveLabel}
                </span>
              </td>
              <td className="actions">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => onEdit(template)}
                  title="Modifier"
                >
                  <Icons.Edit /> Modifier
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => onDelete(template)}
                  title="Supprimer"
                >
                  <Icons.Delete /> Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TemplatesTable;