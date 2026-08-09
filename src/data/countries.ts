import type { Country } from '../types/country';
import { EUROPE_COUNTRIES } from './countries/europe';
import { ASIA_COUNTRIES } from './countries/asia';
import { AFRICA_COUNTRIES } from './countries/africa';
import { NORTH_AMERICA_COUNTRIES } from './countries/northAmerica';
import { SOUTH_AMERICA_COUNTRIES } from './countries/southAmerica';
import { OCEANIA_COUNTRIES } from './countries/oceania';

export const ALL_COUNTRIES: Country[] = [
  ...EUROPE_COUNTRIES,
  ...ASIA_COUNTRIES,
  ...AFRICA_COUNTRIES,
  ...NORTH_AMERICA_COUNTRIES,
  ...SOUTH_AMERICA_COUNTRIES,
  ...OCEANIA_COUNTRIES,
].sort((a, b) => a.nameGreek.localeCompare(b.nameGreek, 'el'));

const byIso2 = new Map<string, Country>();
const byIsoNumeric = new Map<string, Country>();
for (const c of ALL_COUNTRIES) {
  byIso2.set(c.iso2.toLowerCase(), c);
  byIsoNumeric.set(c.isoNumeric, c);
}

export function getCountryByIsoCode(iso2: string): Country | undefined {
  return byIso2.get(iso2.toLowerCase());
}

/** Για τη σύνδεση με τον χάρτη world-atlas (Natural Earth ids = ISO numeric) */
export function getCountryByIsoNumeric(isoNumeric: string): Country | undefined {
  return byIsoNumeric.get(isoNumeric);
}

/** Αναζήτηση χωρίς τόνους/πεζά-κεφαλαία: «ελλαδα» βρίσκει «Ελλάδα» */
export function normalizeGreek(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ς/g, 'σ');
}

export function searchCountries(query: string, pool: Country[] = ALL_COUNTRIES): Country[] {
  const q = normalizeGreek(query.trim());
  if (!q) return pool;
  return pool.filter(
    (c) =>
      normalizeGreek(c.nameGreek).includes(q) ||
      normalizeGreek(c.capitalGreek).includes(q) ||
      c.nameEnglish.toLowerCase().includes(q),
  );
}
