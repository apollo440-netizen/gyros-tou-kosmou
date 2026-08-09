import { Link } from 'react-router-dom';
import type { Country } from '../../types/country';
import { CONTINENT_LABELS } from '../../types/country';
import { Flag } from '../Flag/Flag';
import './CountryCard.css';

export function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      to={`/country/${country.iso2}`}
      className="country-card"
      aria-label={`${country.nameGreek} — περισσότερες πληροφορίες`}
    >
      <Flag iso2={country.iso2} countryName={country.nameGreek} size="md" />
      <span className="country-card__info">
        <span className="country-card__name">{country.nameGreek}</span>
        <span className="country-card__capital">{country.capitalGreek}</span>
        <span className="country-card__continent">{CONTINENT_LABELS[country.continent]}</span>
      </span>
    </Link>
  );
}
