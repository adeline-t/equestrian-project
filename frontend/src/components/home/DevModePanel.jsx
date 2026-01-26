import { useAppMode } from '../../context/AppMode';
import '../../styles/features/home/home.css';

export default function DevModePanel() {
  const { mode, setMode } = useAppMode();

  return (
    <div className={`dev-mode-panel ${mode}`}>
      <p>
        Mode :<strong>{mode}</strong>
      </p>

      <button onClick={() => setMode(mode === 'admin' ? 'user' : 'admin')}>
        Passer en {mode === 'admin' ? 'Utilisateur' : 'Admin'}
      </button>
    </div>
  );
}
