/** Front-facing human figure — used for display and paint clip region */
export function BodyFigure({ className = "" }) {
  return (
    <g className={className} fill="#3d4f63" stroke="#6b849c" strokeWidth="1.5" strokeLinejoin="round">
      {/* Head */}
      <ellipse cx="100" cy="36" rx="24" ry="28" />
      {/* Neck */}
      <path d="M88 62 Q100 68 112 62 L110 78 Q100 82 90 78 Z" />
      {/* Torso */}
      <path d="M62 78 Q100 72 138 78 L148 168 Q100 176 52 168 Z" />
      {/* Left arm */}
      <path d="M62 82 Q38 95 28 130 Q24 155 32 175 Q40 188 48 180 L58 140 Q64 110 68 95 Z" />
      {/* Right arm */}
      <path d="M138 82 Q162 95 172 130 Q176 155 168 175 Q160 188 152 180 L142 140 Q136 110 132 95 Z" />
      {/* Left leg */}
      <path d="M72 168 L64 260 Q68 320 74 368 Q78 378 86 374 L94 280 Q98 220 96 168 Z" />
      {/* Right leg */}
      <path d="M128 168 L136 260 Q132 320 126 368 Q122 378 114 374 L106 280 Q102 220 104 168 Z" />
      {/* Hands */}
      <ellipse cx="36" cy="182" rx="10" ry="12" />
      <ellipse cx="164" cy="182" rx="10" ry="12" />
      {/* Feet */}
      <ellipse cx="80" cy="376" rx="16" ry="8" />
      <ellipse cx="120" cy="376" rx="16" ry="8" />
    </g>
  );
}

export const BODY_VIEWBOX = { width: 200, height: 400 };

export function BodyClipPath() {
  return (
    <clipPath id="bodyRasaClip">
      <ellipse cx="100" cy="36" rx="24" ry="28" />
      <path d="M88 62 Q100 68 112 62 L110 78 Q100 82 90 78 Z" />
      <path d="M62 78 Q100 72 138 78 L148 168 Q100 176 52 168 Z" />
      <path d="M62 82 Q38 95 28 130 Q24 155 32 175 Q40 188 48 180 L58 140 Q64 110 68 95 Z" />
      <path d="M138 82 Q162 95 172 130 Q176 155 168 175 Q160 188 152 180 L142 140 Q136 110 132 95 Z" />
      <path d="M72 168 L64 260 Q68 320 74 368 Q78 378 86 374 L94 280 Q98 220 96 168 Z" />
      <path d="M128 168 L136 260 Q132 320 126 368 Q122 378 114 374 L106 280 Q102 220 104 168 Z" />
      <ellipse cx="36" cy="182" rx="10" ry="12" />
      <ellipse cx="164" cy="182" rx="10" ry="12" />
      <ellipse cx="80" cy="376" rx="16" ry="8" />
      <ellipse cx="120" cy="376" rx="16" ry="8" />
    </clipPath>
  );
}
