import React, { useState } from 'react';
import { useImportPlanning } from '../../hooks/useImportPlanning';
import '../../styles/features/import-export/import-planning.css';
import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';

export default function ImportPlanningModal({ isOpen, onClose, onSuccess }) {
  const [jsonFile, setJsonFile] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const { importing, progress, result, error, importPlanning, reset } = useImportPlanning();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setJsonFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        setJsonData(data);
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON : ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonData) {
      alert('Veuillez sélectionner un fichier JSON');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir importer ce planning ?')) {
      return;
    }

    try {
      await importPlanning(jsonData);
    } catch (err) {
      console.error('Import error:', err);
    }
  };

  const handleClose = () => {
    reset();
    setJsonFile(null);
    setJsonData(null);
    if (result && result.slotsCreated > 0) {
      onSuccess?.(); // Rafraîchir le calendrier si des slots ont été créés
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Icons.Add /> Importer un planning
          </h2>
          <button className="close-button" onClick={handleClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <div className="modal-body">
          {!importing && !result && (
            <>
              <div className="import-file-section">
                <div className="file-upload-area">
                  <label htmlFor="json-file" className="file-upload-label">
                    <Icons.Add
                      style={{ fontSize: 48, marginBottom: 16, color: 'var(--primary-color)' }}
                    />
                    <p className="file-upload-text">Cliquez pour sélectionner un fichier JSON</p>
                    <p className="file-upload-hint">ou glissez-déposez le fichier ici</p>
                  </label>
                  <input
                    type="file"
                    id="json-file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="file-input-hidden"
                  />
                </div>

                {jsonFile && (
                  <div className="file-info-card">
                    <div className="file-info-header">
                      <Icons.ChevronLeft />
                      <strong>{jsonFile.name}</strong>
                    </div>

                    {jsonData && (
                      <div className="json-preview">
                        <h4>Aperçu des données :</h4>
                        <div className="stats-grid">
                          <div className="stat-item">
                            <span className="stat-label">Événements</span>
                            <span className="stat-value">{jsonData.events?.length || 0}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Créneaux</span>
                            <span className="stat-value">
                              {jsonData.planning_slots?.length || 0}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Participants</span>
                            <span className="stat-value">
                              {jsonData.event_participants?.length || 0}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Cavaliers</span>
                            <span className="stat-value">
                              {jsonData.metadata?.unique_riders?.length || 0}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Chevaux</span>
                            <span className="stat-value">
                              {jsonData.metadata?.unique_horses?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {error && (
                <div className="alert alert-error">
                  <Icons.Warning />
                  <div>
                    <strong>Erreur :</strong> {error}
                  </div>
                </div>
              )}
            </>
          )}

          {importing && (
            <div className="import-progress-section">
              <Icons.Loading
                className="spin"
                style={{ fontSize: 48, marginBottom: 16, color: 'var(--primary-color)' }}
              />
              <h3>{progress.step}</h3>
              {progress.total > 0 && (
                <div className="progress-container">
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    />
                  </div>
                  <span className="progress-label">
                    {progress.current} / {progress.total}
                  </span>
                </div>
              )}
              {progress.details.length > 0 && (
                <div className="progress-details">
                  {progress.details.map((detail, idx) => (
                    <p key={idx}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {result && (
            <div className="import-result-section">
              <div className="result-header">
                <Icons.CheckCircle style={{ fontSize: 48, color: 'var(--success-color)' }} />
                <h3>Import terminé !</h3>
              </div>

              <div className="result-stats-grid">
                <div className="result-stat-card">
                  <h4>
                    <Icons.User /> Cavaliers
                  </h4>
                  <div className="stat-row">
                    <span>Trouvés :</span>
                    <strong>{result.ridersFound}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Créés :</span>
                    <strong className="text-success">{result.ridersCreated}</strong>
                  </div>
                </div>

                <div className="result-stat-card">
                  <h4>
                    <Icons.Horse /> Chevaux
                  </h4>
                  <div className="stat-row">
                    <span>Trouvés :</span>
                    <strong>{result.horsesFound}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Créés :</span>
                    <strong className="text-success">{result.horsesCreated}</strong>
                  </div>
                </div>

                <div className="result-stat-card">
                  <h4>
                    <Icons.Calendar /> Planning
                  </h4>
                  <div className="stat-row">
                    <span>Événements créés :</span>
                    <strong className="text-success">{result.eventsCreated}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Créneaux créés :</span>
                    <strong className="text-success">{result.slotsCreated}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Créneaux ignorés :</span>
                    <strong>{result.slotsSkipped}</strong>
                  </div>
                  <div className="stat-row">
                    <span>Participants ajoutés :</span>
                    <strong className="text-success">{result.participantsCreated}</strong>
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div className="import-errors-section">
                  <h4>
                    <Icons.Warning /> Erreurs ({result.errors.length})
                  </h4>
                  <div className="error-list-container">
                    <ul className="error-list">
                      {result.errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!importing && !result && (
            <>
              <button className="btn btn-secondary" onClick={handleClose}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleImport} disabled={!jsonData}>
                <Icons.ArrowDown /> Importer
              </button>
            </>
          )}

          {result && (
            <button className="btn btn-primary" onClick={handleClose}>
              <Icons.CheckCircle /> Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

ImportPlanningModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};
