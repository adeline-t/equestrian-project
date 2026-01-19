import { NavLink, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import HorsesList from './components/horses/HorsesList';
import RidersList from './components/riders/RidersList';
import CalendarView from './components/calendar/CalendarView';
import { Icons } from './lib/icons.jsx';

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
                <NavLink to="/calendar" className={({ isActive }) => (isActive ? 'active' : '')}>
                  <Icons.Calendar style={{ marginRight: '8px' }} /> Planning
                </NavLink>
              </nav>
            </div>
          </header>

          <main className="container">
            <Routes>
              <Route path="/" element={<RidersList />} />
              <Route path="/horses" element={<HorsesList />} />
              <Route path="/calendar" element={<CalendarView />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
