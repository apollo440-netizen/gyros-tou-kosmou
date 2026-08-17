import { useMemo } from 'react';
import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo';
import type { AnswerRecord } from '../../types/game';
import { useWorldTopology } from '../WorldMap/useWorldTopology';
import './SessionRouteMap.css';

const W = 1000;
const H = 500;

interface SessionRouteMapProps {
  stops: AnswerRecord[];
}

/**
 * Αναμνηστικό διαδρομής: μικρός παγκόσμιος χάρτης με καμπύλη
 * διακεκομμένη πορεία μέσα από τις χώρες της συνεδρίας, με τη σειρά
 * που τις επισκέφθηκε ο παίκτης. Καθαρό SVG από την υπάρχουσα
 * γεωμετρία — καμία εξωτερική υπηρεσία χαρτών.
 */
export function SessionRouteMap({ stops }: SessionRouteMapProps) {
  const { topology } = useWorldTopology();

  const data = useMemo(() => {
    if (!topology) return null;
    const projection = geoNaturalEarth1().fitSize([W, H], { type: 'Sphere' });
    const pathGen = geoPath(projection);
    const land = topology.countries
      .map((c) => pathGen(c.feature))
      .filter((d): d is string => Boolean(d))
      .join(' ');

    const byIso = new Map(topology.countries.map((c) => [c.iso2, c]));
    const points: { x: number; y: number; state: 'ok' | 'new' | 'miss' }[] = [];
    for (const s of stops) {
      const c = byIso.get(s.countryId);
      if (!c) continue;
      const p = projection(geoCentroid(c.feature));
      if (!p) continue;
      points.push({
        x: p[0],
        y: p[1],
        state: s.discovered ? 'new' : s.correct ? 'ok' : 'miss',
      });
    }

    // Καμπύλη πορεία: τετραγωνικές καμπύλες με ελαφρύ «σήκωμα»
    let route = '';
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1];
      const b = points[i];
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 - Math.min(60, Math.hypot(b.x - a.x, b.y - a.y) * 0.22);
      route += `${i === 1 ? `M${a.x.toFixed(1)} ${a.y.toFixed(1)}` : ''} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)} `;
    }

    return { land, points, route };
  }, [topology, stops]);

  if (!data || data.points.length === 0) return null;
  const last = data.points[data.points.length - 1];

  return (
    <div className="routemap" aria-label="Χάρτης διαδρομής ταξιδιού" role="img">
      <svg viewBox={`0 0 ${W} ${H}`} className="routemap__svg">
        <rect x="0" y="0" width={W} height={H} rx="18" className="routemap__ocean" />
        <path d={data.land} className="routemap__land" />
        {data.route && <path d={data.route} className="routemap__route" />}
        {data.points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.state === 'new' ? 11 : 8}
            className={`routemap__dot routemap__dot--${p.state}`}
          />
        ))}
        {data.points.length > 1 && (
          <g
            className="routemap__plane"
            transform={`translate(${last.x - 18} ${last.y - 40}) scale(1.5) rotate(-10)`}
          >
            <path
              d="M21 12 3.5 4.5 7 12l-3.5 7.5L21 12Z"
              fill="currentColor"
              stroke="#fff"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <path d="M7 12h9" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
}
