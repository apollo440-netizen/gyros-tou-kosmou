import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCountryByIsoCode } from '../data/countries';
import { CONTINENT_LABELS } from '../types/country';
import { WorldMap, type WorldMapHandle } from '../components/WorldMap/WorldMap';
import { Flag } from '../components/Flag/Flag';
import { CountryBall } from '../components/CountryBall/CountryBall';
import { Button } from '../components/Button/Button';
import './WorldMapPage.css';

/** Εξερεύνηση παγκόσμιου χάρτη με πλαϊνό πάνελ πληροφοριών. */
export function WorldMapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focusIso2 = searchParams.get('focus');
  const [selectedIso2, setSelectedIso2] = useState<string | null>(focusIso2);
  const mapRef = useRef<WorldMapHandle>(null);
  const selected = selectedIso2 ? getCountryByIsoCode(selectedIso2) : undefined;

  useEffect(() => {
    if (focusIso2) {
      setSelectedIso2(focusIso2);
      // Μικρή αναμονή ώστε να φορτώσει η γεωμετρία πριν το ζουμ
      const t = window.setTimeout(() => mapRef.current?.zoomToCountry(focusIso2), 600);
      return () => window.clearTimeout(t);
    }
  }, [focusIso2]);

  return (
    <div className="mappage">
      <h1 className="page-title">🗺️ Παγκόσμιος Χάρτης</h1>
      <p className="page-subtitle">
        Πέρασε το ποντίκι πάνω από μια χώρα και κάνε κλικ για πληροφορίες
      </p>

      <div className="mappage__layout">
        <div className="mappage__map">
          <WorldMap
            ref={mapRef}
            selectedIso2={selectedIso2}
            onSelectCountry={(iso2) => {
              setSelectedIso2(iso2);
              if (searchParams.get('focus')) setSearchParams({}, { replace: true });
            }}
          />
        </div>

        <aside className="mappage__panel" aria-label="Πληροφορίες επιλεγμένης χώρας">
          {selected ? (
            <div className="mappage__panel-card card">
              <Flag iso2={selected.iso2} countryName={selected.nameGreek} size="lg" />
              <h2 className="mappage__panel-name">{selected.nameGreek}</h2>
              <dl className="mappage__panel-facts">
                <div>
                  <dt>Πρωτεύουσα</dt>
                  <dd>{selected.capitalGreek}</dd>
                </div>
                <div>
                  <dt>Ήπειρος</dt>
                  <dd>{CONTINENT_LABELS[selected.continent]}</dd>
                </div>
              </dl>
              <div className="mappage__panel-actions">
                <Link to={`/country/${selected.iso2}`}>
                  <Button variant="primary">Περισσότερα →</Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => mapRef.current?.zoomToCountry(selected.iso2)}
                >
                  🔍 Ζουμ στη χώρα
                </Button>
              </div>
              <div className="mappage__panel-ball">
                <CountryBall country={selected} size={90} />
              </div>
            </div>
          ) : (
            <div className="mappage__panel-empty card">
              <span aria-hidden="true" className="mappage__panel-empty-icon">👆</span>
              <p>Διάλεξε μια χώρα στον χάρτη για να δεις πληροφορίες.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
