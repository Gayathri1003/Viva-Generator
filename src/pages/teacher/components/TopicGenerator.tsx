import React, { useState } from 'react';
import { Icons } from '../../../components/icons';
import toast from 'react-hot-toast';

interface TopicGeneratorProps {
  subject: string;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ subject }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic }),
      });
      
      const data = await response.json();
      setQuestions(data.questions);
      toast.success('Questions generated successfully');
    } catch (error) {
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Enter Topic
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 min-w-0 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="e.g., Binary Search Trees"
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? (
              <Icons.Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Generated Questions</h3>
          {questions.map((question, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-md hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">
                  Question {index + 1}
                </span>
                <span className="text-sm text-gray-500">
                  Difficulty: {question.difficulty}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{question.text}</p>
              <div className="mt-2 space-y-2">
                {question.options.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={optIndex === question.correctAnswer}
                      readOnly
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              // TODO: Save selected questions
              toast.success('Questions saved successfully');
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Selected Questions
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;