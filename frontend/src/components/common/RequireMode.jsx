import { Navigate } from 'react-router-dom';
import { useAppMode } from '../../context/AppMode';

export default function RequireMode({ children }) {
  const { mode } = useAppMode();

  if (!mode) {
    return <Navigate to="/select" replace />;
  }

  return children;
}
