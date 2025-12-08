import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import RidersList from './components/riders/RidersList';
import HorsesList from './components/horses/HorsesList';
import PairingsList from './components/pairings/PairingsList';
import PackagesList from './components/packages/PackagesList';
import CalendarView from './components/calendar/CalendarView';
import TemplateManagement from './components/templates/TemplateManagement';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <header>
            <div className="container">
              <h1>🐴 Gestion Centre Équestre</h1>
              <nav>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Cavaliers
                </NavLink>
                <NavLink to="/horses" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Chevaux
                </NavLink>
                <NavLink to="/pairings" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Paires
                </NavLink>
                <NavLink to="/packages" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Forfaits
                </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
                  📅 Calendrier
                </NavLink>
                <NavLink to="/templates" className={({ isActive }) => (isActive ? 'active' : '')}>
                  📋 Templates
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
