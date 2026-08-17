import { useMemo } from 'react';
import { geoCentroid, geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { useWorldTopology } from '../WorldMap/useWorldTopology';
import './GeoIdentity.css';

interface MiniGlobeProps {
  iso2: string;
  className?: string;
  size?: number;
}

/**
 * Μικρή υδρόγειος (ορθογραφική προβολή) στραμμένη στη χώρα: δείχνει
 * με μια ματιά ΠΟΥ στον πλανήτη βρίσκεται. Η χώρα φωτίζεται με τον
 * τόνο της ηπείρου της (--cont-accent) και ένα δαχτυλίδι πάλλεται
 * στο κέντρο — ώστε και οι μικροσκοπικές χώρες να εντοπίζονται.
 */
export function MiniGlobe({ iso2, className = '', size = 120 }: MiniGlobeProps) {
  const { topology } = useWorldTopology();

  const paths = useMemo(() => {
    if (!topology) return null;
    const target = topology.countries.find((c) => c.iso2 === iso2);
    if (!target) return null;
    const [lon, lat] = geoCentroid(target.feature);
    const projection = geoOrthographic()
      .translate([70, 70])
      .scale(66)
      .rotate([-lon, -lat])
      .clipAngle(90);
    const path = geoPath(projection);
    const land = topology.countries
      .filter((c) => c.iso2 !== iso2)
      .map((c) => path(c.feature))
      .filter((p): p is string => Boolean(p))
      .join(' ');
    return {
      sphere: path({ type: 'Sphere' }) ?? '',
      graticule: path(geoGraticule10()) ?? '',
      land,
      target: path(target.feature) ?? '',
    };
  }, [topology, iso2]);

  if (!paths) return null;

  return (
    <svg
      className={`miniglobe ${className}`}
      viewBox="0 0 140 140"
      width={size}
      height={size}
      aria-hidden="true"
    >
      <path className="miniglobe__sphere" d={paths.sphere} />
      <path className="miniglobe__graticule" d={paths.graticule} />
      <path className="miniglobe__land" d={paths.land} />
      <path className="miniglobe__target" d={paths.target} />
      <circle className="miniglobe__ping" cx="70" cy="70" r="10" />
      <circle className="miniglobe__dot" cx="70" cy="70" r="3.2" />
      <path className="miniglobe__rim" d={paths.sphere} />
    </svg>
  );
}
