"use server";

// MCQ data store - questions and answers for each year
export interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

import { db } from "./db";

export async function getQuestions(year: string): Promise<MCQ[]> {
  const questions = await db.question.findMany({
    where: { year },
    orderBy: { id: "asc" },
  });
  
  return questions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options as string[],
    correctIndex: q.correctIndex,
    explanation: q.explanation ?? undefined,
  }));
}
