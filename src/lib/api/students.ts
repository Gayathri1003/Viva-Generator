import axios from "axios"
import type { Student } from "../../types"

const API_URL = "http://localhost:5000/api"

export async function getStudents(): Promise<Student[]> {
  const { data } = await axios.get(`${API_URL}/students`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  return data.map(
    (student: any): Student => ({
      id: student._id,
      name: student.name,
      username: student.username,
      email: student.email,
      department: student.department,
      semester: student.semester.toString(),
      class: student.class,
      batch: student.batch || "",
      hasSetPassword: student.hasSetPassword,
    }),
  )
}

export async function addStudent(student: Omit<Student, "id" | "hasSetPassword" | "password" | "batch">) {
  const { data } = await axios.post(`${API_URL}/students`, student, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  return data
}

export async function updateStudent(id: string, student: Partial<Student>) {
  const { data } = await axios.put(`${API_URL}/students/${id}`, student, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  return data
}

export async function deleteStudent(id: string) {
  const { data } = await axios.delete(`${API_URL}/students/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
  return data
}

