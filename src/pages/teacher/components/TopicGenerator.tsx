import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuestionsFromText } from '../../../lib/api/gemini';
import { useQuestionStore } from '../../../store/questionStore';
import toast from 'react-hot-toast';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Question {
  text: string;
  options: string[];
  correct_answer: string; // 'A', 'B', 'C', 'D'
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TopicGeneratorProps {
  subjectId: string;
  onQuestionsGenerated?: () => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ subjectId, onQuestionsGenerated }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const { addQuestion, getQuestionsBySubject } = useQuestionStore();
  const navigate = useNavigate();

  // Load questions for the subject from the store when the component mounts
  useEffect(() => {
    const subjectQuestions = getQuestionsBySubject(subjectId);
    setQuestions(subjectQuestions);
  }, [subjectId, getQuestionsBySubject]);

  // Parse the API response to extract questions
  const parseQuestions = (content: string): Question[] => {
    const lines = content.split('\n');
    const questions: Question[] = [];
    let currentQuestion: Question = {
      text: '',
      options: [],
      correct_answer: '',
      difficulty: 'medium',
    };

    lines.forEach((line) => {
      line = line.trim();
      if (!line) return; // Skip empty lines

      if (line.startsWith('- Question:')) {
        // If there's a previous question with valid data, push it to the array
        if (
          currentQuestion.text &&
          currentQuestion.options.length === 4 &&
          currentQuestion.correct_answer &&
          currentQuestion.difficulty
        ) {
          questions.push(currentQuestion);
        }
        // Start a new question
        currentQuestion = {
          text: line.replace('- Question:', '').trim(),
          options: [],
          correct_answer: '',
          difficulty: 'medium',
        };
      } else if (line.startsWith('- Options:') && currentQuestion.text) {
        const optionsString = line.replace('- Options:', '').trim();
        const options = optionsString.split(',').map((opt) => {
          const optionText = opt.trim();
          // Remove the A), B), etc. prefix if present
          return optionText.replace(/^[A-D]\)\s*/, '');
        });
        if (options.length === 4) {
          currentQuestion.options = options;
        }
      } else if (line.startsWith('- Answer:') && currentQuestion.text) {
        const answer = line.replace('- Answer:', '').trim();
        // Ensure the answer is one of 'A', 'B', 'C', 'D'
        if (['A', 'B', 'C', 'D'].includes(answer)) {
          currentQuestion.correct_answer = answer;
        }
      } else if (line.startsWith('- Difficulty:') && currentQuestion.text) {
        const difficulty = line.replace('- Difficulty:', '').trim().toLowerCase();
        if (['easy', 'medium', 'hard'].includes(difficulty)) {
          currentQuestion.difficulty = difficulty as 'easy' | 'medium' | 'hard';
        }
      }
    });

    // Add the last question if it exists and is valid
    if (
      currentQuestion.text &&
      currentQuestion.options.length === 4 &&
      currentQuestion.correct_answer &&
      currentQuestion.difficulty
    ) {
      questions.push(currentQuestion);
    }

    return questions;
  };

  // Handle question generation
  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a valid topic');
      return;
    }

    setLoading(true);
    try {
      const generatedResponse = await generateQuestionsFromText(topic, count);
      const content = generatedResponse.candidates[0].content.parts[0].text;
      const extractedQuestions = parseQuestions(content);

      if (extractedQuestions.length === 0) {
        throw new Error('No valid questions were extracted from the response');
      }

      // Add each question to the store
      for (const question of extractedQuestions) {
        await addQuestion({
          text: question.text,
          options: question.options,
          correct_answer: question.correct_answer,
          difficulty: question.difficulty,
          subject_id: subjectId,
        });
      }

      // Update local state with the questions for this subject
      const updatedQuestions = getQuestionsBySubject(subjectId);
      setQuestions(updatedQuestions);
      toast.success('Questions generated successfully!');
      setTopic('');
      if (onQuestionsGenerated) onQuestionsGenerated();
    } catch (error) {
      toast.error('Failed to generate questions');
      console.error('Topic generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting/deselecting a question
  const handleSelectQuestion = (questionText: string) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionText)
        ? prev.filter((text) => text !== questionText)
        : [...prev, questionText]
    );
  };

  // Handle deploying selected questions
  const handleDeploy = () => {
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question to deploy');
      return;
    }

    const questionsToDeploy = questions.filter((q) => selectedQuestions.includes(q.text));
    navigate(`/teacher/subject/${subjectId}/exam-setup`, {
      state: { selectedQuestions: questionsToDeploy },
    });
    toast.success(`${selectedQuestions.length} question(s) ready for exam setup!`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Enter Topic</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={4}
          placeholder="Enter the topic for generating questions..."
          disabled={loading}
        />
      </div>

      {/* Number of Questions Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
        <input
          type="number"
          min="1"
          max="20"
          value={count}
          onChange={(e) => setCount(parseInt(e.target.value))}
          className="w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={loading}
        />
      </div>

      {/* Generate Questions Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
      >
        {loading ? <AiOutlineLoading3Quarters className="animate-spin mr-2" /> : 'Generate Questions'}
      </button>

      {/* Display Generated Questions */}
      {questions.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold">Generated Questions</h2>
          <ul className="space-y-4 mt-4">
            {questions.map((question, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded-lg flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{index + 1}. {question.text}</p>
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(question.text)}
                    onChange={() => handleSelectQuestion(question.text)}
                    className="h-5 w-5 text-indigo-600 rounded"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  {question.options.map((option, idx) => (
                    <p
                      key={idx}
                      className={
                        question.correct_answer === String.fromCharCode(65 + idx)
                          ? 'text-green-600'
                          : ''
                      }
                    >
                      {String.fromCharCode(65 + idx)}. {option}
                    </p>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Correct Answer: {question.correct_answer}
                </p>
                <p className="text-sm text-gray-500">Difficulty: {question.difficulty}</p>
              </li>
            ))}
          </ul>
          {/* Deploy Selected Questions Button */}
          <button
            onClick={handleDeploy}
            className="mt-4 w-full flex justify-center items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Deploy Selected Questions ({selectedQuestions.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicGenerator;