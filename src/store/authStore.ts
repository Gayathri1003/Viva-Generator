import { create } from "zustand"
import type { User } from "../types"
import { signIn, setPassword as apiSetPassword, verifyUsername as apiVerifyUsername } from "../lib/api/auth"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
  login: (username: string, password: string, role: "admin" | "teacher" | "student") => Promise<User>
  setPassword: (username: string, newPassword: string, role: "teacher" | "student") => Promise<void>
  verifyUsername: (
    username: string,
    role: "admin" | "teacher" | "student",
  ) => Promise<{ exists: boolean; requiresPasswordSetup: boolean } | null>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    localStorage.removeItem("token")
    set({ user: null, isAuthenticated: false })
  },

  login: async (username: string, password: string, role: "admin" | "teacher" | "student") => {
    try {
      const data = await signIn(username, password, role)
      return data.user
    } catch (error) {
      console.error("Login error:", error)
      throw new Error("Invalid credentials")
    }
  },

  setPassword: async (username: string, newPassword: string, role: "teacher" | "student") => {
    try {
      await apiSetPassword(username, newPassword, role)
    } catch (error) {
      console.error("Set password error:", error)
      throw new Error("Failed to set password")
    }
  },

  verifyUsername: async (username: string, role: "admin" | "teacher" | "student") => {
    try {
      return await apiVerifyUsername(username, role)
    } catch (error) {
      console.error("Verify username error:", error)
      return null
    }
  },
}))

