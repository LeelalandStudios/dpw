import { useCallback, useRef, useState } from "react";
import { CHART_AXES, QUADRANTS } from "../../data/scenario.js";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function AxisLabel({ children, className = "" }) {
  return (
    <span
      className={`pointer-events-none absolute z-20 whitespace-nowrap rounded px-1 py-0.5 text-[9px] font-medium leading-tight text-[#8fa3b8] sm:text-[10px] ${className}`}
    >
      {children}
    </span>
  );
}

export default function QuadrantLens({ plots, onPlot, canRecord }) {
  const chartRef = useRef(null);
  const [hover, setHover] = useState(null);

  const placeFromEvent = useCallback(
    (clientX, clientY) => {
      if (!canRecord || !chartRef.current) return;
      const rect = chartRef.current.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((clientY - rect.top) / rect.height, 0, 1);
      onPlot({ x, y });
    },
    [canRecord, onPlot],
  );

  const handlePointer = (e) => {
    e.preventDefault();
    const point = e.touches?.[0] ?? e;
    placeFromEvent(point.clientX, point.clientY);
  };

  const handleMove = (e) => {
    if (!chartRef.current || !canRecord) return;
    const rect = chartRef.current.getBoundingClientRect();
    const point = e.touches?.[0] ?? e;
    setHover({
      x: clamp((point.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((point.clientY - rect.top) / rect.height, 0, 1),
    });
  };

  return (
    <div className="flex flex-col">
      <div
        ref={chartRef}
        role="img"
        aria-label="Four quadrant matrix"
        className={`relative mx-auto aspect-square w-full max-w-sm touch-none select-none rounded-xl ${
          canRecord ? "cursor-crosshair" : "cursor-default opacity-90"
        }`}
        onClick={handlePointer}
        onPointerDown={handlePointer}
        onPointerMove={handleMove}
        onPointerLeave={() => setHover(null)}
      >
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 overflow-hidden rounded-xl border border-white/12">
          {QUADRANTS.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-center border border-white/6 bg-[#1a222c]/95 p-2"
            >
              <span className="text-center text-[10px] font-medium leading-tight text-[#c5d4e3] sm:text-xs">
                {q.name}
              </span>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/25" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/25" />
        </div>

        <AxisLabel className="left-1/2 top-[6%] -translate-x-1/2 -translate-y-1/2 bg-[#141b22]/90">
          {CHART_AXES.yPositive}
        </AxisLabel>
        <AxisLabel className="left-1/2 bottom-[6%] -translate-x-1/2 translate-y-1/2 bg-[#141b22]/90">
          {CHART_AXES.yNegative}
        </AxisLabel>
        <AxisLabel className="left-[6%] top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#141b22]/90">
          {CHART_AXES.xNegative}
        </AxisLabel>
        <AxisLabel className="right-[6%] top-1/2 translate-x-1/2 -translate-y-1/2 bg-[#141b22]/90">
          {CHART_AXES.xPositive}
        </AxisLabel>

        {plots.map((plot, i) => (
          <span
            key={plot.id}
            className="pointer-events-none absolute z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40"
            style={{
              left: `${plot.x * 100}%`,
              top: `${plot.y * 100}%`,
              backgroundColor: `rgba(107, 159, 212, ${0.25 + (i / Math.max(plots.length, 1)) * 0.5})`,
            }}
          />
        ))}

        {canRecord && hover && (
          <span
            className="pointer-events-none absolute z-30 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6b9fd4]/60 ring-2 ring-white/50"
            style={{ left: `${hover.x * 100}%`, top: `${hover.y * 100}%` }}
          />
        )}
      </div>

      <p className="mt-3 text-center text-xs text-[#8fa3b8]">
        {canRecord
          ? "Tap the matrix to mark this moment"
          : "Opens at Sakshi checkpoints"}
      </p>
    </div>
  );
}
