import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';

import { AppModeProvider } from './context/AppMode';
import RequireMode from './components/common/RequireMode';

import HomeSelector from './components/home/HomeSelector';
import Header from './components/home/Header';

import CalendarView from './components/calendar/CalendarView';
import HorsesList from './components/horses/HorsesList';
import RidersList from './components/riders/RidersList';
import Restricted from './components/common/Restricted';
import MonthlyStatsView from './components/stats/MonthlyStatsView';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppModeProvider>
          <Routes>
            <Route path="/select" element={<HomeSelector />} />

            <Route
              path="/*"
              element={
                <RequireMode>
                  <div className="app">
                    <Header />
                    <Routes>
                      <Route path="calendar" element={<CalendarView />} />
                      <Route path="horses" element={<HorsesList />} />
                      <Route
                        path="riders"
                        element={
                          <Restricted adminOnly>
                            <RidersList />
                          </Restricted>
                        }
                      />
                      <Route
                        path="stats"
                        element={
                          <Restricted adminOnly>
                            <MonthlyStatsView />
                          </Restricted>
                        }
                      />
                    </Routes>
                  </div>
                </RequireMode>
              }
            />
          </Routes>
        </AppModeProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
