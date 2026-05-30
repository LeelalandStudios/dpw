export default function SceneComplete({
  step,
  plotCount,
  bodyMarkCount = 0,
  aifPickCount = 0,
  onRestart,
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <div className="max-w-md rounded-2xl border border-white/10 bg-[#1a222c] p-8">
        <p className="text-sm font-medium uppercase tracking-wider text-[#6b9fd4]">
          {step.title}
        </p>
        <p className="mt-3 text-lg leading-relaxed text-[#c5d4e3]">{step.body}</p>
        <p className="mt-4 text-sm text-[#8fa3b8]">
          Sakshi: {plotCount} quadrant plot{plotCount === 1 ? "" : "s"},{" "}
          {bodyMarkCount} body mark{bodyMarkCount === 1 ? "" : "s"},{" "}
          {aifPickCount} AIF selection{aifPickCount === 1 ? "" : "s"}.
        </p>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-xl bg-[#6b9fd4] px-6 py-3 text-sm font-semibold text-[#0f1419] transition hover:bg-[#8ab4e0]"
      >
        Play again
      </button>
    </div>
  );
}
