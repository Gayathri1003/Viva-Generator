import React, { useState } from 'react';
import { Icons } from '../../components/icons';
import toast from 'react-hot-toast';

const ExamPortal = () => {
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [examStarted, setExamStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  // Mock data - replace with API calls
  const availableExams = [
    {
      id: '1',
      subject: 'Data Structures Lab',
      teacher: 'Dr. John Doe',
      totalQuestions: 20,
      duration: 60, // minutes
      questions: Array(20).fill(null).map((_, i) => ({
        id: i,
        text: `Sample question ${i + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
      })),
    },
  ];

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartExam = (exam: any) => {
    setSelectedExam(exam);
    setExamStarted(true);
    setTimeLeft(exam.duration * 60);
    toast.success('Exam started');
  };

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    try {
      // TODO: Replace with actual API call
      await fetch('/api/submit-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: selectedExam.id,
          answers,
        }),
      });
      toast.success('Exam submitted successfully');
      setExamStarted(false);
      setSelectedExam(null);
      setAnswers({});
    } catch (error) {
      toast.error('Failed to submit exam');
    }
  };

  if (!examStarted) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Available Exams</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableExams.map((exam) => (
            <div key={exam.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-gray-900">{exam.subject}</h2>
              <p className="text-sm text-gray-500 mt-2">Teacher: {exam.teacher}</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">Total Questions: {exam.totalQuestions}</p>
                <p className="text-sm">Duration: {exam.duration} minutes</p>
              </div>
              <button
                onClick={() => handleStartExam(exam)}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Start Exam
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <h1 className="text-xl font-medium text-gray-900">{selectedExam.subject}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-700">
            <Icons.Clock className="w-5 h-5 mr-2" />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {selectedExam.questions.length}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-lg text-gray-900 mb-6">
          {selectedExam.questions[currentQuestion].text}
        </p>

        <div className="space-y-4">
          {selectedExam.questions[currentQuestion].options.map((option: string, index: number) => (
            <label
              key={index}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-200'
              }`}
            >
              <input
                type="radio"
                name="answer"
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswer(currentQuestion, index)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-3">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>

        {currentQuestion < selectedExam.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            Submit Exam
          </button>
        )}
      </div>

      {/* Question Navigation */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-10 gap-2">
          {selectedExam.questions.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`p-2 text-sm font-medium rounded-md ${
                currentQuestion === index
                  ? 'bg-indigo-600 text-white'
                  : answers[index] !== undefined
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamPortal;