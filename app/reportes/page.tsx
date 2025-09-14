"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Download, Calendar, DollarSign, Users, TrendingUp, Clock, CreditCard } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

// Mock data for reports
const mockReportData = {
  financial: {
    totalRevenue: 2450000,
    monthlyGrowth: 12,
    pendingPayments: 180000,
    overduePayments: 45000,
    paymentMethods: [
      { method: "Tarjeta", amount: 1470000, percentage: 60 },
      { method: "Efectivo", amount: 735000, percentage: 30 },
      { method: "Transferencia", amount: 245000, percentage: 10 },
    ],
  },
  membership: {
    totalMembers: 245,
    activeMembers: 198,
    newMembersThisMonth: 23,
    membershipTypes: [
      { type: "Premium", count: 78, percentage: 32 },
      { type: "Básico", count: 89, percentage: 36 },
      { type: "VIP", count: 45, percentage: 18 },
      { type: "Oferta", count: 33, percentage: 14 },
    ],
  },
  attendance: {
    dailyAverage: 67,
    peakHours: "18:00 - 20:00",
    mostActiveDay: "Lunes",
    averageStayTime: 85, // minutes
    weeklyAttendance: [
      { day: "Lun", visits: 89 },
      { day: "Mar", visits: 76 },
      { day: "Mié", visits: 82 },
      { day: "Jue", visits: 71 },
      { day: "Vie", visits: 94 },
      { day: "Sáb", visits: 58 },
      { day: "Dom", visits: 43 },
    ],
  },
  classes: {
    totalClasses: 24,
    averageOccupancy: 78,
    mostPopularClass: "CrossFit Intensivo",
    classStats: [
      { name: "CrossFit", sessions: 8, occupancy: 92 },
      { name: "Yoga", sessions: 6, occupancy: 85 },
      { name: "Pilates", sessions: 4, occupancy: 95 },
      { name: "Spinning", sessions: 6, occupancy: 75 },
    ],
  },
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedReport, setSelectedReport] = useState("overview")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString("es-CL")}`
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const exportReport = () => {
    // En producción, esto generaría y descargaría un archivo
    alert("Funcionalidad de exportación en desarrollo")
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Reportes y Estadísticas</h1>
            <p className="text-muted-foreground">Análisis detallado del rendimiento del gimnasio</p>
          </div>

          <Button onClick={exportReport}>
            <Download className="mr-2 h-4 w-4" />
            Exportar Reporte
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Reporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Tipo de reporte</Label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona reporte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Resumen General</SelectItem>
                    <SelectItem value="financial">Financiero</SelectItem>
                    <SelectItem value="membership">Membresías</SelectItem>
                    <SelectItem value="attendance">Asistencia</SelectItem>
                    <SelectItem value="classes">Clases</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                    <SelectItem value="quarter">Este trimestre</SelectItem>
                    <SelectItem value="year">Este año</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedPeriod === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Fecha inicio</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Fecha fin</Label>
                    <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overview Report */}
        {(selectedReport === "overview" || selectedReport === "financial") && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockReportData.financial.totalRevenue)}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">+{mockReportData.financial.monthlyGrowth}%</span> vs mes anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(mockReportData.financial.pendingPayments)}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(mockReportData.financial.overduePayments)} vencidos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Socios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockReportData.membership.activeMembers}</div>
                  <p className="text-xs text-muted-foreground">de {mockReportData.membership.totalMembers} totales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Asistencia Diaria</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockReportData.attendance.dailyAverage}</div>
                  <p className="text-xs text-muted-foreground">Promedio de visitas</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>Distribución de ingresos por método de pago</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportData.financial.paymentMethods.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">{method.method}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(method.amount)}</div>
                          <div className="text-sm text-muted-foreground">{method.percentage}%</div>
                        </div>
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${method.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Membership Report */}
        {(selectedReport === "overview" || selectedReport === "membership") && (
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Membresías</CardTitle>
              <CardDescription>Análisis de tipos de membresía</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {mockReportData.membership.membershipTypes.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{type.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{type.count} socios</div>
                          <div className="text-sm text-muted-foreground">{type.percentage}%</div>
                        </div>
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${type.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Resumen del Mes</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Nuevos socios:</span>
                        <span className="font-medium text-green-600">
                          +{mockReportData.membership.newMembersThisMonth}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasa de retención:</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Membresía más popular:</span>
                        <span className="font-medium">Básico</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Report */}
        {(selectedReport === "overview" || selectedReport === "attendance") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Asistencia Semanal</CardTitle>
                <CardDescription>Visitas por día de la semana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportData.attendance.weeklyAttendance.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{day.day}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{day.visits} visitas</span>
                        <div className="w-20 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(day.visits / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de Asistencia</CardTitle>
                <CardDescription>Métricas clave de asistencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Horario pico</span>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{mockReportData.attendance.peakHours}</div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Día más activo</span>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{mockReportData.attendance.mostActiveDay}</div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tiempo promedio</span>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">
                      {formatDuration(mockReportData.attendance.averageStayTime)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Classes Report */}
        {(selectedReport === "overview" || selectedReport === "classes") && (
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento de Clases</CardTitle>
              <CardDescription>Estadísticas de clases grupales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReportData.classes.classStats.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{classItem.name}</div>
                        <div className="text-sm text-muted-foreground">{classItem.sessions} sesiones/semana</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{classItem.occupancy}%</div>
                        <div className="text-sm text-muted-foreground">Ocupación</div>
                      </div>
                      <div className="w-20 bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${classItem.occupancy}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Resumen de Clases</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Total clases:</span>
                    <span className="font-medium">{mockReportData.classes.totalClasses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ocupación promedio:</span>
                    <span className="font-medium">{mockReportData.classes.averageOccupancy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Clase más popular:</span>
                    <span className="font-medium">{mockReportData.classes.mostPopularClass}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
