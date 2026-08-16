import { readStorage, writeStorage } from '../hooks/useLocalStorage';

/**
 * Συλλογή φιγούρων (countryballs): μία φιγούρα «ξεκλειδώνει» με την
 * πρώτη σωστή απάντηση για τη χώρα της, σε οποιαδήποτε λειτουργία.
 */
export const COLLECTION_KEY = 'geographyGame:collection:v1';

function isIso2Array(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string' && x.length === 2);
}

export function loadCollection(): Set<string> {
  return new Set(readStorage<string[]>(COLLECTION_KEY, [], isIso2Array));
}

/** Επιστρέφει true αν η φιγούρα μόλις ξεκλειδώθηκε (πρώτη φορά). */
export function addToCollection(iso2: string): boolean {
  const set = loadCollection();
  if (set.has(iso2)) return false;
  set.add(iso2);
  writeStorage(COLLECTION_KEY, [...set]);
  return true;
}
