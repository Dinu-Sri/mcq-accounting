"use client";

import { useQuizStore } from "@/lib/store";
import { PaperSelector } from "@/components/quiz/paper-selector";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { getQuestions } from "@/lib/questions";
import { useEffect, useRef, useState } from "react";
import type { MCQ } from "@/lib/questions";

export default function HomePage() {
  const { phase, selectedYear, startQuiz } = useQuizStore();
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [loading, setLoading] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (phase !== "idle" && selectedYear && !startedRef.current) {
      startedRef.current = true;
      setLoading(true);
      getQuestions(selectedYear)
        .then((q) => {
          setQuestions(q);
          if (q.length > 0) {
            startQuiz(q.map((item) => item.id), 60);
          }
        })
        .catch(() => setQuestions([]))
        .finally(() => setLoading(false));
    }
    if (phase === "idle") {
      startedRef.current = false;
      setQuestions([]);
    }
  }, [phase, selectedYear, startQuiz]);

  if (phase === "idle") {
    return <PaperSelector />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0 && phase !== "idle") {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">
          No questions found for the selected paper.
        </p>
        <PaperSelector />
      </div>
    );
  }

  return <QuizRunner questions={questions} />;
}
