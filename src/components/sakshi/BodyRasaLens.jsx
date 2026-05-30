import { useCallback, useRef, useState } from "react";
import { BODY_VIEWBOX, BodyClipPath, BodyFigure } from "./BodyFigure.jsx";
import { BRUSH_SIZES, RASA_PALETTE } from "../../data/bodyRasaPalette.js";
import {
  getNormalizedPoint,
  isPrimaryPointer,
} from "../../utils/pointer.js";

const { width: VB_W, height: VB_H } = BODY_VIEWBOX;

export default function BodyRasaLens({
  marks,
  onMark,
  onClearMarks,
  canRecord,
  marked,
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
      const dist = Math.hypot(dx, dy);
      const step = activeBrush.radius / VB_W / 3;
      const steps = Math.max(1, Math.ceil(dist / step));
      for (let i = 0; i <= steps; i++) {
        addMark(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
      }
      lastPointRef.current = { x, y };
    },
    [activeBrush.radius, addMark],
  );

  const paintFromEvent = useCallback(
    (event) => {
      if (!svgRef.current) return;
      const point = getNormalizedPoint(event, svgRef.current);
      if (!point) return;
      paintAt(point.x, point.y);
    },
    [paintAt],
  );

  const handlePointerDown = (e) => {
    if (!canRecord || !isPrimaryPointer(e)) return;
    e.preventDefault();
    drawingRef.current = true;
    lastPointRef.current = null;
    try {
      svgRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    paintFromEvent(e);
  };

  const handlePointerMove = (e) => {
    if (!drawingRef.current || !canRecord) return;
    e.preventDefault();
    paintFromEvent(e);
  };

  const endStroke = (e) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      svgRef.current?.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#8fa3b8]">
          Rasa palette
        </p>
        <div className="flex flex-wrap gap-2" role="listbox" aria-label="Rasa colors">
          {RASA_PALETTE.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              role="option"
              aria-selected={colorId === swatch.id}
              title={swatch.name}
              disabled={!canRecord}
              onClick={() => setColorId(swatch.id)}
              className={`h-11 w-11 shrink-0 rounded-full border-2 transition touch-manipulation disabled:opacity-40 ${
                colorId === swatch.id
                  ? "border-white scale-110 shadow-md"
                  : "border-transparent active:scale-105"
              }`}
              style={{ backgroundColor: swatch.color, WebkitTapHighlightColor: "transparent" }}
            />
          ))}
        </div>
        <p className="mt-1 text-[10px] text-[#6b849c]">{activeColor.name}</p>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-[#8fa3b8]">
            Brush
          </span>
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.id}
              type="button"
              disabled={!canRecord}
              onClick={() => setBrushId(b.id)}
              className={`flex h-11 min-w-11 items-center justify-center rounded-lg border px-3 text-sm font-bold transition touch-manipulation disabled:opacity-40 ${
                brushId === b.id
                  ? "border-[#6b9fd4] bg-[#2a3d50] text-[#e8edf2]"
                  : "border-white/10 bg-[#1a222c] text-[#8fa3b8]"
              }`}
              style={{ WebkitTapHighlightColor: "transparent" }}
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
            className="min-h-11 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#8fa3b8] touch-manipulation active:border-white/25 active:text-[#e8edf2]"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            Clear
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className={`mx-auto block h-auto w-full max-w-[200px] select-none touch-none ${
          canRecord ? "cursor-crosshair" : "opacity-90"
        }`}
        style={{ WebkitTapHighlightColor: "transparent", touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endStroke}
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
        {!canRecord && "Opens at Sakshi checkpoints"}
        {canRecord && marked && "✓ Marked — you can keep painting or switch lenses"}
        {canRecord && !marked && "Touch and drag on the body to paint"}
      </p>
    </div>
  );
}
