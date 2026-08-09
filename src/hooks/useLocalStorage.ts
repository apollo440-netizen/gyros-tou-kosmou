import { useCallback, useState } from 'react';

/**
 * Ασφαλής πρόσβαση στο localStorage: κατεστραμμένα ή ελλιπή δεδομένα
 * δεν πρέπει ποτέ να ρίχνουν την εφαρμογή.
 */
export function readStorage<T>(key: string, fallback: T, validate?: (v: unknown) => v is T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (validate && !validate(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // π.χ. γεμάτος χώρος αποθήκευσης ή private mode — αγνοείται σιωπηλά
  }
}

export function useLocalStorage<T>(
  key: string,
  fallback: T,
  validate?: (v: unknown) => v is T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => readStorage(key, fallback, validate));

  const set = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
        writeStorage(key, next);
        return next;
      });
    },
    [key],
  );

  return [state, set];
}
