import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AdminModal from './AdminPasswordModal';
import RiderSelectorModal from './RiderSelectorModal';
import RiderCard from '../riders/RiderCard';
import { useAppMode } from '../../context/AppMode';
import { useCurrentRider } from '../../hooks/useCurrrentRider';
import { Icons } from '../../lib/icons';
import '../../styles/features/home.css';

export default function Header() {
  const { mode, resetMode } = useAppMode();
  const { rider, clearRider, selectRider } = useCurrentRider();
  const navigate = useNavigate();

  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [isRiderModalOpen, setRiderModalOpen] = useState(mode === 'user' && !rider);
  const [selectedRiderId, setSelectedRiderId] = useState(null);

  // Ouvre automatiquement la modale rider si mode user et aucun rider sélectionné
  useEffect(() => {
    if (mode === 'user' && !rider) {
      setRiderModalOpen(true);
    }
  }, [mode, rider]);

  const handleLogout = () => {
    resetMode();
    clearRider();
    navigate('/select');
  };

  const openRiderCard = () => {
    if (rider) setSelectedRiderId(rider.id);
  };

  const closeRiderCard = () => setSelectedRiderId(null);

  return (
    <header className="header">
      <div className="container header-container">
        <h1 className="header-title">
          <Icons.Horse style={{ marginRight: '12px' }} />
          Gestion Centre Équestre
        </h1>

        <nav className="header-nav">
          <NavLink className="nav-link" to="/calendar">
            <Icons.Calendar /> Planning
          </NavLink>

          {mode === 'admin' && (
            <NavLink className="nav-link" to="/riders">
              <Icons.User /> Cavaliers
            </NavLink>
          )}

          <NavLink className="nav-link" to="/horses">
            <Icons.Horse /> Chevaux
          </NavLink>

          <button className="btn btn-secondary" onClick={handleLogout}>
            Changer de profil
          </button>

          {/* Label de mode */}
          {mode === 'admin' ? (
            <div className="mode-label mode-admin">
              <Icons.Settings className="icon-small" /> Admin
            </div>
          ) : (
            <button
              className="mode-label mode-user rider-badge-btn"
              onClick={openRiderCard}
              title="Voir votre profil"
            >
              <Icons.User className="icon-small" />
              {rider ? rider.name : 'Utilisateur'}
            </button>
          )}
        </nav>
      </div>

      <AdminModal isOpen={isAdminModalOpen} onClose={() => setAdminModalOpen(false)} />

      <RiderSelectorModal
        isOpen={mode === 'user' && !rider && isRiderModalOpen}
        onClose={() => setRiderModalOpen(false)}
        onSelect={(selectedRider) => {
          selectRider(selectedRider);
          setRiderModalOpen(false);
        }}
      />

      {/* RiderCard Modal pour le rider courant */}
      {selectedRiderId && (
        <RiderCard
          riderId={selectedRiderId}
          onClose={closeRiderCard}
          onEdit={() => setSelectedRiderId(null)} // ou fonction edit spécifique
          onDelete={() => setSelectedRiderId(null)} // ou fonction delete spécifique
        />
      )}
    </header>
  );
}
