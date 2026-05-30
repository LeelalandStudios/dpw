import { AIF_ROWS } from "../../data/aifLens.js";
import { isPrimaryPointer } from "../../utils/pointer.js";

function LetterButton({ letter, selected, disabled, onSelect }) {
  const handlePointerDown = (e) => {
    if (disabled || !isPrimaryPointer(e)) return;
    e.preventDefault();
    onSelect(letter.id);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      className={`flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 text-sm font-semibold transition touch-manipulation sm:h-12 sm:w-12 ${
        selected
          ? "border-[#1e3a5f] bg-[#1e3a5f] text-white"
          : "border-[#2d4a3e] bg-white text-[#1a1a1a] active:border-[#e67e22] disabled:opacity-50"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
      aria-pressed={selected}
      aria-label={`Select ${letter.label}`}
    >
      {letter.label}
    </button>
  );
}

function TShapeLetters({ letters, selectedId, canRecord, onSelect }) {
  const byId = Object.fromEntries(letters.map((l) => [l.id, l]));

  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {["V", "J", "B", "G"].map((id) => {
          const letter = byId[id];
          if (!letter) return null;
          return (
            <LetterButton
              key={id}
              letter={letter}
              selected={selectedId === id}
              disabled={!canRecord}
              onSelect={onSelect}
            />
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-2">
        {["F", "D", "N"].map((id) => {
          const letter = byId[id];
          if (!letter) return null;
          return (
            <LetterButton
              key={id}
              letter={letter}
              selected={selectedId === id}
              disabled={!canRecord}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

function RowLetters({ row, selectedId, canRecord, onSelect }) {
  if (row.tShape) {
    return (
      <TShapeLetters
        letters={row.letters}
        selectedId={selectedId}
        canRecord={canRecord}
        onSelect={onSelect}
      />
    );
  }

  if (row.letters.length === 0) {
    return <div className="min-h-[2.5rem]" aria-hidden />;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-2">
      {row.letters.map((letter) => (
        <LetterButton
          key={letter.id}
          letter={letter}
          selected={selectedId === letter.id}
          disabled={!canRecord}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default function AIFLens({ selection, onSelect, canRecord, marked }) {
  const selectedId = selection?.letterId ?? null;

  return (
    <div className="flex flex-col">
      <div className="overflow-hidden rounded-lg border-2 border-[#e67e22]/80 bg-[#f4f6f8]">
        {AIF_ROWS.map((row, index) => (
          <div
            key={row.id}
            className={`grid grid-cols-[3.5rem_1fr] sm:grid-cols-[4.5rem_1fr] ${
              index < AIF_ROWS.length - 1 ? "border-b-2 border-[#e67e22]/70" : ""
            }`}
          >
            <div className="flex items-center justify-center border-r border-[#e67e22]/50 bg-[#fafafa] px-0.5 py-3">
              <span
                className="text-[8px] font-bold leading-tight tracking-wide text-[#e67e22] sm:text-[9px]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {row.sideLabel}
              </span>
            </div>

            <div className="min-w-0 px-2 py-2 sm:px-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-bold text-[#1e3a5f] sm:text-xs">
                  {row.title}
                </p>
                {row.subtitle && row.id === "visesa" && (
                  <p className="text-right text-[10px] font-semibold text-[#1e3a5f] sm:text-[11px]">
                    {row.subtitle}
                  </p>
                )}
              </div>
              {row.subtitle && row.id === "alinga" && (
                <p className="text-[10px] font-semibold text-[#1e3a5f]/90 sm:text-[11px]">
                  {row.subtitle}
                </p>
              )}
              <RowLetters
                row={row}
                selectedId={selectedId}
                canRecord={canRecord}
                onSelect={onSelect}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-[#8fa3b8]">
        {!canRecord && "Opens at Sakshi checkpoints"}
        {canRecord && marked && "✓ Marked — switch tab if other lenses need you"}
        {canRecord && !marked && "Select one letter for this lens"}
      </p>
    </div>
  );
}
