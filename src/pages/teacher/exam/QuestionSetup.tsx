import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question } from '../../../types/exam';
import { getQuestions } from '../../../lib/api/exams';
import { deployExam } from '../../../lib/api/exam-deployment';
import QuestionSelection from './components/QuestionSelection';
import ExamDeployment from './components/ExamDeployment';
import QuestionPreview from './components/QuestionPreview';
import QuestionFilters from './components/QuestionFilters';
import { validateExam } from './components/ExamValidation';
import toast from 'react-hot-toast';

const QuestionSetup = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [filters, setFilters] = useState({
    batch: '',
    semester: '',
    difficulty: ''
  });

  useEffect(() => {
    loadQuestions();
  }, [subjectId]);

  const loadQuestions = async () => {
    if (!subjectId) return;
    
    try {
      const data = await getQuestions(subjectId);
      setQuestions(data);
    } catch (error) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filters.difficulty && q.difficulty !== filters.difficulty) return false;
    // Add more filters as needed
    return true;
  });

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestions([...selectedQuestions, { ...question, marks: 1 }]);
  };

  const handleRemoveQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
  };

  const handleUpdateMarks = (questionId: string, marks: number) => {
    setSelectedQuestions(selectedQuestions.map(q => 
      q.id === questionId ? { ...q, marks } : q
    ));
  };

  const handleDeployExam = async (examData: any) => {
    const validation = validateExam(selectedQuestions);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    try {
      await deployExam({
        ...examData,
        questions: selectedQuestions,
      });
      toast.success('Exam deployed successfully');
      navigate('/teacher');
    } catch (error) {
      toast.error('Failed to deploy exam');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading questions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Setup Exam Questions</h1>
      </div>

      <QuestionFilters filters={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionSelection
          questions={filteredQuestions}
          selectedQuestions={selectedQuestions}
          onSelectQuestion={handleSelectQuestion}
          onRemoveQuestion={handleRemoveQuestion}
          onUpdateMarks={handleUpdateMarks}
          onPreview={setPreviewQuestion}
        />
        
        <div className="space-y-6">
          <ExamDeployment
            selectedQuestions={selectedQuestions}
            subjectId={subjectId!}
            onDeploy={handleDeployExam}
          />
        </div>
      </div>

      {previewQuestion && (
        <QuestionPreview
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
        />
      )}
    </div>
  );
};

export default QuestionSetup;