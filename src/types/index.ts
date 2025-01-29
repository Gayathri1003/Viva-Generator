export interface User {
  id: string;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  name: string;
  requiresPasswordSetup?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  email: string;
  department: string;
  subjects: string[];
  hasSetPassword: boolean;
  password?: string;
}

export interface Student {
  id: string;
  name: string;
  username: string;
  email: string;
  department: string;
  semester: string;
  class: string;
  batch: string;
  hasSetPassword: boolean;
  password?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  semester: number;
  isLab: boolean;
}

export interface SubjectAssignment {
  id: string;
  teacherId: string;
  subjectCode: string;
  subjectName: string;
  department: string;
  semester: number;
  batch: string;
  isLab: boolean;
}