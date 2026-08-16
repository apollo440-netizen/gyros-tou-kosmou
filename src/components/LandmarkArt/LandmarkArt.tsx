import { useId, type ReactNode } from 'react';
import './LandmarkArt.css';

interface LandmarkArtProps {
  landmarkId: string;
  className?: string;
  /** Περιγραφή για πρόσβαση — κενή όσο το μνημείο είναι «ερώτηση» */
  ariaLabel?: string;
}

interface Scene {
  skyTop: string;
  skyBottom: string;
  ground: string;
  art: ReactNode;
}

const GROUND_Y = 112;

/** Σειρά από αψίδες (για Κολοσσαίο, ακουαδούκτα κ.λπ.) */
function Arches({
  y,
  count,
  x0,
  gap,
  w,
  h,
  fill,
}: {
  y: number;
  count: number;
  x0: number;
  gap: number;
  w: number;
  h: number;
  fill: string;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={`M${x0 + i * gap} ${y + h} v${-h + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 v${h - w / 2} Z`}
          fill={fill}
        />
      ))}
    </g>
  );
}

const SCENES: Record<string, Scene> = {
  eiffel: {
    skyTop: '#ffd9a0',
    skyBottom: '#ffeed9',
    ground: '#9fc776',
    art: (
      <g>
        <circle cx="40" cy="34" r="13" fill="#ffb703" opacity="0.9" />
        <path
          d="M110 14 C109 44 100 80 74 112 L90 112 C100 96 107 84 110 72 C113 84 120 96 130 112 L146 112 C120 80 111 44 110 14 Z"
          fill="#5b4a3f"
        />
        <rect x="94" y="58" width="32" height="5" rx="2" fill="#5b4a3f" />
        <rect x="84" y="86" width="52" height="6" rx="2" fill="#5b4a3f" />
        <path d="M97 112 a13 13 0 0 1 26 0 Z" fill="#ffeed9" />
        <line x1="110" y1="14" x2="110" y2="6" stroke="#5b4a3f" strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },
  colosseum: {
    skyTop: '#aee1ff',
    skyBottom: '#eaf7ff',
    ground: '#d8c48f',
    art: (
      <g>
        <path
          d="M32 112 V64 q0 -12 14 -12 h60 v-8 q40 2 68 18 q14 8 14 20 v30 Z"
          fill="#e0be85"
        />
        <path d="M32 64 h74 v-20 q-74 0 -74 20 Z" fill="#cfa768" />
        <Arches y={58} count={8} x0={42} gap={21} w={11} h={16} fill="#8a6a42" />
        <Arches y={86} count={8} x0={42} gap={21} w={11} h={18} fill="#8a6a42" />
        <rect x="32" y="76" width="156" height="4" fill="#cfa768" />
      </g>
    ),
  },
  acropolis: {
    skyTop: '#bfe4ff',
    skyBottom: '#fff3dd',
    ground: '#b9a06c',
    art: (
      <g>
        <path d="M18 112 q30 -26 90 -26 q62 0 94 26 Z" fill="#a98f5e" />
        <rect x="62" y="74" width="96" height="6" fill="#ece5d2" />
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={66 + i * 13.5} y={48} width={7} height={26} rx={1.5} fill="#ece5d2" />
        ))}
        <rect x="60" y="42" width="100" height="7" fill="#e2d9c2" />
        <path d="M56 42 L110 24 L164 42 Z" fill="#ece5d2" stroke="#cbbf9f" strokeWidth="1.5" />
        <rect x="58" y="80" width="104" height="5" fill="#d9d0b8" />
      </g>
    ),
  },
  greatwall: {
    skyTop: '#ffe3b3',
    skyBottom: '#fff6e6',
    ground: '#7fb069',
    art: (
      <g>
        <path d="M0 112 q40 -50 80 -34 q50 20 90 -12 q30 -22 50 -18 v64 Z" fill="#8fbf76" />
        <path
          d="M18 100 q40 -34 76 -26 q46 10 84 -22 l8 10 q-40 34 -88 24 q-34 -8 -72 24 Z"
          fill="#b9a27c"
        />
        <rect x="96" y="52" width="18" height="26" rx="2" fill="#a08662" />
        <rect x="93" y="48" width="24" height="7" rx="2" fill="#8a7050" />
      </g>
    ),
  },
  liberty: {
    skyTop: '#bfe4ff',
    skyBottom: '#e8f6ff',
    ground: '#7fa8c9',
    art: (
      <g>
        <path d="M0 112 h220 v28 h-220 Z" fill="#5f8fb4" />
        <rect x="86" y="92" width="48" height="20" rx="3" fill="#c9b18a" />
        <rect x="94" y="84" width="32" height="10" rx="2" fill="#b89d74" />
        <path d="M96 84 q14 -30 4 -46 q10 -8 20 0 q-6 18 4 46 Z" fill="#7fc8a9" />
        <circle cx="110" cy="34" r="9" fill="#7fc8a9" />
        {Array.from({ length: 5 }, (_, i) => (
          <line
            key={i}
            x1={110 + (i - 2) * 6}
            y1={24 - (2 - Math.abs(i - 2)) * 2}
            x2={110 + (i - 2) * 9}
            y2={14 - (2 - Math.abs(i - 2)) * 3}
            stroke="#7fc8a9"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
        <line x1="128" y1="60" x2="140" y2="22" stroke="#7fc8a9" strokeWidth="7" strokeLinecap="round" />
        <path d="M134 20 q6 -8 12 0 q-6 4 -12 0 Z" fill="#ffb703" />
        <circle cx="140" cy="16" r="5" fill="#ffcf4d" />
      </g>
    ),
  },
  pyramids: {
    skyTop: '#ffd9a0',
    skyBottom: '#fff1d6',
    ground: '#e8c988',
    art: (
      <g>
        <circle cx="184" cy="30" r="14" fill="#ff9f1c" />
        <path d="M20 112 L74 40 L128 112 Z" fill="#dfae6a" />
        <path d="M74 40 L96 112 L128 112 Z" fill="#c08e4d" />
        <path d="M110 112 L152 62 L194 112 Z" fill="#dfae6a" />
        <path d="M152 62 L168 112 L194 112 Z" fill="#c08e4d" />
        <path d="M30 112 L52 86 L74 112 Z" fill="#dfae6a" opacity="0.9" />
      </g>
    ),
  },
  bigben: {
    skyTop: '#c9d9f2',
    skyBottom: '#f0e9f7',
    ground: '#9aa86e',
    art: (
      <g>
        <rect x="30" y="84" width="70" height="28" rx="2" fill="#b8a27c" />
        {Array.from({ length: 5 }, (_, i) => (
          <rect key={i} x={36 + i * 13} y={90} width={6} height={16} fill="#8a7657" />
        ))}
        <rect x="120" y="40" width="26" height="72" fill="#c9b183" />
        <rect x="117" y="34" width="32" height="8" fill="#b39a6b" />
        <path d="M117 34 L133 8 L149 34 Z" fill="#8a7657" />
        <circle cx="133" cy="54" r="10" fill="#fffbe8" stroke="#8a7657" strokeWidth="2.5" />
        <line x1="133" y1="54" x2="133" y2="47" stroke="#5b4a3f" strokeWidth="2" strokeLinecap="round" />
        <line x1="133" y1="54" x2="138" y2="56" stroke="#5b4a3f" strokeWidth="2" strokeLinecap="round" />
        <rect x="126" y="72" width="14" height="34" rx="2" fill="#8a7657" opacity="0.35" />
      </g>
    ),
  },
  tajmahal: {
    skyTop: '#ffd3e0',
    skyBottom: '#fff3ea',
    ground: '#a9c9a0',
    art: (
      <g>
        <rect x="58" y="76" width="104" height="36" rx="2" fill="#f6f1e7" />
        <path d="M92 76 v-8 a18 18 0 0 1 36 0 v8 Z" fill="#efe8da" />
        <path d="M110 22 q16 10 14 26 q-1 14 -14 20 q-13 -6 -14 -20 q-2 -16 14 -26 Z" fill="#f6f1e7" stroke="#dcd2bd" strokeWidth="1.5" />
        <line x1="110" y1="22" x2="110" y2="14" stroke="#c9b183" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M100 90 v-6 a10 10 0 0 1 20 0 v6 Z" fill="#d8ccb4" />
        {[70, 150].map((cx) => (
          <g key={cx}>
            <path d={`M${cx} 66 q9 6 8 14 q-1 8 -8 11 q-7 -3 -8 -11 q-1 -8 8 -14 Z`} fill="#f2ecdf" />
          </g>
        ))}
        {[38, 182].map((cx) => (
          <g key={cx}>
            <rect x={cx - 4} y={52} width={8} height={60} rx={3} fill="#f2ecdf" />
            <circle cx={cx} cy={50} r={5.5} fill="#e6ddc8" />
          </g>
        ))}
        <rect x="88" y="118" width="44" height="6" rx="3" fill="#8fc4d9" />
      </g>
    ),
  },
  redeemer: {
    skyTop: '#ffd9a0',
    skyBottom: '#ffeedd',
    ground: '#6fae7f',
    art: (
      <g>
        <path d="M30 112 q28 -20 52 -12 q30 8 58 -4 q30 -12 50 4 v12 Z" fill="#5f9b6f" />
        <path d="M78 112 q4 -46 32 -58 q28 12 32 58 Z" fill="#7c9a6d" />
        <rect x="104" y="46" width="12" height="10" fill="#e8e2d0" />
        <rect x="106" y="16" width="8" height="34" rx="3" fill="#f2ecdf" />
        <rect x="86" y="24" width="48" height="7" rx="3.5" fill="#f2ecdf" />
        <circle cx="110" cy="14" r="5" fill="#f2ecdf" />
      </g>
    ),
  },
  opera: {
    skyTop: '#ffdf9e',
    skyBottom: '#fff3d9',
    ground: '#4f89b8',
    art: (
      <g>
        <path d="M0 112 h220 v28 h-220 Z" fill="#3f7aa8" />
        <rect x="40" y="102" width="140" height="12" rx="3" fill="#d8cdb4" />
        <path d="M52 102 Q66 58 108 54 Q88 74 84 102 Z" fill="#fdfaf1" stroke="#d9d0ba" strokeWidth="1.5" />
        <path d="M86 102 Q104 62 142 62 Q118 80 114 102 Z" fill="#f7f2e4" stroke="#d9d0ba" strokeWidth="1.5" />
        <path d="M116 102 Q136 72 168 76 Q146 88 142 102 Z" fill="#fdfaf1" stroke="#d9d0ba" strokeWidth="1.5" />
        <circle cx="34" cy="30" r="11" fill="#ffb703" opacity="0.85" />
      </g>
    ),
  },
  stbasil: {
    skyTop: '#cfe3ff',
    skyBottom: '#f2ecff',
    ground: '#b0575c',
    art: (
      <g>
        <rect x="60" y="80" width="100" height="32" rx="3" fill="#e8dcc8" />
        <rect x="98" y="42" width="24" height="42" fill="#efe5d2" />
        <path d="M96 42 L110 16 L124 42 Z" fill="#d9822b" />
        <circle cx="110" cy="14" r="3.5" fill="#ffcf4d" />
        {[74, 146].map((cx, i) => (
          <g key={cx}>
            <rect x={cx - 9} y={62} width={18} height={22} fill="#efe5d2" />
            <path
              d={`M${cx} 34 q13 10 8 22 q-3 8 -8 8 q-5 0 -8 -8 q-5 -12 8 -22 Z`}
              fill={i === 0 ? '#c94f4f' : '#3f8f5f'}
            />
            <line x1={cx} y1={34} x2={cx} y2={28} stroke="#b8933f" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        ))}
        <path d="M60 80 h100 v-6 q-50 -10 -100 0 Z" fill="#d8c8ac" />
        <Arches y={92} count={5} x0={68} gap={18} w={9} h={14} fill="#a5525a" />
      </g>
    ),
  },
  fuji: {
    skyTop: '#cfe8ff',
    skyBottom: '#ffe8ef',
    ground: '#8fbf8f',
    art: (
      <g>
        <path d="M22 112 L110 26 L198 112 Z" fill="#7d94b8" />
        <path d="M78 58 L110 26 L142 58 q-8 8 -16 2 q-8 8 -16 0 q-8 8 -16 2 q-8 6 -16 -4 Z" fill="#ffffff" />
        <rect x="52" y="84" width="6" height="28" fill="#c94f4f" />
        <rect x="84" y="84" width="6" height="28" fill="#c94f4f" />
        <rect x="44" y="80" width="54" height="6" rx="3" fill="#c94f4f" />
        <rect x="50" y="90" width="42" height="5" rx="2.5" fill="#c94f4f" />
      </g>
    ),
  },
  windmill: {
    skyTop: '#bfe4ff',
    skyBottom: '#eef8ff',
    ground: '#79ab5e',
    art: (
      <g>
        <path d="M92 52 h36 l8 60 h-52 Z" fill="#8a6a4f" />
        <path d="M88 52 a22 14 0 0 1 44 0 Z" fill="#5b4a3f" />
        <g stroke="#e8e2d0" strokeWidth="7" strokeLinecap="round">
          <line x1="110" y1="46" x2="140" y2="16" />
          <line x1="110" y1="46" x2="80" y2="16" />
          <line x1="110" y1="46" x2="140" y2="76" />
          <line x1="110" y1="46" x2="80" y2="76" />
        </g>
        <circle cx="110" cy="46" r="5" fill="#c94f4f" />
        <rect x="102" y="92" width="16" height="20" rx="7" fill="#5b4a3f" />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={16 + i * 18} cy={i % 2 === 0 ? 122 : 128} r="4" fill={i % 3 === 0 ? '#e85555' : i % 3 === 1 ? '#ffb703' : '#e670a8'} />
        ))}
      </g>
    ),
  },
  chichen: {
    skyTop: '#aee1ff',
    skyBottom: '#eafff2',
    ground: '#7fb069',
    art: (
      <g>
        {[
          { x: 40, y: 96, w: 140 },
          { x: 54, y: 80, w: 112 },
          { x: 68, y: 64, w: 84 },
          { x: 82, y: 48, w: 56 },
        ].map((s, i) => (
          <rect key={i} x={s.x} y={s.y} width={s.w} height={17} fill={i % 2 ? '#c2a878' : '#d3bb8b'} />
        ))}
        <rect x="94" y="28" width="32" height="20" fill="#d3bb8b" />
        <rect x="100" y="34" width="20" height="14" fill="#7a6244" />
        <path d="M98 112 L110 24 L122 112 Z" fill="#b59a6c" />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={101} y1={40 + i * 12} x2={119} y2={40 + i * 12} stroke="#8a7050" strokeWidth="1.5" opacity="0.6" />
        ))}
      </g>
    ),
  },
  machu: {
    skyTop: '#cfe8e0',
    skyBottom: '#f2fff6',
    ground: '#5f9b6f',
    art: (
      <g>
        <path d="M118 112 Q128 30 158 22 Q184 44 190 112 Z" fill="#6fae7f" />
        <path d="M138 60 Q152 34 158 30 Q168 40 174 60 Z" fill="#88c295" opacity="0.7" />
        <path d="M16 112 Q40 60 88 54 Q118 52 138 68 L146 112 Z" fill="#7fb977" />
        {[86, 74, 62].map((y, i) => (
          <path key={y} d={`M${34 + i * 8} ${y + 26} q${44 - i * 6} -10 ${76 - i * 12} 0`} stroke="#5c8a54" strokeWidth="5" fill="none" />
        ))}
        <rect x="58" y="66" width="16" height="12" fill="#cfc5ad" />
        <rect x="82" y="58" width="14" height="11" fill="#c2b89e" />
        <rect x="70" y="80" width="18" height="12" fill="#cfc5ad" />
      </g>
    ),
  },
  petra: {
    skyTop: '#ffd9a0',
    skyBottom: '#ffe9cf',
    ground: '#c98a5e',
    art: (
      <g>
        <path d="M0 0 h70 q10 60 -6 112 h-64 Z" fill="#a35f43" />
        <path d="M220 0 h-70 q-10 60 6 112 h64 Z" fill="#a35f43" />
        <rect x="78" y="46" width="64" height="66" fill="#d99a6c" />
        <path d="M74 46 h72 l-8 -12 h-56 Z" fill="#c9855a" />
        {[86, 102, 118, 134].map((x) => (
          <rect key={x} x={x - 3} y={52} width={6} height={38} rx={2.5} fill="#b06f47" />
        ))}
        <path d="M100 112 v-14 a10 10 0 0 1 20 0 v14 Z" fill="#8a4f33" />
        <circle cx="110" cy="26" r="6" fill="#c9855a" />
      </g>
    ),
  },
  burj: {
    skyTop: '#ffe3b3',
    skyBottom: '#d9f2ff',
    ground: '#d8c48f',
    art: (
      <g>
        <rect x="42" y="92" width="26" height="20" fill="#9fb8c9" />
        <rect x="152" y="86" width="30" height="26" fill="#9fb8c9" />
        <rect x="98" y="70" width="24" height="42" fill="#aac8dd" />
        <rect x="102" y="44" width="16" height="30" fill="#bcd6e8" />
        <rect x="106" y="24" width="8" height="24" fill="#cde3f2" />
        <line x1="110" y1="24" x2="110" y2="8" stroke="#8aa8bd" strokeWidth="3" strokeLinecap="round" />
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={100} y1={76 + i * 5} x2={120} y2={76 + i * 5} stroke="#89a9bf" strokeWidth="1.4" opacity="0.7" />
        ))}
      </g>
    ),
  },
  hagia: {
    skyTop: '#cfe3ff',
    skyBottom: '#ffeede',
    ground: '#a9917a',
    art: (
      <g>
        <rect x="62" y="78" width="96" height="34" rx="2" fill="#d9a08a" />
        <path d="M70 78 a40 26 0 0 1 80 0 Z" fill="#c98a74" />
        <path d="M58 92 a14 12 0 0 1 24 0 Z" fill="#c98a74" />
        <path d="M138 92 a14 12 0 0 1 24 0 Z" fill="#c98a74" />
        <line x1="110" y1="52" x2="110" y2="44" stroke="#8a6a52" strokeWidth="2.5" strokeLinecap="round" />
        {[40, 180].map((x) => (
          <g key={x}>
            <rect x={x - 3} y={40} width={6} height={72} fill="#e0c8b0" />
            <path d={`M${x - 5} 40 L${x} 26 L${x + 5} 40 Z`} fill="#8a6a52" />
          </g>
        ))}
        <Arches y={90} count={5} x0={72} gap={18} w={9} h={14} fill="#8a5a48" />
      </g>
    ),
  },
  brandenburg: {
    skyTop: '#cfe3ff',
    skyBottom: '#fff3dd',
    ground: '#9aa86e',
    art: (
      <g>
        <rect x="46" y="44" width="128" height="12" fill="#cfc5a5" />
        <rect x="52" y="34" width="116" height="12" fill="#dbd2b3" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={54 + i * 21.5} y={56} width={9} height={56} fill="#cfc5a5" />
        ))}
        <rect x="46" y="30" width="128" height="6" fill="#c2b892" />
        <rect x="88" y="14" width="44" height="16" rx="2" fill="#b8ae8a" />
        <path d="M96 14 q4 -8 10 -4 q2 -4 8 -2 q6 -2 8 4 q6 0 4 6 Z" fill="#5f7050" />
      </g>
    ),
  },
  sagrada: {
    skyTop: '#ffd9c9',
    skyBottom: '#fff0e0',
    ground: '#b9a06c',
    art: (
      <g>
        {[
          { x: 76, h: 76 },
          { x: 96, h: 92 },
          { x: 124, h: 92 },
          { x: 144, h: 76 },
        ].map((t) => (
          <g key={t.x}>
            <path d={`M${t.x - 8} 112 L${t.x} ${112 - t.h} L${t.x + 8} 112 Z`} fill="#c9a06c" />
            <circle cx={t.x} cy={112 - t.h - 3} r={3} fill="#d9b98a" />
          </g>
        ))}
        <rect x="70" y="88" width="80" height="24" fill="#b98d5c" />
        <path d="M98 112 v-10 a12 12 0 0 1 24 0 v10 Z" fill="#7a5c3a" />
        {Array.from({ length: 5 }, (_, i) => (
          <circle key={i} cx={80 + i * 15} cy={96} r={2.5} fill="#7a5c3a" opacity="0.7" />
        ))}
      </g>
    ),
  },
  cntower: {
    skyTop: '#cfe8ff',
    skyBottom: '#eef8ff',
    ground: '#7fa8c9',
    art: (
      <g>
        <rect x="36" y="90" width="24" height="22" fill="#9fb8c9" />
        <rect x="160" y="84" width="28" height="28" fill="#9fb8c9" />
        <path d="M104 112 L108 40 h4 L116 112 Z" fill="#c9d2d9" />
        <ellipse cx="110" cy="38" rx="16" ry="9" fill="#aebfcb" />
        <ellipse cx="110" cy="35" rx="16" ry="7" fill="#dfe8ee" />
        <rect x="107" y="12" width="6" height="18" fill="#c9d2d9" />
        <line x1="110" y1="12" x2="110" y2="2" stroke="#aebfcb" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ),
  },
  moai: {
    skyTop: '#ffd9a0',
    skyBottom: '#ffeedd',
    ground: '#6fae7f',
    art: (
      <g>
        <path d="M0 112 h220 v28 h-220 Z" fill="#4f89b8" opacity="0.45" />
        {[62, 110, 158].map((cx, i) => (
          <g key={cx} transform={`translate(${cx} ${58 + (i === 1 ? -8 : 0)})`}>
            <path
              d="M-16 54 v-34 q0 -18 16 -18 q16 0 16 18 v34 Z"
              fill="#8a8d90"
            />
            <path d="M-16 22 q4 -6 10 -4 M6 18 q6 -2 10 4" stroke="#6d7073" strokeWidth="3" fill="none" strokeLinecap="round" />
            <rect x="-10" y="24" width="7" height="4" rx="2" fill="#6d7073" />
            <rect x="3" y="24" width="7" height="4" rx="2" fill="#6d7073" />
            <path d="M-4 30 q4 8 8 0 v10 q-4 4 -8 0 Z" fill="#75787b" />
          </g>
        ))}
      </g>
    ),
  },
  angkor: {
    skyTop: '#ffd9a0',
    skyBottom: '#ffeccf',
    ground: '#6fae7f',
    art: (
      <g>
        <rect x="40" y="94" width="140" height="18" fill="#8a7050" />
        {[
          { x: 70, h: 40 },
          { x: 110, h: 62 },
          { x: 150, h: 40 },
        ].map((t) => (
          <g key={t.x}>
            <path
              d={`M${t.x - 13} 94 L${t.x - 9} ${94 - t.h * 0.55} L${t.x} ${94 - t.h} L${t.x + 9} ${94 - t.h * 0.55} L${t.x + 13} 94 Z`}
              fill="#7a6244"
            />
            <path
              d={`M${t.x - 6} 94 L${t.x} ${94 - t.h * 0.8} L${t.x + 6} 94 Z`}
              fill="#93794f"
            />
          </g>
        ))}
        <rect x="36" y="118" width="148" height="6" rx="3" fill="#8fc4d9" />
      </g>
    ),
  },
  matterhorn: {
    skyTop: '#bfe4ff',
    skyBottom: '#eef8ff',
    ground: '#7fb069',
    art: (
      <g>
        <path d="M34 112 L96 34 L118 58 L106 62 L150 112 Z" fill="#7d94b8" />
        <path d="M96 34 L118 58 L106 62 L84 50 Z" fill="#ffffff" />
        <path d="M84 50 L96 34 L80 58 Z" fill="#e8f2fb" />
        <path d="M128 112 L162 70 L196 112 Z" fill="#93a9c9" />
        <path d="M154 80 L162 70 L172 82 q-9 6 -18 -2 Z" fill="#ffffff" />
        <rect x="46" y="98" width="18" height="14" fill="#8a6a4f" />
        <path d="M42 98 L55 88 L68 98 Z" fill="#5b4a3f" />
      </g>
    ),
  },
};

/**
 * Εικονογραφημένο μνημείο — διαδικαστικό SVG σε ενιαίο καρτουνίστικο
 * στυλ (ουρανός, έδαφος, σιλουέτα). Κανένα εξωτερικό αρχείο εικόνας.
 */
export function LandmarkArt({ landmarkId, className = '', ariaLabel }: LandmarkArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const scene = SCENES[landmarkId];
  if (!scene) return null;
  const skyId = `lm-sky-${uid}`;

  return (
    <svg
      className={`landmark-art ${className}`}
      viewBox="0 0 220 140"
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={scene.skyTop} />
          <stop offset="100%" stopColor={scene.skyBottom} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="220" height="140" rx="14" fill={`url(#${skyId})`} />
      <path
        d={`M0 ${GROUND_Y} h220 v14 a14 14 0 0 1 -14 14 h-192 a14 14 0 0 1 -14 -14 Z`}
        fill={scene.ground}
      />
      {scene.art}
      <rect x="0.75" y="0.75" width="218.5" height="138.5" rx="13.5" fill="none" stroke="rgba(8,33,56,0.25)" strokeWidth="1.5" />
    </svg>
  );
}

export function hasLandmarkArt(landmarkId: string): boolean {
  return landmarkId in SCENES;
}
