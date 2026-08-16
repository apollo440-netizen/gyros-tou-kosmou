import { useCallback, useEffect, useRef } from 'react';
import { getFlagUrl } from '../Flag/flagAssets';
import { playScratchSound } from '../../audio/soundManager';
import './ScratchFlag.css';

export type CoverKind = 'clouds' | 'ice' | 'sand' | 'leaves' | 'paint';

export const COVER_KINDS: CoverKind[] = ['clouds', 'ice', 'sand', 'leaves', 'paint'];

/** Ετικέτες σε αιτιατική με άρθρο, για την προτροπή «Ξύσε …» */
export const COVER_LABELS: Record<CoverKind, string> = {
  clouds: 'τα σύννεφα',
  ice: 'τον πάγο',
  sand: 'την άμμο',
  leaves: 'τα φύλλα',
  paint: 'την μπογιά',
};

interface ScratchFlagProps {
  iso2: string;
  cover: CoverKind;
  /** Κλήση με το ποσοστό (0–1) που έχει αποκαλυφθεί */
  onRevealChange?: (fraction: number) => void;
  /** Μετά την απάντηση: το κάλυμμα σβήνει και το ξύσιμο κλειδώνει */
  revealAll?: boolean;
}

const GRID_COLS = 24;
const GRID_ROWS = 18;
/** Ακτίνα «γόμας» ως ποσοστό του πλάτους */
const ERASER_RADIUS_FRAC = 0.075;

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function drawCover(ctx: CanvasRenderingContext2D, w: number, h: number, kind: CoverKind): void {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);
  switch (kind) {
    case 'clouds': {
      ctx.fillStyle = '#cfe4f5';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 42; i++) {
        const x = rand(0, w);
        const y = rand(0, h);
        const r = rand(w * 0.05, w * 0.14);
        ctx.fillStyle = `rgba(255,255,255,${rand(0.75, 1)})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'ice': {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#d8eef8');
      grad.addColorStop(1, '#a8cfe8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      for (let i = 0; i < 26; i++) {
        ctx.lineWidth = rand(1, 3);
        const x = rand(0, w);
        const y = rand(0, h);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + rand(-w * 0.2, w * 0.2), y + rand(-h * 0.2, h * 0.2));
        ctx.stroke();
      }
      break;
    }
    case 'sand': {
      ctx.fillStyle = '#e6c98f';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(160,120,60,0.5)' : 'rgba(255,235,190,0.6)';
        ctx.fillRect(rand(0, w), rand(0, h), 2.2, 2.2);
      }
      for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = 'rgba(170,130,70,0.35)';
        ctx.lineWidth = rand(4, 9);
        const y = rand(0, h);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.quadraticCurveTo(w / 2, y + rand(-20, 20), w, y);
        ctx.stroke();
      }
      break;
    }
    case 'leaves': {
      ctx.fillStyle = '#3f7a46';
      ctx.fillRect(0, 0, w, h);
      const greens = ['#5c9c52', '#7fb069', '#4a8a4f', '#98c07a', '#2f6b3c'];
      for (let i = 0; i < 70; i++) {
        const x = rand(0, w);
        const y = rand(0, h);
        const rx = rand(w * 0.03, w * 0.07);
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rand(0, Math.PI * 2));
        ctx.fillStyle = greens[Math.floor(rand(0, greens.length))];
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, rx * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(30,60,35,0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-rx, 0);
        ctx.lineTo(rx, 0);
        ctx.stroke();
        ctx.restore();
      }
      break;
    }
    case 'paint': {
      ctx.fillStyle = '#dcd9e2';
      ctx.fillRect(0, 0, w, h);
      const colors = ['#ff6b6b', '#ffb703', '#2a9d54', '#7c5cbf', '#2274a5', '#e670a8'];
      for (let i = 0; i < 28; i++) {
        ctx.fillStyle = colors[Math.floor(rand(0, colors.length))];
        const x = rand(0, w);
        const y = rand(0, h);
        ctx.beginPath();
        ctx.arc(x, y, rand(w * 0.04, w * 0.12), 0, Math.PI * 2);
        ctx.fill();
        for (let d = 0; d < 4; d++) {
          ctx.beginPath();
          ctx.arc(x + rand(-w * 0.1, w * 0.1), y + rand(-h * 0.1, h * 0.1), rand(2, 7), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      break;
    }
  }
}

/**
 * Σημαία κρυμμένη κάτω από «ξυστό» κάλυμμα σε καμβά. Το παιδί σβήνει
 * με το δάχτυλο (pointer events + destination-out)· το ποσοστό
 * αποκάλυψης μετριέται με πλέγμα κελιών.
 */
export function ScratchFlag({ iso2, cover, onRevealChange, revealAll = false }: ScratchFlagProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<boolean[]>(new Array(GRID_COLS * GRID_ROWS).fill(false));
  const scratchingRef = useRef(false);
  const lastSoundRef = useRef(0);
  const flagUrl = getFlagUrl(iso2);

  // Σχεδίαση καλύμματος στο μέγεθος του στοιχείου
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCover(ctx, canvas.width, canvas.height, cover);
    gridRef.current = new Array(GRID_COLS * GRID_ROWS).fill(false);
    onRevealChange?.(0);
    // Νέα σημαία/κάλυμμα → νέο ξύσιμο από την αρχή
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iso2, cover]);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      const xFrac = (clientX - rect.left) / rect.width;
      const yFrac = (clientY - rect.top) / rect.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ήχος υλικού — αραιωμένος ώστε η γρήγορη κίνηση να μη γεννά
      // εκατοντάδες κόμβους ήχου· οι κόκκοι αλληλοκαλύπτονται αρμονικά
      const now = performance.now();
      if (now - lastSoundRef.current > 65) {
        lastSoundRef.current = now;
        playScratchSound(cover);
      }

      const r = canvas.width * ERASER_RADIUS_FRAC;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(xFrac * canvas.width, yFrac * canvas.height, r, 0, Math.PI * 2);
      ctx.fill();

      // Ενημέρωση πλέγματος αποκάλυψης
      const grid = gridRef.current;
      const rFracX = ERASER_RADIUS_FRAC;
      const rFracY = (r / canvas.height);
      for (let gy = 0; gy < GRID_ROWS; gy++) {
        for (let gx = 0; gx < GRID_COLS; gx++) {
          if (grid[gy * GRID_COLS + gx]) continue;
          const cx = (gx + 0.5) / GRID_COLS;
          const cy = (gy + 0.5) / GRID_ROWS;
          const dx = (cx - xFrac) / rFracX;
          const dy = (cy - yFrac) / rFracY;
          if (dx * dx + dy * dy <= 1) grid[gy * GRID_COLS + gx] = true;
        }
      }
      const cleared = grid.reduce((acc, v) => acc + (v ? 1 : 0), 0);
      onRevealChange?.(cleared / grid.length);
    },
    [onRevealChange, cover],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (revealAll) return;
      scratchingRef.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      scratchAt(e.clientX, e.clientY);
    },
    [revealAll, scratchAt],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!scratchingRef.current || revealAll) return;
      scratchAt(e.clientX, e.clientY);
    },
    [revealAll, scratchAt],
  );

  const stopScratching = useCallback(() => {
    scratchingRef.current = false;
  }, []);

  return (
    <div className="scratchflag" ref={wrapRef}>
      {flagUrl && (
        <img className="scratchflag__flag" src={flagUrl} alt="" draggable={false} />
      )}
      <canvas
        ref={canvasRef}
        className={`scratchflag__cover ${revealAll ? 'scratchflag__cover--revealed' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopScratching}
        onPointerLeave={stopScratching}
        onPointerCancel={stopScratching}
        aria-label="Ξύσε το κάλυμμα για να δεις τη σημαία"
        role="img"
      />
    </div>
  );
}
