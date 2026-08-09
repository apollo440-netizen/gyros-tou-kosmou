import { useState } from 'react';
import { getFlagUrl } from './flagAssets';
import './Flag.css';

interface FlagProps {
  iso2: string;
  /** Ελληνικό όνομα χώρας για το alt — κενό alt αν είναι διακοσμητική */
  countryName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/** Σημαία χώρας με ομαλή εφεδρική εμφάνιση αν λείπει/αποτύχει το αρχείο. */
export function Flag({ iso2, countryName, size = 'md', className = '' }: FlagProps) {
  const [failed, setFailed] = useState(false);
  const url = getFlagUrl(iso2);

  if (!url || failed) {
    return (
      <span
        className={`flag flag--${size} flag--missing ${className}`}
        role="img"
        aria-label={countryName ? `Σημαία: ${countryName}` : 'Σημαία μη διαθέσιμη'}
      >
        🏳️
      </span>
    );
  }

  return (
    <img
      className={`flag flag--${size} ${className}`}
      src={url}
      alt={countryName ? `Σημαία ${countryName}` : ''}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
