import type { ContinentId } from '../types/country';

/**
 * Κεντρικό σύστημα «ατμόσφαιρας ηπείρου». ΟΛΑ τα ηπειρωτικά χρώματα
 * του παιχνιδιού ζουν εδώ — τα components καταναλώνουν CSS μεταβλητές
 * (--cont-*) μέσω του continentVars(), ώστε μια ήπειρος να αλλάζει
 * απόχρωση σε ένα μόνο σημείο.
 *
 * Λειτουργεί ως στρώμα τόνου πάνω στην ενιαία ταυτότητα του παιχνιδιού:
 * δεν αντικαθιστά τα σημασιολογικά χρώματα (πράσινο = σωστό,
 * κόκκινο = λάθος) ούτε τα χρώματα σημαιών.
 */
export interface ContinentTheme {
  /** Κύριος τόνος */
  accent: string;
  /** Σκούρα εκδοχή για κείμενο πάνω σε ανοιχτό φόντο */
  dark: string;
  /** Απαλή απόχρωση για γεμίσματα */
  soft: string;
  /** Πολύ διακριτικό φόντο */
  tint: string;
  /** Λάμψη/φωτοστέφανο (με διαφάνεια) */
  glow: string;
}

export const CONTINENT_THEMES: Record<ContinentId, ContinentTheme> = {
  europe: {
    accent: '#2b5fc7',
    dark: '#1d3f86',
    soft: '#b9cdf2',
    tint: '#edf2fc',
    glow: 'rgba(43, 95, 199, 0.28)',
  },
  africa: {
    accent: '#d98e1f',
    dark: '#8f5c0f',
    soft: '#f2d9ae',
    tint: '#fdf5e6',
    glow: 'rgba(217, 142, 31, 0.30)',
  },
  asia: {
    accent: '#c8404a',
    dark: '#8c2830',
    soft: '#f2c1c4',
    tint: '#fdeeee',
    glow: 'rgba(200, 64, 74, 0.28)',
  },
  'north-america': {
    accent: '#189aa8',
    dark: '#0f6a74',
    soft: '#b5e3e8',
    tint: '#eaf8fa',
    glow: 'rgba(24, 154, 168, 0.28)',
  },
  'south-america': {
    accent: '#2a9d54',
    dark: '#1c6b3a',
    soft: '#bce5ca',
    tint: '#ecf9f0',
    glow: 'rgba(42, 157, 84, 0.28)',
  },
  oceania: {
    accent: '#7c5cbf',
    dark: '#553e8a',
    soft: '#d5c8ef',
    tint: '#f4f0fc',
    glow: 'rgba(124, 92, 191, 0.28)',
  },
};

/**
 * CSS μεταβλητές μιας ηπείρου, έτοιμες για spread σε style={}.
 * Τα στοιχεία διαβάζουν var(--cont-accent) κ.λπ. με εύλογα fallbacks.
 */
export function continentVars(continent: ContinentId): Record<string, string> {
  const t = CONTINENT_THEMES[continent];
  return {
    '--cont-accent': t.accent,
    '--cont-dark': t.dark,
    '--cont-soft': t.soft,
    '--cont-tint': t.tint,
    '--cont-glow': t.glow,
  };
}
