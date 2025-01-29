import React, { useState } from 'react';
import toast from 'react-hot-toast';
import SubjectSelector from './components/SubjectSelector';
import QuestionForm from './components/QuestionForm';
import TopicGenerator from './components/TopicGenerator';
import DocumentUploader from './components/DocumentUploader';
import MethodSelector from './components/MethodSelector';

type GenerationMethod = 'upload' | 'manual' | 'topic' | null;

const QuestionGenerator = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [generationMethod, setGenerationMethod] = useState<GenerationMethod>(null);

  const handleMethodSelect = (method: GenerationMethod) => {
    if (!selectedSubject) {
      toast.error('Please select a subject first');
      return;
    }
    setGenerationMethod(method);
  };

  const renderMethodContent = () => {
    switch (generationMethod) {
      case 'upload':
        return <DocumentUploader />;
      case 'manual':
        return <QuestionForm subject={selectedSubject} />;
      case 'topic':
        return <TopicGenerator subject={selectedSubject} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Generate Questions</h1>
      
      <SubjectSelector
        selectedSubject={selectedSubject}
        onSubjectChange={setSelectedSubject}
      />

      {!generationMethod ? (
        <MethodSelector onSelect={handleMethodSelect} />
      ) : (
        <>
          {renderMethodContent()}
          <button
            onClick={() => setGenerationMethod(null)}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            ← Back to methods
          </button>
        </>
      )}
    </div>
  );
};

export default QuestionGenerator;