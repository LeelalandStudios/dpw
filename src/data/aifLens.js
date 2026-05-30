/** AIF lens rows — matches the Samkhya diagram structure */

export const AIF_ROWS = [
  {
    id: "visesa",
    sideLabel: "VIŚEṢA",
    title: "ASMITĀ",
    subtitle: "Manomaya Mandala",
    letters: [{ id: "A", label: "A", row: 0, col: 0 }],
  },
  {
    id: "avisesa",
    sideLabel: "AVIŚEṢA",
    title: "AHAMKĀRA",
    letters: [
      { id: "V", label: "V", row: 0, col: 0 },
      { id: "J", label: "J", row: 0, col: 1 },
      { id: "B", label: "B", row: 0, col: 2 },
      { id: "G", label: "G", row: 0, col: 3 },
      { id: "F", label: "F", row: 1, col: 1 },
      { id: "D", label: "D", row: 2, col: 1 },
      { id: "N", label: "N", row: 3, col: 1 },
    ],
    tShape: true,
  },
  {
    id: "linga",
    sideLabel: "LIṄGA",
    title: "BUDDHI",
    letters: [{ id: "M", label: "M", row: 0, col: 0 }],
  },
  {
    id: "alinga",
    sideLabel: "ALIṄGA",
    title: "MŪLA PRAKṚTI",
    subtitle: "PRADHĀNA",
    letters: [],
  },
];

export const AIF_LETTER_IDS = ["A", "V", "J", "B", "G", "F", "D", "N", "M"];
