import { CHARACTERS } from "../data/scenario.js";

const JORDAN = CHARACTERS.jordan;

function NudgeBubble({ text, fromYou }) {
  return (
    <div className={`flex gap-2 ${fromYou ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{
          backgroundColor: fromYou ? "#6b9fd4" : JORDAN.color,
        }}
        aria-hidden
      >
        {fromYou ? "Y" : JORDAN.name[0]}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug ${
          fromYou
            ? "rounded-tr-md bg-[#2a3d50] text-[#e8edf2]"
            : "rounded-tl-md bg-[#2a3d32] text-[#e8f0ea]"
        }`}
      >
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
          {fromYou ? "You" : JORDAN.name}
        </p>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function SakhiSpace({
  active,
  step,
  nudges,
  choiceFeedback,
  onChoose,
  disabled,
}) {
  const isHighlighted = active || Boolean(choiceFeedback);

  return (
    <section
      className={`flex min-h-[240px] min-w-0 flex-col rounded-2xl border bg-[#141b22]/80 transition lg:min-h-0 lg:flex-1 ${
        isHighlighted
          ? "border-[#c9a07c]/40 shadow-[0_0_20px_rgba(201,160,124,0.12)]"
          : "border-white/8"
      }`}
    >
      <header className="shrink-0 border-b border-white/8 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[#c9a07c]">
          Sakhi space
        </p>
        <p className="mt-0.5 text-sm text-[#8fa3b8]">
          You and {JORDAN.name} — nudge him when the moment calls for it.
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-3">
        {nudges.length === 0 && !active && (
          <p className="text-center text-sm text-[#8fa3b8]">
            Watch Karta space. When Jordan needs your voice, options will appear here.
          </p>
        )}

        {nudges.map((nudge) => (
          <div key={nudge.id} className="flex flex-col gap-2">
            <NudgeBubble text={nudge.yourWords} fromYou />
            {nudge.jordanReply && (
              <NudgeBubble text={nudge.jordanReply} fromYou={false} />
            )}
          </div>
        ))}

        {choiceFeedback && (
          <p
            className={`rounded-xl border px-3 py-2 text-sm ${
              choiceFeedback.isBest
                ? "border-[#4a8f6a]/40 bg-[#1e2f28] text-[#b8e0c8]"
                : "border-[#8f6a4a]/40 bg-[#2f281e] text-[#e0d4b8]"
            }`}
          >
            {choiceFeedback.message}
          </p>
        )}

        {active && step && (
          <div className="mt-1 border-t border-white/8 pt-3">
            <p className="text-sm font-medium text-[#e8edf2]">{step.prompt}</p>
            {step.hint && (
              <p className="mt-1 text-xs text-[#8fa3b8]">{step.hint}</p>
            )}
            <ul className="mt-3 flex flex-col gap-2">
              {step.options.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChoose(option)}
                    className="w-full rounded-xl border border-[#c9a07c]/25 bg-[#2a2820] px-3 py-2.5 text-left text-sm leading-snug text-[#e8edf2] transition hover:border-[#c9a07c]/50 hover:bg-[#332e24] disabled:opacity-50"
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {active && (
        <footer className="shrink-0 border-t border-white/8 px-4 py-2 text-center text-xs text-[#c9a07c]">
          Choose what to nudge {JORDAN.name} to say
        </footer>
      )}
    </section>
  );
}
