"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useQuizStore } from "@/lib/store";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, X } from "lucide-react";

interface QuizRunnerProps {
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
}

export function QuizRunner({ questions }: QuizRunnerProps) {
  const {
    phase,
    timeRemaining,
    answers,
    currentQuestionIndex,
    answerQuestion,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    finishQuiz,
    startReview,
    tick,
  } = useQuizStore();

  // Custom confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (phase !== "in-progress") return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [phase, tick]);

  const currentAnswer = answers[currentQuestionIndex];
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter((a) => a.selectedIndex !== null).length;
  const progress = (answeredCount / answers.length) * 100;

  const handleAnswerSelect = useCallback(
    (optionIndex: number) => {
      if (phase !== "in-progress") return;
      if (!currentQuestion) return;
      answerQuestion(currentQuestion.id, optionIndex);
    },
    [phase, currentQuestion, answerQuestion]
  );

  const handleFinish = useCallback(() => {
    if (phase !== "in-progress") return;
    const unanswered = answers.filter((a) => a.selectedIndex === null).length;
    if (unanswered > 0) {
      setUnansweredCount(unanswered);
      setConfirmOpen(true);
      return;
    }
    finishQuiz();
  }, [phase, answers, finishQuiz]);

  const handleConfirmFinish = useCallback(() => {
    setConfirmOpen(false);
    finishQuiz();
  }, [finishQuiz]);

  if (phase === "finished") {
    return <QuizResult questions={questions} onReview={startReview} />;
  }

  if (phase === "reviewing") {
    return <QuizReview questions={questions} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header bar */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-card border px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Timer className="h-4 w-4" />
          <span
            className={
              timeRemaining < 300 ? "text-danger font-bold" : ""
            }
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Q {currentQuestionIndex + 1} / {questions.length}
        </div>
        <Button size="sm" variant="outline" onClick={handleFinish}>
          Finish
        </Button>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="mb-6" />

      {/* Question */}
      <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-lg font-medium leading-relaxed">
          {currentQuestion?.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion?.options.map((option, idx) => {
          const isSelected = currentAnswer?.selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(idx)}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-150 ${
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/30 hover:bg-accent/50"
              }`}
            >
              <span className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium border ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm leading-relaxed">{option}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>

        {/* Question number chips */}
        <div className="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-[280px]">
          {answers.map((ans, idx) => (
            <button
              key={ans.questionId}
              onClick={() => goToQuestion(idx)}
              className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                idx === currentQuestionIndex
                  ? "bg-primary text-primary-foreground"
                  : ans.selectedIndex !== null
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-muted text-muted-foreground border border-border"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={nextQuestion}
          disabled={currentQuestionIndex === answers.length - 1}
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Custom Confirm Finish Dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl border bg-card p-6 shadow-lg mx-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold">Finish Quiz?</h3>
              </div>
              <button onClick={() => setConfirmOpen(false)} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              You have <span className="font-semibold text-foreground">{unansweredCount} unanswered question{unansweredCount > 1 ? "s" : ""}</span>.
              {" "}Are you sure you want to finish the quiz?
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Continue Quiz
              </Button>
              <Button variant="default" onClick={handleConfirmFinish}>
                Finish Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizResult({
  questions,
  onReview,
}: {
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
  onReview: () => void;
}) {
  const { answers, resetQuiz } = useQuizStore();

  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  answers.forEach((ans) => {
    if (ans.selectedIndex === null) {
      unanswered++;
    } else {
      const question = questions.find((q) => q.id === ans.questionId);
      if (question && ans.selectedIndex === question.correctIndex) {
        correct++;
      } else {
        wrong++;
      }
    }
  });

  const total = answers.length;
  const score = Math.round((correct / total) * 100);

  return (
    <div className="mx-auto max-w-md text-center">
      <div className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          {score >= 50 ? (
            <CheckCircle className="h-10 w-10 text-success" />
          ) : (
            <AlertCircle className="h-10 w-10 text-warning" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-1">Quiz Complete!</h2>
        <p className="text-muted-foreground mb-6">
          Here&apos;s how you did
        </p>

        <div className="mb-6 text-5xl font-bold text-primary">{score}%</div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-lg bg-success/10 p-3">
            <div className="text-lg font-bold text-success">{correct}</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </div>
          <div className="rounded-lg bg-danger/10 p-3">
            <div className="text-lg font-bold text-danger">{wrong}</div>
            <div className="text-xs text-muted-foreground">Wrong</div>
          </div>
          <div className="rounded-lg bg-muted p-3">
            <div className="text-lg font-bold text-muted-foreground">
              {unanswered}
            </div>
            <div className="text-xs text-muted-foreground">Skipped</div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onReview} size="lg">
            Review Answers
          </Button>
          <Button variant="outline" onClick={resetQuiz} size="lg">
            Try Another Paper
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuizReview({
  questions,
}: {
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
  }>;
}) {
  const {
    answers,
    currentQuestionIndex,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    resetQuiz,
  } = useQuizStore();

  const currentAnswer = answers[currentQuestionIndex];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Q {currentQuestionIndex + 1} / {questions.length}
        </div>
        <Button variant="outline" size="sm" onClick={resetQuiz}>
          Back to Papers
        </Button>
      </div>

      {/* Question number chips */}
      <div className="mb-6 flex flex-wrap gap-1">
        {answers.map((ans, idx) => {
          const q = questions[idx];
          const isCorrect =
            ans.selectedIndex !== null && ans.selectedIndex === q.correctIndex;
          const isWrong =
            ans.selectedIndex !== null && ans.selectedIndex !== q.correctIndex;
          const isSkipped = ans.selectedIndex === null;

          return (
            <button
              key={ans.questionId}
              onClick={() => goToQuestion(idx)}
              className={`h-7 w-7 rounded-md text-xs font-medium transition-colors ${
                idx === currentQuestionIndex
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : isCorrect
                  ? "bg-success/20 text-success"
                  : isWrong
                  ? "bg-danger/20 text-danger"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question */}
      <div className="mb-6 rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-lg font-medium leading-relaxed">
          {currentQuestion?.question}
        </p>
      </div>

      {/* Options with correct/wrong highlighting */}
      <div className="space-y-3 mb-6">
        {currentQuestion?.options.map((option, idx) => {
          const isCorrectOption = idx === currentQuestion.correctIndex;
          const isSelected = currentAnswer?.selectedIndex === idx;
          const isWrongSelection = isSelected && !isCorrectOption;

          let borderClass = "border-border bg-card";
          if (isCorrectOption) {
            borderClass = "border-success bg-success/5 ring-1 ring-success/30";
          } else if (isWrongSelection) {
            borderClass = "border-danger bg-danger/5 ring-1 ring-danger/30";
          }

          return (
            <div key={idx} className={`rounded-xl border p-4 ${borderClass}`}>
              <span className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-medium border ${
                    isCorrectOption
                      ? "border-success bg-success text-white"
                      : isWrongSelection
                      ? "border-danger bg-danger text-white"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm leading-relaxed">{option}</span>
                {isCorrectOption && (
                  <CheckCircle className="ml-auto h-5 w-5 text-success shrink-0" />
                )}
                {isWrongSelection && (
                  <AlertCircle className="ml-auto h-5 w-5 text-danger shrink-0" />
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {currentQuestion?.explanation && (
        <div className="mb-6 rounded-xl border bg-accent/30 p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            EXPLANATION
          </p>
          <p className="text-sm">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          variant="outline"
          onClick={nextQuestion}
          disabled={currentQuestionIndex === answers.length - 1}
        >
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
