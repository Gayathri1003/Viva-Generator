import { create } from "zustand"
import type { Teacher, SubjectAssignment } from "../types"
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from "../lib/api/teachers"

interface TeacherState {
  teachers: Teacher[]
  subjectAssignments: SubjectAssignment[]
  loading: boolean
  error: string | null
  fetchTeachers: () => Promise<void>
  addTeacher: (
    teacher: Omit<Teacher, "id" | "hasSetPassword" | "subjects" | "password" | "department">,
  ) => Promise<void>
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>
  deleteTeacher: (id: string) => Promise<void>
  assignSubject: (assignment: Omit<SubjectAssignment, "id">) => Promise<void>
  removeSubjectAssignment: (assignmentId: string) => Promise<void>
  getTeacherAssignments: (teacherId: string) => SubjectAssignment[]
  isSubjectAssigned: (subjectCode: string, department: string, semester: number, class_: string) => boolean
}

export const useTeacherStore = create<TeacherState>((set, get) => ({
  teachers: [],
  subjectAssignments: [],
  loading: false,
  error: null,

  fetchTeachers: async () => {
    set({ loading: true, error: null })
    try {
      const teachers = await getTeachers()
      set({ teachers, loading: false })
    } catch (error) {
      console.error("Fetch teachers error:", error)
      set({ error: "Failed to fetch teachers", loading: false })
    }
  },

  addTeacher: async (teacherData) => {
    set({ loading: true, error: null })
    try {
      const newTeacher = await addTeacher(teacherData)
      set((state) => ({
        teachers: [
          ...state.teachers,
          {
            ...newTeacher,
            department: "",
            subjects: [],
            hasSetPassword: false,
          },
        ],
        loading: false,
      }))
    } catch (error) {
      console.error("Add teacher error:", error)
      set({ error: "Failed to add teacher", loading: false })
      throw error
    }
  },

  updateTeacher: async (id, teacherData) => {
    set({ loading: true, error: null })
    try {
      const updatedTeacher = await updateTeacher(id, teacherData)
      set((state) => ({
        teachers: state.teachers.map((teacher) => (teacher.id === id ? { ...teacher, ...updatedTeacher } : teacher)),
        loading: false,
      }))
    } catch (error) {
      console.error("Update teacher error:", error)
      set({ error: "Failed to update teacher", loading: false })
      throw error
    }
  },

  deleteTeacher: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteTeacher(id)
      set((state) => ({
        teachers: state.teachers.filter((teacher) => teacher.id !== id),
        subjectAssignments: state.subjectAssignments.filter((assignment) => assignment.teacherId !== id),
        loading: false,
      }))
    } catch (error) {
      console.error("Delete teacher error:", error)
      set({ error: "Failed to delete teacher", loading: false })
      throw error
    }
  },

  assignSubject: async (assignment) => {
    const state = get()

    // Check if subject is already assigned
    const isAssigned = state.isSubjectAssigned(
      assignment.subjectCode,
      assignment.department,
      assignment.semester,
      assignment.class,
    )

    if (isAssigned) {
      throw new Error(
        "This subject is already assigned to another teacher for the specified department, semester, and class",
      )
    }

    // Check if teacher exists
    const teacher = state.teachers.find((t) => t.id === assignment.teacherId)
    if (!teacher) {
      throw new Error("Teacher not found")
    }

    const newAssignment: SubjectAssignment = {
      id: Date.now().toString(),
      ...assignment,
    }

    set((state) => ({
      subjectAssignments: [...state.subjectAssignments, newAssignment],
    }))
  },

  removeSubjectAssignment: async (assignmentId) => {
    set((state) => ({
      subjectAssignments: state.subjectAssignments.filter((assignment) => assignment.id !== assignmentId),
    }))
  },

  getTeacherAssignments: (teacherId) => {
    return get().subjectAssignments.filter((assignment) => assignment.teacherId === teacherId)
  },

  isSubjectAssigned: (subjectCode, department, semester, class_) => {
    return get().subjectAssignments.some(
      (assignment) =>
        assignment.subjectCode.toLowerCase() === subjectCode.toLowerCase() &&
        assignment.department.toLowerCase() === department.toLowerCase() &&
        assignment.semester === semester &&
        assignment.class.toLowerCase() === class_.toLowerCase(),
    )
  },
}))

