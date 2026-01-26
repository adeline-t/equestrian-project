import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AdminModal from './AdminPasswordModal';
import RiderSelectorModal from './RiderSelectorModal';
import RiderCard from '../riders/RiderCard';
import { useAppMode } from '../../context/AppMode';
import { useCurrentRider } from '../../hooks/useCurrrentRider';
import { Icons } from '../../lib/icons';
import '../../styles/features/home/header.css';
import '../../styles/features/home/header-mobile.css';

export default function Header() {
  const { mode, resetMode } = useAppMode();
  const { rider, clearRider, selectRider } = useCurrentRider();
  const navigate = useNavigate();
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [isRiderModalOpen, setRiderModalOpen] = useState(mode === 'user' && !rider);
  const [selectedRiderId, setSelectedRiderId] = useState(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ouvre automatiquement la modale rider si mode user et aucun rider sélectionné
  useEffect(() => {
    if (mode === 'user' && !rider) {
      setRiderModalOpen(true);
    }
  }, [mode, rider]);

  // Ferme le menu mobile quand on change de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    resetMode();
    clearRider();
    navigate('/select');
    setMobileMenuOpen(false);
  };

  const openRiderCard = () => {
    if (rider) setSelectedRiderId(rider.id);
    setMobileMenuOpen(false);
  };

  const closeRiderCard = () => setSelectedRiderId(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="header">
        <div className="container header-container">
          {/* Mobile Header */}
          <div className="header-mobile">
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Menu">
              {isMobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>

            <h1 className="header-title-mobile">
              <Icons.Horse />
              <span>Centre Équestre</span>
            </h1>

            {/* Mode badge mobile */}
            {mode === 'admin' ? (
              <div className="mode-badge-mobile mode-admin">
                <Icons.Settings />
              </div>
            ) : (
              <button
                className="mode-badge-mobile mode-user"
                onClick={openRiderCard}
                title="Voir votre profil"
              >
                <Icons.User />
              </button>
            )}
          </div>

          {/* Desktop Header */}
          <div className="header-desktop">
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
              {mode === 'admin' && (
                <NavLink className="nav-link" to="/stats">
                  <Icons.BarChart /> Statistiques
                </NavLink>
              )}
              <button className="btn btn-secondary" onClick={handleLogout}>
                Changer de profil
              </button>

              {/* Label de mode desktop */}
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
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={toggleMobileMenu}>
          <nav className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h2>Menu</h2>
              <button onClick={toggleMobileMenu} aria-label="Fermer">
                <Icons.X />
              </button>
            </div>

            <div className="mobile-menu-content">
              {/* User info */}
              {mode === 'user' && rider && (
                <button className="mobile-user-card" onClick={openRiderCard}>
                  <Icons.User className="mobile-user-icon" />
                  <div className="mobile-user-info">
                    <span className="mobile-user-name">{rider.name}</span>
                    <span className="mobile-user-label">Voir mon profil</span>
                  </div>
                  <Icons.ChevronRight />
                </button>
              )}

              {/* Navigation links */}
              <div className="mobile-menu-links">
                <NavLink
                  className="mobile-nav-link"
                  to="/calendar"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icons.Calendar />
                  <span>Planning</span>
                </NavLink>

                {mode === 'admin' && (
                  <NavLink
                    className="mobile-nav-link"
                    to="/riders"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icons.User />
                    <span>Cavaliers</span>
                  </NavLink>
                )}

                <NavLink
                  className="mobile-nav-link"
                  to="/horses"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icons.Horse />
                  <span>Chevaux</span>
                </NavLink>

                {mode === 'admin' && (
                  <NavLink
                    className="mobile-nav-link"
                    to="/stats"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icons.BarChart />
                    <span>Statistiques</span>
                  </NavLink>
                )}
              </div>

              {/* Logout button */}
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <Icons.LogOut />
                <span>Changer de profil</span>
              </button>

              {/* Mode indicator */}
              <div className="mobile-menu-footer">
                {mode === 'admin' ? (
                  <div className="mobile-mode-badge admin">
                    <Icons.Settings /> Mode Admin
                  </div>
                ) : (
                  <div className="mobile-mode-badge user">
                    <Icons.User /> Mode Utilisateur
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}

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
          onEdit={() => setSelectedRiderId(null)}
          onDelete={() => setSelectedRiderId(null)}
        />
      )}
    </>
  );
}
