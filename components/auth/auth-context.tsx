"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "trainer" | "member"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: "admin" | "trainer") => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("mundo-fitness-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: "admin" | "trainer"): Promise<boolean> => {
    setIsLoading(true)

    // TODO: Replace with actual API call
    // Simulated authentication
    if (email && password) {
      const mockUser: User = {
        id: "1",
        email,
        name: role === "admin" ? "Administrador" : "Entrenador",
        role,
      }

      setUser(mockUser)
      localStorage.setItem("mundo-fitness-user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mundo-fitness-user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
