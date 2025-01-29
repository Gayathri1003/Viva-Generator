import { supabase } from '../supabase';
import { Question, Exam, ExamSubmission } from '../../types';

// Questions API
export async function createQuestion(question: Omit<Question, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('questions')
    .insert(question)
    .select()
    .single();

  if (error) throw new Error('Failed to create question');
  return data;
}

export async function getQuestions(subjectId: string) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('subject_id', subjectId);

  if (error) throw new Error('Failed to fetch questions');
  return data;
}

// Exams API
export async function createExam(exam: Omit<Exam, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('exams')
    .insert(exam)
    .select()
    .single();

  if (error) throw new Error('Failed to create exam');
  return data;
}

export async function getExams(subjectId: string) {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      exam_questions (
        question_id,
        marks
      )
    `)
    .eq('subject_id', subjectId);

  if (error) throw new Error('Failed to fetch exams');
  return data;
}

export async function getActiveExams(studentId: string) {
  const { data, error } = await supabase
    .from('exams')
    .select(`
      *,
      exam_questions (
        questions (
          id,
          text,
          options
        ),
        marks
      )
    `)
    .eq('is_active', true)
    .gte('end_time', new Date().toISOString());

  if (error) throw new Error('Failed to fetch active exams');
  return data;
}

// Exam Submissions API
export async function submitExam(submission: Omit<ExamSubmission, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('exam_submissions')
    .insert(submission)
    .select()
    .single();

  if (error) throw new Error('Failed to submit exam');
  return data;
}

export async function getExamResults(examId: string) {
  const { data, error } = await supabase
    .from('exam_submissions')
    .select(`
      *,
      students (
        users (
          name,
          username
        )
      )
    `)
    .eq('exam_id', examId);

  if (error) throw new Error('Failed to fetch exam results');
  return data;
}