import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCountryByIsoCode } from '../data/countries';
import {
  CONTINENT_LABELS,
  formatAreaGreek,
  formatPopulationGreek,
} from '../types/country';
import { Flag } from '../components/Flag/Flag';
import { CountryBall } from '../components/CountryBall/CountryBall';
import { Button } from '../components/Button/Button';
import './CountryPage.css';

export function CountryPage() {
  const { iso2 } = useParams();
  const navigate = useNavigate();
  const country = iso2 ? getCountryByIsoCode(iso2) : undefined;

  if (!country) {
    return (
      <div className="country-page__missing card">
        <h1>Η χώρα δεν βρέθηκε</h1>
        <p>Δεν υπάρχουν πληροφορίες για αυτή τη χώρα.</p>
        <Link to="/encyclopedia">← Πίσω στην Εγκυκλοπαίδεια</Link>
      </div>
    );
  }

  const stats: { label: string; value: string }[] = [
    { label: 'Πρωτεύουσα', value: country.capitalGreek },
    { label: 'Ήπειρος', value: CONTINENT_LABELS[country.continent] },
    { label: 'Πληθυσμός', value: formatPopulationGreek(country.population) },
    { label: 'Έκταση', value: formatAreaGreek(country.areaKm2) },
    { label: 'Νόμισμα', value: country.currencyGreek ?? 'Άγνωστο' },
    {
      label: country.languagesGreek && country.languagesGreek.length > 1 ? 'Γλώσσες' : 'Γλώσσα',
      value: country.languagesGreek?.join(', ') ?? 'Άγνωστη',
    },
  ];

  return (
    <div className="country-page">
      <div className="country-page__back">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Πίσω
        </Button>
      </div>

      <header className="country-page__hero">
        <Flag iso2={country.iso2} countryName={country.nameGreek} size="xl" />
        <h1 className="country-page__name">{country.nameGreek}</h1>
        <p className="country-page__english">{country.nameEnglish}</p>
        <div className="country-page__ball">
          <CountryBall country={country} size={150} />
        </div>
      </header>

      <section className="country-page__stats" aria-label="Βασικά στοιχεία">
        {stats.map((s) => (
          <div key={s.label} className="country-stat">
            <span className="country-stat__label">{s.label}</span>
            <span className="country-stat__value">{s.value}</span>
          </div>
        ))}
      </section>

      {country.factsGreek.length > 0 && (
        <section className="country-page__facts card" aria-label="Γρήγορα στοιχεία">
          <h2>Γρήγορα στοιχεία</h2>
          <ul>
            {country.factsGreek.map((fact, i) => (
              <li key={i}>{fact}</li>
            ))}
          </ul>
        </section>
      )}

      <div className="country-page__actions">
        <Button variant="primary" size="lg" onClick={() => navigate(`/map?focus=${country.iso2}`)}>
          Βρες {country.nameGreekAccusative} στον χάρτη
        </Button>
      </div>
    </div>
  );
}
