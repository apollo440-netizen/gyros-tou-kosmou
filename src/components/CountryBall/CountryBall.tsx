import { useId } from 'react';
import type { Country } from '../../types/country';
import { getFlagUrl } from '../Flag/flagAssets';
import './CountryBall.css';

interface CountryBallProps {
  country: Country;
  /** Διάμετρος σε px */
  size?: number;
  className?: string;
  /** Καθυστέρηση κίνησης για ποικιλία όταν υπάρχουν πολλές μπάλες */
  animationDelay?: string;
}

/**
 * Διαδικαστικό «countryball»: σφαιρικός χαρακτήρας από τη σημαία
 * της χώρας, με καρτουνίστικα μάτια, σκίαση και ήπια κίνηση.
 * Δεν χρειάζεται ξεχωριστό αρχείο εικόνας για κάθε χώρα.
 */
export function CountryBall({
  country,
  size = 140,
  className = '',
  animationDelay = '0s',
}: CountryBallProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const flagUrl = getFlagUrl(country.iso2);
  const clipId = `cb-clip-${uid}`;
  const shadeId = `cb-shade-${uid}`;

  return (
    <div
      className={`countryball ${className}`}
      style={{ width: size, height: size * 1.08, animationDelay }}
      aria-hidden="true"
    >
      <svg
        className="countryball__svg"
        viewBox="0 0 100 108"
        width={size}
        height={size * 1.08}
      >
        <defs>
          <clipPath id={clipId}>
            <circle cx="50" cy="52" r="46" />
          </clipPath>
          <radialGradient id={shadeId} cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="55%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(8,33,56,0.38)" />
          </radialGradient>
        </defs>

        {/* Σκιά εδάφους */}
        <ellipse className="countryball__ground" cx="50" cy="103" rx="30" ry="5" fill="rgba(8,33,56,0.18)" />

        <g className="countryball__body">
          {/* Σώμα-σημαία */}
          {flagUrl ? (
            <image
              href={flagUrl}
              x="-14"
              y="4"
              width="128"
              height="96"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${clipId})`}
            />
          ) : (
            <circle cx="50" cy="52" r="46" fill="#9db8cc" />
          )}
          {/* Σφαιρική σκίαση */}
          <circle cx="50" cy="52" r="46" fill={`url(#${shadeId})`} />
          <circle cx="50" cy="52" r="46" fill="none" stroke="rgba(8,33,56,0.55)" strokeWidth="2.5" />

          {/* Μάτια */}
          <g className="countryball__eyes">
            <g className="countryball__eye">
              <ellipse cx="36" cy="42" rx="10" ry="12" fill="#fff" stroke="rgba(8,33,56,0.75)" strokeWidth="2" />
              <circle className="countryball__pupil" cx="38" cy="44" r="4" fill="#14283c" />
              <circle cx="39.5" cy="42" r="1.4" fill="#fff" />
            </g>
            <g className="countryball__eye">
              <ellipse cx="64" cy="42" rx="10" ry="12" fill="#fff" stroke="rgba(8,33,56,0.75)" strokeWidth="2" />
              <circle className="countryball__pupil" cx="66" cy="44" r="4" fill="#14283c" />
              <circle cx="67.5" cy="42" r="1.4" fill="#fff" />
            </g>
            {/* Βλέφαρα για το ανοιγόκλεισμα */}
            <g className="countryball__blink">
              <ellipse cx="36" cy="42" rx="11" ry="13" fill="rgba(8,33,56,0.85)" />
              <ellipse cx="64" cy="42" rx="11" ry="13" fill="rgba(8,33,56,0.85)" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
