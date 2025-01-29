import React, { useState } from 'react';
import { Icons } from '../../components/icons';

const ResultsView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with API calls
  const results = [
    {
      id: '1',
      subject: 'Data Structures Lab',
      teacher: 'Dr. John Doe',
      score: 85,
      totalQuestions: 20,
      submittedAt: '2024-03-15T10:30:00',
      feedback: 'Good performance in algorithms section.',
    },
    {
      id: '2',
      subject: 'Database Lab',
      teacher: 'Dr. Jane Smith',
      score: 75,
      totalQuestions: 20,
      submittedAt: '2024-03-10T14:15:00',
      feedback: 'Need improvement in SQL queries.',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Results</h1>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icons.Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by subject..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((result) => (
          <div key={result.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">{result.subject}</h2>
              <p className="text-sm text-gray-500 mt-1">Teacher: {result.teacher}</p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icons.Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {new Date(result.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-2xl font-bold text-indigo-600">
                  {Math.round((result.score / result.totalQuestions) * 100)}%
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(result.score / result.totalQuestions) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Score: {result.score}/{result.totalQuestions}
                </div>
              </div>

              {result.feedback && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Feedback:</span> {result.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsView;