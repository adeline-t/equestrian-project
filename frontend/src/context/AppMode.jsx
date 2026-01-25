import { createContext, useContext, useState } from 'react';

const AppModeContext = createContext({
  mode: null, // 'admin' | 'user' | null
  currentRider: null, // { id, name } ou null
  setMode: () => {},
  selectRider: () => {},
  resetMode: () => {},
});

export function AppModeProvider({ children }) {
  const storedMode = localStorage.getItem('appMode');
  const storedRider = localStorage.getItem('currentRider');

  const [mode, setModeState] = useState(storedMode || null);
  const [currentRider, setCurrentRider] = useState(storedRider ? JSON.parse(storedRider) : null);

  const setMode = (newMode) => {
    console.info('Mode', newMode);
    localStorage.setItem('appMode', newMode);
    setModeState(newMode);
  };

  const selectRider = (rider) => {
    setCurrentRider(rider);
    localStorage.setItem('currentRider', JSON.stringify(rider));
    setMode('user'); // automatiquement passer en mode 'user'
  };

  const resetMode = () => {
    localStorage.removeItem('appMode');
    localStorage.removeItem('currentRider');
    setModeState(null);
    setCurrentRider(null);
  };

  return (
    <AppModeContext.Provider value={{ mode, currentRider, setMode, selectRider, resetMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode() {
  return useContext(AppModeContext);
}
