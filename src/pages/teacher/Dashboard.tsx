// src/pages/teacher/Dashboard.tsx
import { Routes, Route, useNavigate } from 'react-router-dom';
import SubjectList from './components/SubjectList';
import DeployedExams from './components/DeployedExams';
import QuestionGenerator from './QuestionGenerator';
import ResultsView from './ResultsView';
import QuestionSetup from './exam/QuestionSetup';
import SubjectDashboard from './SubjectDashboard';
import BatchManagement from './BatchManagement';
import { useQuestionStore } from '../../store/questionStore';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { questionsToDeploy } = useQuestionStore();
  const navigate = useNavigate();

  const handleProceedToSetup = () => {
    if (questionsToDeploy.length === 0) {
      toast.error('No questions selected for deployment');
      return;
    }
    // Assuming the subjectId is part of the questions, use the first question's subjectId
    const subjectId = questionsToDeploy[0]?.subject_id;
    if (!subjectId) {
      toast.error('Subject ID is missing from selected questions');
      return;
    }
    navigate(`/teacher/subject/${subjectId}/exam-setup`);
  };

  return (
    <Routes>
      <Route
        index
        element={
          <div className="space-y-6">
            <SubjectList />
            <DeployedExams />
            {/* Display Questions Selected for Deployment */}
            {questionsToDeploy.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-bold mb-4">Questions Selected for Deployment</h2>
                <ul className="space-y-4">
                  {questionsToDeploy.map((question, index) => (
                    <li key={question.id} className="p-4 bg-gray-100 rounded-lg flex flex-col space-y-2">
                      <p className="font-bold">{index + 1}. {question.text}</p>
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
                <button
                  onClick={handleProceedToSetup}
                  className="mt-4 w-full flex justify-center items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Proceed to Exam Setup
                </button>
              </div>
            )}
          </div>
        }
      />
      <Route path="questions" element={<QuestionGenerator />} />
      <Route path="results" element={<ResultsView />} />
      <Route path="batches" element={<BatchManagement />} />
      <Route path="subject/:subjectId/*" element={<SubjectDashboard />} />
      <Route path="subject/:subjectId/exam-setup" element={<QuestionSetup />} />
    </Routes>
  );
};

export default TeacherDashboard;