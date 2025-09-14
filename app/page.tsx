"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dumbbell,
  Users,
  Calendar,
  CreditCard,
  BarChart3,
  Settings,
  ArrowRight,
  Shield,
  Clock,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })
  const [activeTab, setActiveTab] = useState("admin")
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { user, login, isLoading } = useAuth()
  const router = useRouter()

  if (user) {
    router.push("/dashboard")
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login(loginData.email, loginData.password, activeTab as "admin" | "trainer")
    if (success) {
      setIsLoginOpen(false)
      router.push("/dashboard")
    } else {
      alert("Credenciales incorrectas")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mundo Fitness</h1>
              <p className="text-sm text-muted-foreground">Chimbarongo</p>
            </div>
          </div>

          <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
            <DialogTrigger asChild>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Acceso al Sistema</DialogTitle>
                <DialogDescription>Ingresa tus credenciales para acceder al sistema de gestión</DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="admin">Administrador</TabsTrigger>
                  <TabsTrigger value="trainer">Entrenador</TabsTrigger>
                </TabsList>

                <TabsContent value="admin" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email">Correo electrónico</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@mundofitness.cl"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Contraseña</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      <Settings className="mr-2 h-4 w-4" />
                      {isLoading ? "Accediendo..." : "Acceder como Administrador"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="trainer" className="space-y-4 mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trainer-email">Correo electrónico</Label>
                      <Input
                        id="trainer-email"
                        type="email"
                        placeholder="entrenador@mundofitness.cl"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trainer-password">Contraseña</Label>
                      <Input
                        id="trainer-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" variant="secondary" disabled={isLoading}>
                      <Dumbbell className="mr-2 h-4 w-4" />
                      {isLoading ? "Accediendo..." : "Acceder como Entrenador"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-balance">
              Sistema de Gestión
              <span className="text-primary block">Mundo Fitness</span>
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Moderniza la administración de tu gimnasio con nuestra plataforma integral. Gestiona socios, membresías,
              clases y pagos de manera eficiente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="text-lg px-8">
                  Acceder al Sistema
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </DialogTrigger>
            </Dialog>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Ver Demostración
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Funcionalidades Principales</h3>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para administrar tu gimnasio en una sola plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Gestión de Socios</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Administra la información de tus socios, membresías activas y historial completo
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Horarios y Clases</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Programa clases, asigna entrenadores y controla la asistencia de manera automática
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Control de Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gestiona pagos de membresías, genera facturas y mantén el control financiero
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Reportes y Análisis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Obtén insights valiosos con reportes detallados sobre ingresos y asistencia
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold">24/7</span>
              </div>
              <p className="text-muted-foreground">Acceso al sistema</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold">100%</span>
              </div>
              <p className="text-muted-foreground">Automatización</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-3xl font-bold">Seguro</span>
              </div>
              <p className="text-muted-foreground">Datos protegidos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-primary p-2 rounded-lg">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold">Mundo Fitness Chimbarongo</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Sistema de Gestión Integral - Desarrollado para optimizar la administración del gimnasio
          </p>
        </div>
      </footer>
    </div>
  )
}
