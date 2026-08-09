/** Ήπειροι — σταθερά κλειδιά + ελληνικές ετικέτες */
export type ContinentId =
  | 'europe'
  | 'asia'
  | 'africa'
  | 'north-america'
  | 'south-america'
  | 'oceania';

export const CONTINENT_LABELS: Record<ContinentId, string> = {
  europe: 'Ευρώπη',
  asia: 'Ασία',
  africa: 'Αφρική',
  'north-america': 'Βόρεια Αμερική',
  'south-america': 'Νότια Αμερική',
  oceania: 'Ωκεανία',
};

/** Βαθμός δυσκολίας χώρας: 1 = πολύ γνωστή, 2 = μέτρια, 3 = δύσκολη */
export type DifficultyTier = 1 | 2 | 3;

export interface Country {
  /** ISO 3166-1 alpha-2, lowercase (π.χ. "gr") — ταυτίζεται με το όνομα αρχείου σημαίας */
  iso2: string;
  /** ISO 3166-1 alpha-3, uppercase (π.χ. "GRC") */
  iso3: string;
  /** ISO 3166-1 numeric, ως string με padding (π.χ. "300") — κλειδί για τον χάρτη world-atlas */
  isoNumeric: string;

  nameGreek: string;
  /** Όνομα σε αιτιατική με άρθρο, π.χ. "την Ελλάδα", "το Βέλγιο", "τις Ηνωμένες Πολιτείες" */
  nameGreekAccusative: string;
  /** Γενική με άρθρο, π.χ. "της Ελλάδας", "του Βελγίου" */
  nameGreekGenitive: string;
  nameEnglish: string;

  capitalGreek: string;
  capitalEnglish?: string;

  continent: ContinentId;

  /** Πληθυσμός, στρογγυλεμένος (όχι ψευδής ακρίβεια) */
  population?: number;
  areaKm2?: number;

  currencyGreek?: string;
  currencyCode?: string;

  languagesGreek?: string[];

  /** 2–4 σύντομα, ενδιαφέροντα στοιχεία στα ελληνικά */
  factsGreek: string[];

  tier: DifficultyTier;
}

/** Στρογγυλεμένη, φιλική εμφάνιση πληθυσμού: «Περίπου 10,4 εκατομμύρια» */
export function formatPopulationGreek(population?: number): string {
  if (population == null || !Number.isFinite(population) || population <= 0) {
    return 'Άγνωστος';
  }
  if (population >= 1_000_000_000) {
    const v = population / 1_000_000_000;
    return `Περίπου ${formatGreekNumber(v)} δισεκατομμύρια`;
  }
  if (population >= 1_000_000) {
    const v = population / 1_000_000;
    return `Περίπου ${formatGreekNumber(v)} εκατομμύρια`;
  }
  if (population >= 1_000) {
    const v = Math.round(population / 1_000);
    return `Περίπου ${v} χιλιάδες`;
  }
  return `Περίπου ${population}`;
}

function formatGreekNumber(v: number): string {
  const rounded = v >= 20 ? Math.round(v) : Math.round(v * 10) / 10;
  return rounded.toLocaleString('el-GR');
}

export function formatAreaGreek(areaKm2?: number): string {
  if (areaKm2 == null || !Number.isFinite(areaKm2) || areaKm2 <= 0) {
    return 'Άγνωστη';
  }
  return `${Math.round(areaKm2).toLocaleString('el-GR')} km²`;
}
