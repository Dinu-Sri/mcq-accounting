"use client";

import React from "react";
import { useQuizStore } from "@/lib/store";
import { availablePapers, type PaperInfo } from "@/lib/papers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, ArrowRight } from "lucide-react";

export function PaperSelector() {
  const { setYear, startQuiz, resetQuiz } = useQuizStore();

  const handleSelectPaper = (paper: PaperInfo) => {
    resetQuiz();
    setYear(paper.year);
    startQuiz(paper.totalQuestions, paper.timeMinutes);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Sri Lanka Accounting MCQ Practice
        </h1>
        <p className="text-muted-foreground">
          Select a past paper below to start practicing. Timed quiz with instant
          results.
        </p>
      </div>

      <div className="space-y-4">
        {availablePapers.map((paper) => (
          <Card
            key={paper.year}
            className="cursor-pointer transition-all hover:border-primary/40 hover:shadow-md"
            onClick={() => handleSelectPaper(paper)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{paper.label}</CardTitle>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  {paper.totalQuestions} Questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {paper.timeMinutes} Minutes
                </span>
                <Badge variant="default">{paper.year}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        More past papers and question banks coming soon.
      </p>
    </div>
  );
}
