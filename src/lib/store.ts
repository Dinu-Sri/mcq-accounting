"use client";

import { create } from "zustand";

export interface QuizAnswer {
  questionId: number;
  selectedIndex: number | null;
}

export type QuizPhase = "idle" | "selecting" | "in-progress" | "finished" | "reviewing";

interface QuizState {
  phase: QuizPhase;
  selectedYear: string | null;
  timeRemaining: number; // seconds
  answers: QuizAnswer[];
  currentQuestionIndex: number;

  // Actions
  setYear: (year: string) => void;
  startQuiz: (questionIds: number[], timeMinutes: number) => void;
  answerQuestion: (questionId: number, selectedIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  finishQuiz: () => void;
  startReview: () => void;
  resetQuiz: () => void;
  tick: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  phase: "idle",
  selectedYear: null,
  timeRemaining: 0,
  answers: [],
  currentQuestionIndex: 0,

  setYear: (year) => set({ selectedYear: year, phase: "selecting" }),

  startQuiz: (questionIds, timeMinutes) =>
    set({
      phase: "in-progress",
      timeRemaining: timeMinutes * 60,
      answers: questionIds.map((id: number) => ({
        questionId: id,
        selectedIndex: null,
      })),
      currentQuestionIndex: 0,
    }),

  answerQuestion: (questionId, selectedIndex) =>
    set((state) => ({
      answers: state.answers.map((a) =>
        a.questionId === questionId ? { ...a, selectedIndex } : a
      ),
    })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.answers.length - 1
      ),
    })),

  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  goToQuestion: (index) => set({ currentQuestionIndex: index }),

  finishQuiz: () => set({ phase: "finished" }),

  startReview: () => set({ phase: "reviewing", currentQuestionIndex: 0 }),

  resetQuiz: () =>
    set({
      phase: "idle",
      selectedYear: null,
      timeRemaining: 0,
      answers: [],
      currentQuestionIndex: 0,
    }),

  tick: () =>
    set((state) => {
      if (state.timeRemaining <= 1) {
        return { timeRemaining: 0, phase: "finished" };
      }
      return { timeRemaining: state.timeRemaining - 1 };
    }),
}));
