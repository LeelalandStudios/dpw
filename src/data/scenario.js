/**
 * Scenario script — extend with more acts / branching later.
 * Step types: message | plot | choice | end
 */

export const CHARACTERS = {
  maya: { id: "maya", name: "Maya", color: "#7c9cbf" },
  jordan: { id: "jordan", name: "Jordan", color: "#c9a07c" },
};

export const CHART_AXES = {
  xNegative: "Not Received",
  xPositive: "Received Fully",
  yNegative: "Non-Expressive",
  yPositive: "Fully Expressive",
};

/** Top-left → top-right → bottom-left → bottom-right (grid order) */
export const QUADRANTS = [
  { id: "q2", name: "Quadrant of Challenge" },
  { id: "q1", name: "Quadrant of Nurturance" },
  { id: "q3", name: "Quadrant of Search" },
  { id: "q4", name: "Quadrant of Learning" },
];

export const SAMPLE_SCENARIO = {
  id: "late-plans",
  title: "The changed plans",
  subtitle: "Karta watches the scene · Sakshi tracks your feeling · Sakhi nudges Jordan.",
  steps: [
    {
      type: "message",
      speaker: "maya",
      text: "Hey — I know we said dinner at 7, but I'm still stuck at work.",
    },
    {
      type: "message",
      speaker: "jordan",
      text: "Again? This is the third time this month.",
    },
    {
      type: "message",
      speaker: "maya",
      text: "I'm sorry. It's not like I'm doing this on purpose.",
    },
    {
      type: "plot",
      prompt: "Plot how this moment lands for you while you watch.",
    },
    {
      type: "message",
      speaker: "jordan",
      text: "It still feels like I'm not a priority.",
    },
    {
      type: "message",
      speaker: "maya",
      text: "That's not fair. You know how stressful things have been.",
    },
    {
      type: "choice",
      prompt: "Jordan is about to reply. What might help de-escalate?",
      hint: "Pick what you'd nudge Jordan to say.",
      options: [
        {
          id: "attack",
          label: "“You always make excuses.”",
          feedback: "That tends to escalate blame cycles.",
        },
        {
          id: "feelings",
          label: "“I hear you're overwhelmed — I still felt let down.”",
          feedback: "Naming both experiences can open space to repair.",
        },
        {
          id: "shutdown",
          label: "“Whatever. Do what you want.”",
          feedback: "Withdrawal often leaves the conflict unresolved.",
        },
      ],
      bestOptionId: "feelings",
    },
    {
      type: "message",
      speaker: "jordan",
      text: "I hear you're overwhelmed — I still felt let down when plans changed last minute.",
    },
    {
      type: "message",
      speaker: "maya",
      text: "...yeah. I didn't think about how that landed on you.",
    },
    {
      type: "plot",
      prompt: "How does it feel now?",
    },
    {
      type: "choice",
      prompt: "Maya is quiet. What might you nudge Jordan to say?",
      options: [
        {
          id: "defend",
          label: "“You're being dramatic.”",
          feedback: "Invalidating the other person's feeling usually shuts dialogue down.",
        },
        {
          id: "own",
          label: "“I can see why that hurt. Can we find another night?”",
          feedback: "Acknowledgment plus a repair step moves toward resolution.",
        },
        {
          id: "silent",
          label: "(Say nothing and wait)",
          feedback: "Sometimes pause helps — here Maya may need a bridge back in.",
        },
      ],
      bestOptionId: "own",
    },
    {
      type: "message",
      speaker: "maya",
      text: "I can see why that hurt. Can we find another night — my treat?",
    },
    {
      type: "message",
      speaker: "jordan",
      text: "Yeah. Thursday works for me.",
    },
    {
      type: "plot",
      prompt: "One last check-in before the scene ends.",
    },
    {
      type: "end",
      title: "Scene complete",
      body: "You tracked your reactions on the matrix and practiced nudging toward repair.",
    },
  ],
};
