// Update the ExamQuestion interface
export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
  marks: number;
  created_at?: string;
  question?: Question; // For joined queries
}

// Add a new interface for questions with marks
export interface QuestionWithMarks extends Question {
  marks: number;
}