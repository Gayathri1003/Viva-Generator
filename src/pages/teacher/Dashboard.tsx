import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SubjectList from './components/SubjectList';
import QuestionGenerator from './QuestionGenerator';
import ResultsView from './ResultsView';
import QuestionSetup from './exam/QuestionSetup';

const TeacherDashboard = () => {
  return (
    <Routes>
      <Route index element={<SubjectList />} />
      <Route path="questions" element={<QuestionGenerator />} />
      <Route path="results" element={<ResultsView />} />
      <Route path="subject/:subjectId/exam-setup" element={<QuestionSetup />} />
    </Routes>
  );
};

export default TeacherDashboard;