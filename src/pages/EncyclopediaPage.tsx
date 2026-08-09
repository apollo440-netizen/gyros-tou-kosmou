import { useMemo, useState } from 'react';
import { ALL_COUNTRIES, searchCountries } from '../data/countries';
import { CONTINENT_LABELS, type ContinentId } from '../types/country';
import { CountryCard } from '../components/CountryCard/CountryCard';
import './EncyclopediaPage.css';

const CONTINENT_FILTERS: { id: ContinentId | 'all'; label: string }[] = [
  { id: 'all', label: 'Όλες' },
  { id: 'europe', label: CONTINENT_LABELS.europe },
  { id: 'asia', label: CONTINENT_LABELS.asia },
  { id: 'africa', label: CONTINENT_LABELS.africa },
  { id: 'north-america', label: CONTINENT_LABELS['north-america'] },
  { id: 'south-america', label: CONTINENT_LABELS['south-america'] },
  { id: 'oceania', label: CONTINENT_LABELS.oceania },
];

export function EncyclopediaPage() {
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState<ContinentId | 'all'>('all');

  const countries = useMemo(() => {
    const pool =
      continent === 'all'
        ? ALL_COUNTRIES
        : ALL_COUNTRIES.filter((c) => c.continent === continent);
    return searchCountries(query, pool);
  }, [query, continent]);

  return (
    <div className="encyclopedia">
      <h1 className="page-title">📚 Εγκυκλοπαίδεια Χωρών</h1>

      <div className="encyclopedia__controls">
        <input
          type="search"
          className="encyclopedia__search"
          placeholder="Αναζήτηση χώρας..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Αναζήτηση χώρας"
        />
        <div className="encyclopedia__filters" role="group" aria-label="Φίλτρο ηπείρου">
          {CONTINENT_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`setup-chip ${continent === f.id ? 'setup-chip--active' : ''}`}
              aria-pressed={continent === f.id}
              onClick={() => setContinent(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="encyclopedia__count" role="status">
        {countries.length === 1 ? '1 χώρα' : `${countries.length} χώρες`}
      </p>

      {countries.length === 0 ? (
        <p className="encyclopedia__empty">Δεν βρέθηκαν χώρες. Δοκίμασε άλλη αναζήτηση.</p>
      ) : (
        <div className="encyclopedia__grid">
          {countries.map((c) => (
            <CountryCard key={c.iso2} country={c} />
          ))}
        </div>
      )}
    </div>
  );
}
