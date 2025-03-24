// src/pages/teacher/components/DocumentUploader.tsx
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuestionStore } from '../../../store/questionStore';

interface DocumentUploaderProps {
  subjectId: string;
  onQuestionsGenerated?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const { addQuestion } = useQuestionStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    // Placeholder: In a real implementation, you'd parse the document and generate questions
    // For now, add a mock question to the store using subjectId
    addQuestion({
      text: 'Sample question from document',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 'A',
      difficulty: 'medium',
      subject_id: subjectId,
    });

    toast.success('Document uploaded and questions generated (placeholder)');
    if (onQuestionsGenerated) onQuestionsGenerated();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <button
        onClick={handleUpload}
        className="w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
      >
        Upload Document
      </button>
    </div>
  );
};

export default DocumentUploader;