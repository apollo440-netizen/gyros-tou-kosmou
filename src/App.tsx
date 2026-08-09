import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { Navigation } from './components/Navigation/Navigation';
import { HomePage } from './pages/HomePage';
import { GamesPage } from './pages/GamesPage';
import { QuizGamePage } from './pages/QuizGamePage';
import { EncyclopediaPage } from './pages/EncyclopediaPage';
import { CountryPage } from './pages/CountryPage';
import { ScoreboardPage } from './pages/ScoreboardPage';

// Οι σελίδες χάρτη φορτώνονται «τεμπέλικα» (φέρνουν το TopoJSON ~750KB)
const WorldMapPage = lazy(() =>
  import('./pages/WorldMapPage').then((m) => ({ default: m.WorldMapPage })),
);
const MapGamePage = lazy(() =>
  import('./pages/MapGamePage').then((m) => ({ default: m.MapGamePage })),
);

function PageLoading() {
  return (
    <div role="status" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-600)' }}>
      Φόρτωση...
    </div>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <div className="app-shell">
          <Navigation />
          <main className="app-main">
            <Suspense fallback={<PageLoading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/games" element={<GamesPage />} />
                <Route path="/games/:mode" element={<GamesPage />} />
                <Route path="/play/map" element={<MapGamePage />} />
                <Route path="/play/:mode" element={<QuizGamePage />} />
                <Route path="/map" element={<WorldMapPage />} />
                <Route path="/encyclopedia" element={<EncyclopediaPage />} />
                <Route path="/country/:iso2" element={<CountryPage />} />
                <Route path="/scoreboard" element={<ScoreboardPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </HashRouter>
    </SettingsProvider>
  );
}
