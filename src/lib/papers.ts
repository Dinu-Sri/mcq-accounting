// MCQ paper definitions with metadata
export interface PaperInfo {
  year: string;
  label: string;
  description: string;
  totalQuestions: number;
  timeMinutes: number;
}

export const availablePapers: PaperInfo[] = [
  {
    year: "2025",
    label: "2025 A/L Accounting (Sinhala)",
    description: "2025 G.C.E. Advanced Level Accounting Paper - Sinhala Medium",
    totalQuestions: 30,
    timeMinutes: 60,
  },
];
