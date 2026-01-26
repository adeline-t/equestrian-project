import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppMode } from '../../context/AppMode';
import AdminPasswordModal from './AdminPasswordModal';
import { Icons } from '../../lib/icons';
import '../../styles/features/home/home.css';

export default function HomeSelector() {
  const { setMode } = useAppMode();
  const navigate = useNavigate();
  const [showAdminModal, setShowAdminModal] = useState(false);

  const selectUser = () => {
    setMode('user');
    navigate('/calendar');
  };

  const handleAdminSuccess = () => {
    setMode('admin');
    setShowAdminModal(false);
    navigate('/calendar');
  };

  return (
    <div className="home-selector container">
      <div className="home-selector-card">
        <h1>
          <Icons.Horse /> Gestion Centre Équestre
        </h1>
        <p className="subtitle">Veuillez sélectionner votre profil</p>

        <div className="home-selector-actions">
          <button className="profile-card" onClick={selectUser}>
            <Icons.User />
            <div>
              <strong>Utilisateur</strong>
              <span>Accès planning & consultation</span>
            </div>
          </button>

          <button className="profile-card admin" onClick={() => setShowAdminModal(true)}>
            <Icons.Settings />
            <div>
              <strong>Administrateur</strong>
              <span>Gestion complète du centre</span>
            </div>
          </button>
        </div>
      </div>

      <AdminPasswordModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}
