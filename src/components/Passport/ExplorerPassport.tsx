import { useEffect, useRef } from 'react';
import type { AnswerRecord } from '../../types/game';
import { getCountryByIsoCode } from '../../data/countries';
import { playSound } from '../../audio/soundManager';
import { Flag } from '../Flag/Flag';
import './Passport.css';

/** Πόσες πρόσφατες στάσεις δείχνουμε στο ατέρμονο ταξίδι */
const ENDLESS_WINDOW = 10;

/** Μικρή πυξίδα — δείκτης τρέχουσας θέσης του ταξιδιού (όχι emoji) */
export function CompassGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#fff" stroke="currentColor" strokeWidth="2" />
      <path d="M15.8 8.2 13 13l-4.8 2.8L11 11l4.8-2.8Z" fill="currentColor" />
      <circle cx="12" cy="12" r="1.4" fill="#fff" />
    </svg>
  );
}

/** Χάρτινο αεροπλανάκι για τη γραμμή διαδρομής */
export function PlaneGlyph({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 12 3.5 4.5 7 12l-3.5 7.5L21 12Z"
        fill="currentColor"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7 12h9" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

interface PassportStampProps {
  stop: AnswerRecord;
  index: number;
  large?: boolean;
}

/**
 * Μία σφραγίδα διαβατηρίου: σημαία + κωδικός χώρας σε κοινό
 * «οικογενειακό» πλαίσιο. Καταστάσεις: κανονική (επίσκεψη), χρυσή
 * (νέα ανακάλυψη — λάμψη + αστέρι, όχι μόνο χρώμα), αχνή (λάθος —
 * «περάσαμε, αλλά δεν το κατακτήσαμε» — χωρίς τιμωρητικό κόκκινο).
 */
export function PassportStamp({ stop, index, large = false }: PassportStampProps) {
  const country = getCountryByIsoCode(stop.countryId);
  if (!country) return null;
  const state = stop.discovered ? 'new' : stop.correct ? 'ok' : 'miss';
  const label =
    `Στάση ${index + 1}: ${country.nameGreek} — ` +
    (stop.discovered ? 'νέα ανακάλυψη!' : stop.correct ? 'σωστή απάντηση' : 'χωρίς σωστή απάντηση');
  const tilt = ((index * 47) % 7) - 3; // ντετερμινιστικό ελαφρύ γείρσιμο

  return (
    <span
      className={`pstamp pstamp--${state} ${large ? 'pstamp--large' : ''}`}
      style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}
      role="img"
      aria-label={label}
      title={label}
    >
      <span className="pstamp__flag">
        <Flag iso2={country.iso2} size="sm" />
      </span>
      <span className="pstamp__iso" aria-hidden="true">
        {country.iso2.toUpperCase()}
      </span>
      {stop.discovered && (
        <svg className="pstamp__star" viewBox="0 0 12 12" aria-hidden="true">
          <path
            d="M6 0.8 7.4 4.3 11.2 4.6 8.3 7 9.2 10.8 6 8.7 2.8 10.8 3.7 7 0.8 4.6 4.6 4.3Z"
            fill="#ffb703"
            stroke="#b97f00"
            strokeWidth="0.6"
          />
        </svg>
      )}
      {!stop.correct && (
        <span className="pstamp__miss-mark" aria-hidden="true">
          …
        </span>
      )}
      {large && country && <span className="pstamp__name">{country.nameGreek}</span>}
    </span>
  );
}

interface ExplorerPassportProps {
  stops: AnswerRecord[];
  /** null = ατέρμονο ταξίδι */
  totalQuestions: number | null;
  /** Πυκνή εκδοχή για τη σελίδα χάρτη σε μικρές οθόνες */
  compact?: boolean;
  /** Μεγάλη εκδοχή αποτελεσμάτων: μεγαλύτερες σφραγίδες + ονόματα */
  large?: boolean;
  /** Χωρίς ήχο σφραγίσματος (π.χ. στα αποτελέσματα) */
  silent?: boolean;
}

/**
 * Το Διαβατήριο του Εξερευνητή: κάθε ερώτηση αφήνει μια σφραγίδα και
 * η διαδρομή του ταξιδιού μεγαλώνει στάση τη στάση. Ζει σε όλα τα
 * παιχνίδια για να τα δένει σε ένα κοινό ταξίδι — ελαφρύ, χωρίς δικό
 * του state πέρα από τα answers που ήδη κρατά η συνεδρία.
 */
export function ExplorerPassport({
  stops,
  totalQuestions,
  compact = false,
  large = false,
  silent = false,
}: ExplorerPassportProps) {
  const prevCount = useRef(stops.length);

  useEffect(() => {
    if (!silent && stops.length > prevCount.current) playSound('stamp');
    prevCount.current = stops.length;
  }, [stops.length, silent]);

  const endless = totalQuestions === null;
  const visibleStops = endless ? stops.slice(-ENDLESS_WINDOW) : stops;
  const hiddenBefore = endless ? stops.length - visibleStops.length : 0;
  const slotCount = endless
    ? Math.max(ENDLESS_WINDOW, visibleStops.length)
    : totalQuestions;
  // Μεγάλες σφραγίδες (αποτελέσματα) με ονόματα θέλουν χώρο → δύο σειρές νωρίτερα
  const twoRows = !endless && (slotCount > 12 || (large && slotCount > 6));
  const perRow = twoRows ? Math.ceil(slotCount / 2) : slotCount;

  const uniqueCountries = new Set(stops.map((s) => s.countryId)).size;

  const renderRow = (rowIndex: number) => {
    const start = rowIndex * perRow;
    const rowSlots = Math.min(perRow, slotCount - start);
    const stamped = Math.max(0, Math.min(rowSlots, visibleStops.length - start));
    const progress = rowSlots > 0 ? stamped / rowSlots : 0;
    return (
      <div className="passport__row" key={rowIndex}>
        <span className="passport__route" aria-hidden="true" />
        <span
          className="passport__route-done"
          aria-hidden="true"
          style={{ width: `calc(${(progress * 100).toFixed(1)}% - 8px)` }}
        >
          {stamped > 0 && stamped < rowSlots && <PlaneGlyph className="passport__plane" />}
        </span>
        {Array.from({ length: rowSlots }, (_, i) => {
          const slotIndex = start + i;
          const stop = visibleStops[slotIndex];
          if (stop) {
            return (
              <PassportStamp
                key={`${hiddenBefore + slotIndex}-${stop.countryId}`}
                stop={stop}
                index={hiddenBefore + slotIndex}
                large={large}
              />
            );
          }
          const isCurrent = slotIndex === visibleStops.length;
          return (
            <span key={`empty-${slotIndex}`} className="pslot" aria-hidden="true">
              {isCurrent && <CompassGlyph className="pslot__compass" />}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`passport ${compact ? 'passport--compact' : ''} ${large ? 'passport--large' : ''}`}
      role="group"
      aria-label={
        endless
          ? `Διαβατήριο ταξιδιού: ${stops.length} στάσεις, ${uniqueCountries} χώρες`
          : `Διαβατήριο ταξιδιού: στάση ${Math.min(stops.length + 1, slotCount)} από ${slotCount}`
      }
    >
      {endless && (
        <div className="passport__meta">
          <span>
            Ταξίδι: <strong>{stops.length}</strong> στάσεις
          </span>
          <span>
            <strong>{uniqueCountries}</strong> χώρες
          </span>
        </div>
      )}
      {renderRow(0)}
      {twoRows && renderRow(1)}
    </div>
  );
}
