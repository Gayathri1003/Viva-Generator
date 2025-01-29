import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeacherStore } from '../../store/teacherStore';
import { useStudentStore } from '../../store/studentStore';
import SubjectHeader from './components/SubjectHeader';
import SubjectInfo from './components/SubjectInfo';
import QuickActions from './components/QuickActions';
import StudentList from './components/StudentList';

const SubjectDashboard = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subjectAssignments } = useTeacherStore();
  const { students } = useStudentStore();

  const assignment = subjectAssignments.find(a => a.id === subjectId);

  if (!assignment) {
    return <div>Subject not found</div>;
  }

  // Filter students based on department, semester, and batch
  const subjectStudents = students.filter(student => 
    student.department === assignment.department &&
    student.semester === assignment.semester &&
    student.class === assignment.batch
  );

  const handleGenerateQuestions = () => {
    navigate(`/teacher/subject/${subjectId}/questions`);
  };

  const handleViewResults = () => {
    navigate(`/teacher/subject/${subjectId}/results`);
  };

  return (
    <div className="space-y-6">
      <SubjectHeader
        subjectName={assignment.subjectName}
        subjectCode={assignment.subjectCode}
        isLab={assignment.isLab}
      />

      <SubjectInfo
        department={assignment.department}
        semester={assignment.semester}
        batch={assignment.batch}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActions
          onGenerateQuestions={handleGenerateQuestions}
          onViewResults={handleViewResults}
        />
        <StudentList students={subjectStudents} />
      </div>
    </div>
  );
};

export default SubjectDashboard;