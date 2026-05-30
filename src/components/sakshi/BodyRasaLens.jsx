import { useCallback, useRef, useState } from "react";
import { BODY_VIEWBOX, BodyClipPath, BodyFigure } from "./BodyFigure.jsx";
import { BRUSH_SIZES, RASA_PALETTE } from "../../data/bodyRasaPalette.js";

const { width: VB_W, height: VB_H } = BODY_VIEWBOX;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function coordsFromEvent(svg, e) {
  const rect = svg.getBoundingClientRect();
  const point = e.touches?.[0] ?? e;
  return {
    x: clamp((point.clientX - rect.left) / rect.width, 0, 1),
    y: clamp((point.clientY - rect.top) / rect.height, 0, 1),
  };
}

export default function BodyRasaLens({
  marks,
  onMark,
  onClearMarks,
  canRecord,
}) {
  const svgRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);

  const [colorId, setColorId] = useState(RASA_PALETTE[0].id);
  const [brushId, setBrushId] = useState("m");

  const activeColor = RASA_PALETTE.find((c) => c.id === colorId) ?? RASA_PALETTE[0];
  const activeBrush = BRUSH_SIZES.find((b) => b.id === brushId) ?? BRUSH_SIZES[1];

  const addMark = useCallback(
    (x, y) => {
      if (!canRecord) return;
      onMark({
        x,
        y,
        color: activeColor.color,
        stroke: activeColor.stroke,
        radius: activeBrush.radius,
      });
    },
    [activeBrush.radius, activeColor.color, activeColor.stroke, canRecord, onMark],
  );

  const paintAt = useCallback(
    (x, y) => {
      const last = lastPointRef.current;
      if (!last) {
        addMark(x, y);
        lastPointRef.current = { x, y };
        return;
      }
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx * dy);
      const step = activeBrush.radius / VB_W / 3;
      const steps = Math.max(1, Math.ceil(dist / step));
      for (let i = 0; i <= steps; i++) {
        addMark(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
      }
      lastPointRef.current = { x, y };
    },
    [activeBrush.radius, addMark],
  );

  const handlePointerDown = (e) => {
    if (!canRecord) return;
    e.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = null;
    if (svgRef.current) {
      try {
        svgRef.current.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      const { x, y } = coordsFromEvent(svgRef.current, e);
      paintAt(x, y);
    }
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current || !canRecord || !svgRef.current) return;
    e.preventDefault();
    const { x, y } = coordsFromEvent(svgRef.current, e);
    paintAt(x, y);
  };

  const endStroke = (e) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    if (svgRef.current && e.pointerId !== undefined) {
      try {
        svgRef.current.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Color palette */}
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8fa3b8]">
          Rasa palette
        </p>
        <div className="flex flex-wrap gap-1.5" role="listbox" aria-label="Rasa colors">
          {RASA_PALETTE.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              role="option"
              aria-selected={colorId === swatch.id}
              title={swatch.name}
              disabled={!canRecord}
              onClick={() => setColorId(swatch.id)}
              className={`h-7 w-7 rounded-full border-2 transition disabled:opacity-40 ${
                colorId === swatch.id
                  ? "border-white scale-110 shadow-md"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: swatch.color }}
            />
          ))}
        </div>
        <p className="mt-1 text-[10px] text-[#6b849c]">{activeColor.name}</p>
      </div>

      {/* Brush sizes + clear */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-[#8fa3b8]">
            Brush
          </span>
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.id}
              type="button"
              disabled={!canRecord}
              onClick={() => setBrushId(b.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition disabled:opacity-40 ${
                brushId === b.id
                  ? "border-[#6b9fd4] bg-[#2a3d50] text-[#e8edf2]"
                  : "border-white/10 bg-[#1a222c] text-[#8fa3b8]"
              }`}
              aria-label={`Brush size ${b.label}`}
            >
              {b.label}
            </button>
          ))}
        </div>
        {onClearMarks && marks.length > 0 && (
          <button
            type="button"
            onClick={onClearMarks}
            className="rounded-lg border border-white/10 px-2 py-1 text-[10px] text-[#8fa3b8] hover:border-white/25 hover:text-[#e8edf2]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Body canvas */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className={`mx-auto h-auto w-full max-w-[180px] touch-none select-none ${
          canRecord ? "cursor-crosshair" : "opacity-90"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
        role="img"
        aria-label="Human body — paint where you feel the rasa"
      >
        <defs>
          <BodyClipPath />
        </defs>

        <rect width={VB_W} height={VB_H} fill="#141b22" rx="10" />
        <BodyFigure />

        <g clipPath="url(#bodyRasaClip)">
          {marks.map((mark) => (
            <circle
              key={mark.id}
              cx={mark.x * VB_W}
              cy={mark.y * VB_H}
              r={mark.radius ?? 11}
              fill={mark.color ?? activeColor.color}
              fillOpacity={0.55}
              stroke={mark.stroke ?? activeColor.stroke}
              strokeWidth={1.5}
              strokeOpacity={0.85}
              className="pointer-events-none"
            />
          ))}
        </g>
      </svg>

      <p className="text-center text-xs text-[#8fa3b8]">
        {canRecord
          ? "Paint on the body with your chosen rasa color"
          : "Opens at Sakshi checkpoints"}
      </p>
    </div>
  );
}
