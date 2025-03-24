// src/pages/teacher/QuestionGenerator.tsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import MethodSelector from './components/MethodSelector';
import DocumentUploader from './components/DocumentUploader';
import TopicGenerator from './components/TopicGenerator';

const QuestionGenerator = () => {
  const { subjectId } = useParams<{ subjectId: string }>(); // Get subjectId from URL params
  const [method, setMethod] = useState<'topic' | 'document'>('topic');

  console.log('Generating questions for subjectId:', subjectId);

  if (!subjectId) {
    return <div>Error: Subject ID is missing.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Generate Questions</h1>
      <MethodSelector method={method} setMethod={setMethod} />
      {method === 'topic' ? (
        <TopicGenerator subjectId={subjectId} onQuestionsGenerated={() => {}} />
      ) : (
        <DocumentUploader subjectId={subjectId} onQuestionsGenerated={() => {}} />
      )}
    </div>
  );
};

export default QuestionGenerator;