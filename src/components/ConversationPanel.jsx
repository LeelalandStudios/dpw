import { CHARACTERS } from "../data/scenario.js";

function MessageBubble({ speaker, text, isLatest }) {
  const character = CHARACTERS[speaker];
  const isLeft = speaker === "maya";

  return (
    <div
      className={`flex gap-2 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
    >
      <div
        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: character.color }}
        aria-hidden
      >
        {character.name[0]}
      </div>
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-snug ${
          isLeft
            ? "rounded-tl-md bg-[#1e2a36] text-[#e8edf2]"
            : "rounded-tr-md bg-[#2a3d32] text-[#e8f0ea]"
        } ${isLatest ? "ring-1 ring-white/15" : ""}`}
      >
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
          {character.name}
        </p>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default function ConversationPanel({ messages, waitingForAdvance }) {
  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-white/8 bg-[#141b22]/80">
      <header className="shrink-0 border-b border-white/8 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[#8fa3b8]">
          Karta space
        </p>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-[#8fa3b8]">The scene is starting…</p>
        ) : (
          messages.map((msg, i) => (
            <MessageBubble
              key={`${msg.speaker}-${i}-${msg.text.slice(0, 12)}`}
              speaker={msg.speaker}
              text={msg.text}
              isLatest={i === messages.length - 1 && waitingForAdvance}
            />
          ))
        )}
      </div>

      {waitingForAdvance && messages.length > 0 && (
        <footer className="shrink-0 border-t border-white/8 px-4 py-2 text-center text-xs text-[#8fa3b8]">
          Tap continue below when you're ready for the next line
        </footer>
      )}
    </section>
  );
}
