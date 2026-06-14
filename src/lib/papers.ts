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
  {
    year: "2024",
    label: "2024 A/L Accounting",
    description: "2024 G.C.E. Advanced Level Accounting Paper",
    totalQuestions: 50,
    timeMinutes: 90,
  },
  {
    year: "2023",
    label: "2023 A/L Accounting",
    description: "2023 G.C.E. Advanced Level Accounting Paper",
    totalQuestions: 50,
    timeMinutes: 90,
  },
  {
    year: "2022",
    label: "2022 A/L Accounting",
    description: "2022 G.C.E. Advanced Level Accounting Paper",
    totalQuestions: 50,
    timeMinutes: 90,
  },
  {
    year: "2021",
    label: "2021 A/L Accounting",
    description: "2021 G.C.E. Advanced Level Accounting Paper",
    totalQuestions: 50,
    timeMinutes: 90,
  },
  {
    year: "2020",
    label: "2020 A/L Accounting",
    description: "2020 G.C.E. Advanced Level Accounting Paper",
    totalQuestions: 50,
    timeMinutes: 90,
  },
];
