import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { AuthProvider } from "@/components/auth/auth-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mundo Fitness Chimbarongo - Sistema de Gestión",
  description: "Sistema integral de gestión para gimnasio Mundo Fitness Chimbarongo",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ErrorBoundary>
          <AuthProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthProvider>
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
