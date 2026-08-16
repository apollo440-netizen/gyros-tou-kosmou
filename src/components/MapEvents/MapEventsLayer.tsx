import type { MapEvent } from '../../data/mapEvents';
import { projectToMap } from '../WorldMap/WorldMap';
import './MapEvents.css';

interface MapEventsLayerProps {
  events: MapEvent[];
  onTap: (event: MapEvent) => void;
}

/** Σύννεφα που ταξιδεύουν αργά πάνω από τον χάρτη — καθαρή ατμόσφαιρα */
export function AmbientClouds() {
  const clouds: { y: number; scale: number; dur: number; delay: number }[] = [
    { y: 60, scale: 1, dur: 75, delay: 0 },
    { y: 150, scale: 0.7, dur: 95, delay: -30 },
    { y: 330, scale: 0.85, dur: 85, delay: -60 },
  ];
  return (
    <g className="mapclouds" aria-hidden="true">
      {clouds.map((c, i) => (
        <g key={i} transform={`translate(0 ${c.y}) scale(${c.scale})`}>
          <g
            className="mapclouds__cloud"
            style={{ animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
          >
            <ellipse cx="0" cy="0" rx="30" ry="11" fill="#ffffff" />
            <ellipse cx="-20" cy="4" rx="18" ry="8" fill="#ffffff" />
            <ellipse cx="22" cy="4" rx="20" ry="9" fill="#ffffff" />
          </g>
        </g>
      ))}
    </g>
  );
}

/**
 * Ζωντανά γεγονότα πάνω στον χάρτη: emoji-χαρακτήρες σε πραγματικές
 * γεωγραφικές θέσεις, με παλλόμενο δαχτυλίδι που τραβάει το μάτι.
 * Ζωγραφίζονται μέσα στην ομάδα ζουμ, άρα ακολουθούν το ζουμ/σύρσιμο.
 */
export function MapEventsLayer({ events, onTap }: MapEventsLayerProps) {
  return (
    <g className="mapevents">
      {events.map((ev) => {
        const p = projectToMap(ev.lon, ev.lat);
        if (!p) return null;
        return (
          <g
            key={ev.id}
            className={`mapevent ${ev.golden ? 'mapevent--golden' : ''}`}
            transform={`translate(${p[0]} ${p[1]})`}
            role="button"
            tabIndex={-1}
            aria-label={ev.textGreek}
            onClick={(e) => {
              e.stopPropagation();
              onTap(ev);
            }}
          >
            {/* Οι CSS κινήσεις μπαίνουν σε εσωτερικές ομάδες — αν έμπαιναν
                στην εξωτερική θα υπερίσχυαν του translate τοποθέτησης */}
            <g className="mapevent__inner">
              <circle className="mapevent__pulse" r="18" />
              {ev.golden && (
                <g className="mapevent__sparkles" aria-hidden="true">
                  <text x="-22" y="-14" fontSize="12" className="mapevent__sparkle">✨</text>
                  <text x="14" y="-18" fontSize="10" className="mapevent__sparkle mapevent__sparkle--b">✨</text>
                  <text x="18" y="16" fontSize="11" className="mapevent__sparkle mapevent__sparkle--c">✨</text>
                </g>
              )}
              <g className="mapevent__bob">
                <text
                  className="mapevent__emoji"
                  y="2"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="30"
                >
                  {ev.emoji}
                </text>
              </g>
              {/* Μεγάλη αόρατη περιοχή αφής για μικρά δάχτυλα */}
              <circle className="mapevent__hit" r="34" fill="transparent" />
            </g>
          </g>
        );
      })}
    </g>
  );
}
