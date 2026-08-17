import { useMemo } from 'react';
import { geoCentroid, geoNaturalEarth1, geoPath } from 'd3-geo';
import { useWorldTopology } from '../WorldMap/useWorldTopology';
import './GeoIdentity.css';

interface CountrySilhouetteProps {
  iso2: string;
  className?: string;
}

/**
 * Γεωγραφική σιλουέτα χώρας από την υπάρχουσα γεωμετρία του χάρτη.
 * Η προβολή περιστρέφεται στο κεντροειδές της χώρας ώστε χώρες που
 * τέμνουν τον 180ό μεσημβρινό (Ρωσία, Φίτζι κ.λπ.) να μη «σπάνε».
 * Επιστρέφει null αν δεν υπάρχει γεωμετρία (π.χ. Τουβαλού).
 */
export function CountrySilhouette({ iso2, className = '' }: CountrySilhouetteProps) {
  const { topology } = useWorldTopology();

  const d = useMemo(() => {
    if (!topology) return null;
    const target = topology.countries.find((c) => c.iso2 === iso2);
    if (!target) return null;
    const [lon] = geoCentroid(target.feature);
    const projection = geoNaturalEarth1()
      .rotate([-lon, 0])
      .fitExtent(
        [
          [8, 8],
          [192, 132],
        ],
        target.feature,
      );
    return geoPath(projection)(target.feature);
  }, [topology, iso2]);

  if (!d) return null;

  return (
    <svg className={`silhouette ${className}`} viewBox="0 0 200 140" aria-hidden="true">
      <path className="silhouette__path" d={d} pathLength={1} />
    </svg>
  );
}
