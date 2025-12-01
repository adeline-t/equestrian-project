import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import RidersList from './components/riders/RidersList';
import HorsesList from './components/horses/HorsesList';
import AssociationsList from './components/associations/AssociationsList';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="app">
          <header>
            <div className="container">
              <h1>🐴 Gestion Centre Équestre</h1>
              <nav>
                <NavLink 
                  to="/" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Cavaliers
                </NavLink>
                <NavLink 
                  to="/horses" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Chevaux
                </NavLink>
                <NavLink 
                  to="/associations" 
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  Associations
                </NavLink>
              </nav>
            </div>
          </header>

          <main className="container">
            <Routes>
              <Route path="/" element={<RidersList />} />
              <Route path="/horses" element={<HorsesList />} />
              <Route path="/associations" element={<AssociationsList />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;