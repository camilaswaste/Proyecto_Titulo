"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardCheck, Plus, Search, UserCheck, UserX, Clock, TrendingUp, Users } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface AttendanceRecord {
  id: string
  memberId: string
  memberName: string
  membershipType: string
  checkInTime: string
  checkOutTime?: string
  date: string
  duration?: number // in minutes
  classId?: string
  className?: string
}

// Mock data
const mockAttendance: AttendanceRecord[] = [
  {
    id: "1",
    memberId: "1",
    memberName: "Juan Pérez González",
    membershipType: "Premium",
    checkInTime: "08:30",
    checkOutTime: "10:15",
    date: "2024-01-20",
    duration: 105,
    classId: "1",
    className: "Yoga Matutino",
  },
  {
    id: "2",
    memberId: "2",
    memberName: "Ana Silva Morales",
    membershipType: "Básico",
    checkInTime: "18:45",
    checkOutTime: "20:00",
    date: "2024-01-20",
    duration: 75,
  },
  {
    id: "3",
    memberId: "3",
    memberName: "Pedro Martínez López",
    membershipType: "Premium",
    checkInTime: "07:00",
    date: "2024-01-20", // Still checked in
  },
  {
    id: "4",
    memberId: "1",
    memberName: "Juan Pérez González",
    membershipType: "Premium",
    checkInTime: "19:00",
    checkOutTime: "20:30",
    date: "2024-01-19",
    duration: 90,
    classId: "2",
    className: "CrossFit Intensivo",
  },
]

const mockMembers = [
  { id: "1", name: "Juan Pérez González", membershipType: "Premium" },
  { id: "2", name: "Ana Silva Morales", membershipType: "Básico" },
  { id: "3", name: "Pedro Martínez López", membershipType: "Premium" },
  { id: "4", name: "María González", membershipType: "VIP" },
]

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCheckOutDialogOpen, setIsCheckOutDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<AttendanceRecord | null>(null)
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    classId: "",
    className: "",
  })

  const todayAttendance = attendance.filter((record) => record.date === dateFilter)
  const currentlyInGym = todayAttendance.filter((record) => !record.checkOutTime)

  const filteredAttendance = todayAttendance.filter((record) =>
    record.memberName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if member is already checked in today
    const existingRecord = todayAttendance.find(
      (record) => record.memberId === formData.memberId && !record.checkOutTime,
    )

    if (existingRecord) {
      alert("Este socio ya está registrado en el gimnasio.")
      return
    }

    const selectedMember = mockMembers.find((m) => m.id === formData.memberId)!
    const now = new Date()

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      memberId: formData.memberId,
      memberName: selectedMember.name,
      membershipType: selectedMember.membershipType,
      checkInTime: now.toTimeString().slice(0, 5),
      date: dateFilter,
      classId: formData.classId || undefined,
      className: formData.className || undefined,
    }

    setAttendance([...attendance, newRecord])

    // Reset form
    setFormData({
      memberId: "",
      memberName: "",
      classId: "",
      className: "",
    })
    setIsDialogOpen(false)
  }

  const handleCheckOut = (record: AttendanceRecord) => {
    const now = new Date()
    const checkInTime = new Date(`${record.date}T${record.checkInTime}:00`)
    const duration = Math.round((now.getTime() - checkInTime.getTime()) / (1000 * 60))

    setAttendance(
      attendance.map((att) =>
        att.id === record.id
          ? {
              ...att,
              checkOutTime: now.toTimeString().slice(0, 5),
              duration: duration,
            }
          : att,
      ),
    )
  }

  const handleQuickCheckIn = (memberId: string) => {
    const member = mockMembers.find((m) => m.id === memberId)!
    const now = new Date()

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      memberId: memberId,
      memberName: member.name,
      membershipType: member.membershipType,
      checkInTime: now.toTimeString().slice(0, 5),
      date: dateFilter,
    }

    setAttendance([...attendance, newRecord])
  }

  const getTotalVisitsToday = () => todayAttendance.length
  const getCurrentlyInGym = () => currentlyInGym.length
  const getAverageStayTime = () => {
    const completedVisits = todayAttendance.filter((record) => record.duration)
    if (completedVisits.length === 0) return 0
    const totalDuration = completedVisits.reduce((sum, record) => sum + (record.duration || 0), 0)
    return Math.round(totalDuration / completedVisits.length)
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "-"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Control de Asistencia</h1>
            <p className="text-muted-foreground">Registra la entrada y salida de los socios del gimnasio</p>
          </div>

          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setFormData({
                      memberId: "",
                      memberName: "",
                      classId: "",
                      className: "",
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Entrada
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Registrar Entrada</DialogTitle>
                  <DialogDescription>Registra la entrada de un socio al gimnasio</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCheckIn}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="memberId">Socio *</Label>
                      <Select
                        value={formData.memberId}
                        onValueChange={(value) => setFormData({ ...formData, memberId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un socio" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name} - {member.membershipType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="className">Clase (opcional)</Label>
                      <Input
                        id="className"
                        value={formData.className}
                        onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                        placeholder="Nombre de la clase"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Registrar Entrada</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitas Hoy</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalVisitsToday()}</div>
              <p className="text-xs text-muted-foreground">Total de registros</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En el Gimnasio</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCurrentlyInGym()}</div>
              <p className="text-xs text-muted-foreground">Socios actualmente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(getAverageStayTime())}</div>
              <p className="text-xs text-muted-foreground">Estadía promedio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((getCurrentlyInGym() / 50) * 100)}%</div>
              <p className="text-xs text-muted-foreground">Capacidad estimada</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acceso Rápido</CardTitle>
            <CardDescription>Registra entrada rápida para socios frecuentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockMembers.slice(0, 4).map((member) => {
                const isInGym = currentlyInGym.some((record) => record.memberId === member.id)
                return (
                  <Button
                    key={member.id}
                    variant={isInGym ? "secondary" : "outline"}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                    onClick={() => !isInGym && handleQuickCheckIn(member.id)}
                    disabled={isInGym}
                  >
                    <UserCheck className="h-5 w-5" />
                    <div className="text-center">
                      <div className="font-medium text-sm">{member.name.split(" ")[0]}</div>
                      <div className="text-xs text-muted-foreground">{member.membershipType}</div>
                    </div>
                    {isInGym && (
                      <Badge variant="secondary" className="text-xs">
                        En gimnasio
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="dateFilter">Fecha</Label>
                <Input id="dateFilter" type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Asistencia - {new Date(dateFilter).toLocaleDateString("es-CL")}</CardTitle>
            <CardDescription>Historial de entradas y salidas del día seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Socio</TableHead>
                  <TableHead>Membresía</TableHead>
                  <TableHead>Entrada</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Duración</TableHead>
                  <TableHead>Clase</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{record.memberName}</div>
                        <div className="text-sm text-muted-foreground">ID: {record.memberId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.membershipType}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {record.checkInTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      {record.checkOutTime ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {record.checkOutTime}
                        </div>
                      ) : (
                        <Badge variant="secondary">En gimnasio</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDuration(record.duration)}</TableCell>
                    <TableCell>
                      {record.className && (
                        <Badge variant="outline" className="text-xs">
                          {record.className}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!record.checkOutTime && (
                        <Button variant="outline" size="sm" onClick={() => handleCheckOut(record)}>
                          <UserX className="h-4 w-4 mr-1" />
                          Salida
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
