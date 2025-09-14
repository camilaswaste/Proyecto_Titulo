"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { useAuth } from "@/components/auth/auth-context"
import { AuthProvider } from "@/components/auth/auth-context"

interface MainLayoutProps {
  children: ReactNode
}

function MainLayoutContent({ children }: MainLayoutProps) {
  const { user } = useAuth()

  if (!user) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthProvider>
      <MainLayoutContent>{children}</MainLayoutContent>
    </AuthProvider>
  )
}
