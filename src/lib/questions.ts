// MCQ data store - questions and answers for each year
export interface MCQ {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// In production this would come from a database
// For now we seed sample questions per year
export async function getQuestions(year: string): Promise<MCQ[]> {
  // Placeholder - real data will be loaded from DB or JSON files
  const { db } = await import("./db");
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
