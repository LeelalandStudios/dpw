import { useCallback, useMemo, useState } from "react";
import ConversationPanel from "./components/ConversationPanel.jsx";
import SakhiSpace from "./components/SakhiSpace.jsx";
import SakshiSpace from "./components/SakshiSpace.jsx";
import SceneComplete from "./components/SceneComplete.jsx";
import { SAMPLE_SCENARIO } from "./data/scenario.js";

function getStepKind(step) {
  return step?.type ?? "message";
}

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [plots, setPlots] = useState([]);
  const [bodyMarks, setBodyMarks] = useState([]);
  const [aifPicks, setAifPicks] = useState([]);
  const [sakshiRecordedStep, setSakshiRecordedStep] = useState(null);
  const [nudges, setNudges] = useState([]);
  const [choiceFeedback, setChoiceFeedback] = useState(null);
  const [sessionKey, setSessionKey] = useState(0);

  const steps = SAMPLE_SCENARIO.steps;
  const currentStep = steps[stepIndex];
  const kind = getStepKind(currentStep);

  const waitingForAdvance = kind === "message";
  const sakshiCheckpoint = kind === "plot";
  const canRecordSakshi = sakshiCheckpoint && sakshiRecordedStep !== stepIndex;
  const showChoice = kind === "choice" && !choiceFeedback;
  const isComplete = kind === "end";

  const plotPrompt = kind === "plot" ? currentStep.prompt : null;
  const currentAifPick = aifPicks.find((p) => p.stepIndex === stepIndex) ?? null;

  const advance = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [steps.length]);

  const recordSakshi = useCallback(
    (autoAdvance = true) => {
      setSakshiRecordedStep(stepIndex);
      if (autoAdvance) setTimeout(advance, 400);
    },
    [advance, stepIndex],
  );

  const handleContinue = () => {
    if (kind !== "message") return;

    setMessages((prev) => [
      ...prev,
      { speaker: currentStep.speaker, text: currentStep.text },
    ]);
    advance();
  };

  const handleQuadrantPlot = useCallback(
    ({ x, y }) => {
      if (!canRecordSakshi) return;
      const id = `${stepIndex}-q-${Date.now()}`;
      setPlots((prev) => [...prev, { id, x, y, stepIndex }]);
      recordSakshi(true);
    },
    [canRecordSakshi, recordSakshi, stepIndex],
  );

  const handleBodyMark = useCallback(
    ({ x, y, color, stroke, radius }) => {
      if (!sakshiCheckpoint) return;
      const id = `${stepIndex}-b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setBodyMarks((prev) => [
        ...prev,
        { id, x, y, stepIndex, color, stroke, radius },
      ]);
      if (canRecordSakshi) recordSakshi(false);
    },
    [canRecordSakshi, recordSakshi, sakshiCheckpoint, stepIndex],
  );

  const handleClearBodyMarks = useCallback(() => {
    setBodyMarks((prev) => prev.filter((m) => m.stepIndex !== stepIndex));
    if (sakshiRecordedStep === stepIndex) {
      setSakshiRecordedStep(null);
    }
  }, [sakshiRecordedStep, stepIndex]);

  const handleAifSelect = useCallback(
    (letterId) => {
      if (!canRecordSakshi) return;
      setAifPicks((prev) => [
        ...prev.filter((p) => p.stepIndex !== stepIndex),
        { stepIndex, letterId },
      ]);
      recordSakshi(true);
    },
    [canRecordSakshi, recordSakshi, stepIndex],
  );

  const handleChoice = (option) => {
    const isBest = option.id === currentStep.bestOptionId;
    const jordanReply = isBest
      ? "Got it — I'll try that."
      : "Hmm… okay, I'll say it.";

    setNudges((prev) => [
      ...prev,
      {
        id: `${stepIndex}-${option.id}`,
        yourWords: option.label,
        jordanReply,
      },
    ]);

    setChoiceFeedback({
      option,
      isBest,
      message: option.feedback,
    });

    setTimeout(() => {
      setChoiceFeedback(null);
      advance();
    }, 1800);
  };

  const handleRestart = () => {
    setStepIndex(0);
    setMessages([]);
    setPlots([]);
    setBodyMarks([]);
    setAifPicks([]);
    setSakshiRecordedStep(null);
    setNudges([]);
    setChoiceFeedback(null);
    setSessionKey((k) => k + 1);
  };

  const primaryAction = useMemo(() => {
    if (isComplete) return null;
    if (kind === "message") {
      return { label: "Continue", onClick: handleContinue, disabled: false };
    }
    if (kind === "plot" && sakshiRecordedStep === stepIndex) {
      return { label: "Continue", onClick: advance, disabled: false };
    }
    if (kind === "plot") {
      return {
        label: "Record in any Sakshi lens to continue",
        onClick: () => {},
        disabled: true,
      };
    }
    if (kind === "choice") {
      return {
        label: "Nudge Jordan in Sakhi space",
        onClick: () => {},
        disabled: true,
      };
    }
    return null;
  }, [
    advance,
    handleContinue,
    isComplete,
    kind,
    sakshiRecordedStep,
    stepIndex,
  ]);

  if (isComplete) {
    return (
      <SceneComplete
        step={currentStep}
        plotCount={plots.length}
        bodyMarkCount={bodyMarks.length}
        aifPickCount={aifPicks.length}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <div key={sessionKey} className="flex min-h-full flex-col">
      <header className="shrink-0 border-b border-white/8 bg-[#0f1419] px-4 py-4">
        <p className="text-xs font-medium uppercase tracking-wider text-[#6b9fd4]">
          Prototype
        </p>
        <h1 className="text-xl font-semibold text-[#e8edf2]">
          {SAMPLE_SCENARIO.title}
        </h1>
        <p className="mt-0.5 text-sm text-[#8fa3b8]">{SAMPLE_SCENARIO.subtitle}</p>
      </header>

      <main className="mx-auto grid w-full max-w-6xl min-h-0 flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-3 lg:items-stretch">
        <ConversationPanel
          messages={messages}
          waitingForAdvance={waitingForAdvance}
        />

        <SakshiSpace
          prompt={plotPrompt}
          highlight={kind === "plot"}
          canRecord={canRecordSakshi}
          plots={plots}
          bodyMarks={bodyMarks}
          aifSelection={currentAifPick}
          onQuadrantPlot={handleQuadrantPlot}
          onBodyMark={handleBodyMark}
          onClearBodyMarks={handleClearBodyMarks}
          sakshiCheckpoint={sakshiCheckpoint}
          onAifSelect={handleAifSelect}
        />

        <SakhiSpace
          active={showChoice}
          step={showChoice ? currentStep : null}
          nudges={nudges}
          choiceFeedback={choiceFeedback}
          onChoose={handleChoice}
          disabled={Boolean(choiceFeedback)}
        />
      </main>

      {primaryAction && (
        <footer className="shrink-0 border-t border-white/8 bg-[#0f1419] p-4">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="w-full rounded-xl bg-[#6b9fd4] py-3.5 text-sm font-semibold text-[#0f1419] transition enabled:hover:bg-[#8ab4e0] disabled:cursor-not-allowed disabled:bg-[#3a4f62] disabled:text-[#8fa3b8]"
            >
              {primaryAction.label}
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
