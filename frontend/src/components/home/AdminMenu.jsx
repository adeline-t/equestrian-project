import PropTypes from 'prop-types';
import { Icons } from '../../lib/icons';
import '../../styles/app.css';
import '../../styles/features/home/admin-menu.css';
import Portal from '../common/Portal';

export default function AdminMenu({ isOpen, onClose, onOpenImport, onOpenExport }) {
  if (!isOpen) return null;

  const handleImportClick = () => {
    onClose();
    onOpenImport();
  };

  const handleExportClick = () => {
    onClose();
    onOpenExport();
  };

  return (
    <Portal>
      <div className="modal-overlay" onClick={onClose}>
        {/* Menu dropdown */}
        <div className="modal-content modal modal--sm">
          <div className="admin-menu-dropdown" onClick={(e) => e.stopPropagation()}>
            <div className="admin-menu-header">
              <h3>
                <Icons.Settings /> Administration
              </h3>
              <button className="close-button" onClick={onClose} aria-label="Fermer">
                <Icons.X />
              </button>
            </div>

            <div className="admin-menu-content">
              <button className="admin-menu-item" onClick={handleImportClick}>
                <Icons.Import />
                <div className="admin-menu-item-text">
                  <span className="admin-menu-item-title">Importer un planning</span>
                  <span className="admin-menu-item-description">
                    Charger des événements depuis un fichier JSON
                  </span>
                </div>
                <Icons.ChevronRight />
              </button>

              <button className="admin-menu-item" onClick={handleExportClick}>
                <Icons.Export />
                <div className="admin-menu-item-text">
                  <span className="admin-menu-item-title">Exporter le rapport d'activité</span>
                  <span className="admin-menu-item-description">
                    Télécharger les événements au format CSV ou PDF
                  </span>
                </div>
                <Icons.ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

AdminMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpenImport: PropTypes.func.isRequired,
  onOpenExport: PropTypes.func.isRequired,
};
