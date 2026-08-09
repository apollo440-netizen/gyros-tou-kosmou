import { useEffect } from 'react';

interface KeyboardControlsOptions {
  /** Καλείται με 0–3 όταν πατηθεί 1–4 */
  onSelectChoice?: (index: number) => void;
  /** Καλείται με Enter ή Space */
  onAdvance?: () => void;
  enabled?: boolean;
}

function isTextInputActive(): boolean {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    (el as HTMLElement).isContentEditable
  );
}

/**
 * Πλήκτρα 1–4 = επιλογές απάντησης, Enter = επόμενη ερώτηση.
 * Δεν παρεμβαίνει όταν ο χρήστης πληκτρολογεί σε πεδίο κειμένου.
 */
export function useKeyboardControls({
  onSelectChoice,
  onAdvance,
  enabled = true,
}: KeyboardControlsOptions): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent) => {
      if (isTextInputActive()) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key >= '1' && e.key <= '4') {
        onSelectChoice?.(Number(e.key) - 1);
        e.preventDefault();
      } else if (e.key === 'Enter') {
        onAdvance?.();
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSelectChoice, onAdvance, enabled]);
}
