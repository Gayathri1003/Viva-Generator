import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface QuestionFormProps {
  subject: string;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ subject }) => {
  const [question, setQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 'medium',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Replace with actual API call
      await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...question, subject }),
      });
      toast.success('Question added successfully');
      setQuestion({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 'medium',
      });
    } catch (error) {
      toast.error('Failed to add question');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Add Question</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Question Text
          </label>
          <textarea
            value={question.text}
            onChange={(e) => setQuestion({ ...question, text: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            rows={3}
            required
          />
        </div>

        {question.options.map((option, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700">
              Option {index + 1}
            </label>
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...question.options];
                newOptions[index] = e.target.value;
                setQuestion({ ...question, options: newOptions });
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correct Answer
          </label>
          <select
            value={question.correctAnswer}
            onChange={(e) => setQuestion({ ...question, correctAnswer: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            {question.options.map((_, index) => (
              <option key={index} value={index}>
                Option {index + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Difficulty Level
          </label>
          <select
            value={question.difficulty}
            onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Question
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;