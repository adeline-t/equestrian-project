import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import RidersList from './components/riders/RidersList';
import HorsesList from './components/horses/HorsesList';
import PairingsList from './components/pairings/PairingsList';
import PackagesList from './components/packages/PackagesList';
import CalendarView from './components/calendar/CalendarView';
import TemplateManagement from './components/templates/TemplateManagement';
import { Icons } from './lib/libraries/icons.jsx';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <header>
            <div className="container">
              <h1>
                <Icons.Horse style={{ marginRight: '12px' }} /> Gestion Centre Équestre
              </h1>
              <nav>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icons.User style={{ marginRight: '8px' }} /> Cavaliers
                </NavLink>
                <NavLink to="/horses" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icons.Horse style={{ marginRight: '8px' }} /> Chevaux
                </NavLink>
                <NavLink to="/pairings" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icons.Link style={{ marginRight: '8px' }} /> Pensions
                </NavLink>
                <NavLink to="/packages" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icons.Packages style={{ marginRight: '8px' }} /> Forfaits
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icons.Calendar style={{ marginRight: '8px' }} /> Calendrier
                </NavLink>
                <NavLink to="/templates" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icons.Template style={{ marginRight: '8px' }} /> Templates
                </NavLink>
              </nav>
            </div>
          </header>

          <main className="container">
            <Routes>
              <Route path="/" element={<RidersList />} />
              <Route path="/horses" element={<HorsesList />} />
              <Route path="/pairings" element={<PairingsList />} />
              <Route path="/packages" element={<PackagesList />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/templates" element={<TemplateManagement />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
