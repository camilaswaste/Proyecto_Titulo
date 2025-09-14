"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, CreditCard, Calendar, TrendingUp, DollarSign, UserCheck, Clock, AlertCircle } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { useAuth } from "@/components/auth/auth-context"

// Mock data - En producción vendría de la API
const dashboardData = {
  stats: {
    totalMembers: 245,
    activeMembers: 198,
    monthlyRevenue: 2450000,
    todayClasses: 8,
    todayAttendance: 67,
  },
  recentActivities: [
    { id: 1, type: "new_member", message: "Nuevo socio registrado: Juan Pérez", time: "Hace 2 horas" },
    { id: 2, type: "payment", message: "Pago recibido de María González", time: "Hace 3 horas" },
    { id: 3, type: "class", message: "Clase de CrossFit completada", time: "Hace 4 horas" },
  ],
  upcomingClasses: [
    { id: 1, name: "Yoga Matutino", time: "09:00", trainer: "Ana Silva", capacity: "12/15" },
    { id: 2, name: "CrossFit", time: "18:00", trainer: "Carlos Ruiz", capacity: "8/12" },
    { id: 3, name: "Pilates", time: "19:30", trainer: "Laura Morales", capacity: "10/10" },
  ],
  alerts: [
    { id: 1, type: "warning", message: "5 membresías vencen esta semana" },
    { id: 2, type: "info", message: "Mantenimiento programado para mañana" },
  ],
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground">
              Bienvenido de vuelta, {user?.name}. Aquí tienes un resumen de tu gimnasio.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Última actualización</p>
            <p className="font-medium">{new Date().toLocaleString("es-CL")}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Socios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Socios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.activeMembers}</div>
              <Progress
                value={(dashboardData.stats.activeMembers / dashboardData.stats.totalMembers) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardData.stats.monthlyRevenue.toLocaleString("es-CL")}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Hoy</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.todayAttendance}</div>
              <p className="text-xs text-muted-foreground">{dashboardData.stats.todayClasses} clases programadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas actividades en el gimnasio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {activity.type === "new_member" && <Users className="h-4 w-4 text-primary" />}
                    {activity.type === "payment" && <CreditCard className="h-4 w-4 text-primary" />}
                    {activity.type === "class" && <Calendar className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Clases</CardTitle>
              <CardDescription>Clases programadas para hoy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashboardData.upcomingClasses.map((class_) => (
                <div key={class_.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/10 p-2 rounded-full">
                      <Clock className="h-4 w-4 text-secondary" />
                    </div>
                    <div>
                      <p className="font-medium">{class_.name}</p>
                      <p className="text-sm text-muted-foreground">{class_.trainer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{class_.time}</p>
                    <Badge variant={class_.capacity.includes("10/10") ? "destructive" : "secondary"}>
                      {class_.capacity}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {dashboardData.alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Alertas y Notificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dashboardData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <AlertCircle
                    className={`h-4 w-4 ${alert.type === "warning" ? "text-yellow-600" : "text-blue-600"}`}
                  />
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
