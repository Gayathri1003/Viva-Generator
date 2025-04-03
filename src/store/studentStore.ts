import { create } from "zustand"
import type { Student } from "../types"
import { getStudents, addStudent, updateStudent, deleteStudent } from "../lib/api/students"

interface StudentState {
  students: Student[]
  loading: boolean
  error: string | null
  fetchStudents: () => Promise<void>
  addStudent: (student: Omit<Student, "id" | "hasSetPassword" | "password" | "batch">) => Promise<void>
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>
  deleteStudent: (id: string) => Promise<void>
  isUsernameUnique: (username: string) => boolean
}

export const useStudentStore = create<StudentState>((set, get) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null })
    try {
      const students = await getStudents()
      set({ students, loading: false })
    } catch (error) {
      console.error("Fetch students error:", error)
      set({ error: "Failed to fetch students", loading: false })
    }
  },

  addStudent: async (studentData) => {
    set({ loading: true, error: null })
    try {
      const newStudent = await addStudent(studentData)
      set((state) => ({
        students: [
          ...state.students,
          {
            ...newStudent,
            batch: "",
            hasSetPassword: false,
          },
        ],
        loading: false,
      }))
    } catch (error) {
      console.error("Add student error:", error)
      set({ error: "Failed to add student", loading: false })
      throw error
    }
  },

  updateStudent: async (id, studentData) => {
    set({ loading: true, error: null })
    try {
      const updatedStudent = await updateStudent(id, studentData)
      set((state) => ({
        students: state.students.map((student) => (student.id === id ? { ...student, ...updatedStudent } : student)),
        loading: false,
      }))
    } catch (error) {
      console.error("Update student error:", error)
      set({ error: "Failed to update student", loading: false })
      throw error
    }
  },

  deleteStudent: async (id) => {
    set({ loading: true, error: null })
    try {
      await deleteStudent(id)
      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
        loading: false,
      }))
    } catch (error) {
      console.error("Delete student error:", error)
      set({ error: "Failed to delete student", loading: false })
      throw error
    }
  },

  isUsernameUnique: (username) => {
    const { students } = get()
    return !students.some((student) => student.username === username)
  },
}))

