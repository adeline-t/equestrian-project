// src/components/common/Restricted.jsx
import { useAppMode } from '../../context/AppMode';

export default function Restricted({ adminOnly = false, children }) {
  const { mode } = useAppMode();

  if (adminOnly && mode !== 'admin') {
    return null; // ou un message "Accès réservé"
  }

  return children;
}
