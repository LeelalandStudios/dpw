import { useState } from "react";
import AIFLens from "./sakshi/AIFLens.jsx";
import BodyRasaLens from "./sakshi/BodyRasaLens.jsx";
import QuadrantLens from "./sakshi/QuadrantLens.jsx";

const LENSES = [
  { id: "quadrant", label: "4 Quadrant" },
  { id: "body", label: "Body Rasa" },
  { id: "aif", label: "AIF" },
];

export default function SakshiSpace({
  prompt,
  highlight,
  canRecord,
  plots,
  bodyMarks,
  aifSelection,
  onQuadrantPlot,
  onBodyMark,
  onClearBodyMarks,
  sakshiCheckpoint,
  onAifSelect,
}) {
  const [activeLens, setActiveLens] = useState("quadrant");

  return (
    <section
      className={`flex min-h-[280px] min-w-0 flex-col rounded-2xl border bg-[#141b22]/80 transition lg:min-h-0 lg:flex-1 ${
        highlight ? "border-[#6b9fd4]/50 shadow-[0_0_24px_rgba(107,159,212,0.15)]" : "border-white/8"
      }`}
    >
      <header className="shrink-0 border-b border-white/8 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[#8fa3b8]">
          Sakshi space
        </p>
        {prompt && (
          <p className="mt-1 text-sm text-[#c5d4e3]">{prompt}</p>
        )}

        <div
          className="mt-3 flex gap-1 rounded-lg bg-[#0f1419] p-1"
          role="tablist"
          aria-label="Sakshi lenses"
        >
          {LENSES.map((lens) => (
            <button
              key={lens.id}
              type="button"
              role="tab"
              aria-selected={activeLens === lens.id}
              onClick={() => setActiveLens(lens.id)}
              className={`flex-1 rounded-md px-2 py-1.5 text-[10px] font-semibold transition sm:text-xs ${
                activeLens === lens.id
                  ? "bg-[#6b9fd4] text-[#0f1419]"
                  : "text-[#8fa3b8] hover:text-[#c5d4e3]"
              }`}
            >
              {lens.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeLens === "quadrant" && (
          <div role="tabpanel">
            <QuadrantLens
              plots={plots}
              onPlot={onQuadrantPlot}
              canRecord={canRecord}
            />
          </div>
        )}

        {activeLens === "body" && (
          <div role="tabpanel">
            <BodyRasaLens
              marks={bodyMarks}
              onMark={onBodyMark}
              onClearMarks={onClearBodyMarks}
              canRecord={sakshiCheckpoint}
            />
          </div>
        )}

        {activeLens === "aif" && (
          <div role="tabpanel">
            <AIFLens
              selection={aifSelection}
              onSelect={onAifSelect}
              canRecord={canRecord}
            />
          </div>
        )}
      </div>
    </section>
  );
}
