"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
import { Calendar, Plus, Search, Edit, Trash2, Clock, Users, Dumbbell, User } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface Class {
  id: string
  name: string
  description: string
  trainerId: string
  trainerName: string
  dayOfWeek: string
  startTime: string
  endTime: string
  maxCapacity: number
  currentEnrollment: number
  isActive: boolean
  createdAt: string
}

// Mock data
const mockClasses: Class[] = [
  {
    id: "1",
    name: "Yoga Matutino",
    description: "Clase de yoga para comenzar el día con energía",
    trainerId: "2",
    trainerName: "Ana Silva",
    dayOfWeek: "monday",
    startTime: "09:00",
    endTime: "10:00",
    maxCapacity: 15,
    currentEnrollment: 12,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "CrossFit Intensivo",
    description: "Entrenamiento funcional de alta intensidad",
    trainerId: "3",
    trainerName: "Pedro Martínez",
    dayOfWeek: "monday",
    startTime: "18:00",
    endTime: "19:00",
    maxCapacity: 12,
    currentEnrollment: 8,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Pilates",
    description: "Fortalecimiento del core y flexibilidad",
    trainerId: "2",
    trainerName: "Ana Silva",
    dayOfWeek: "tuesday",
    startTime: "19:30",
    endTime: "20:30",
    maxCapacity: 10,
    currentEnrollment: 10,
    isActive: true,
    createdAt: "2024-01-01",
  },
  {
    id: "4",
    name: "Spinning",
    description: "Cardio intensivo en bicicleta estática",
    trainerId: "3",
    trainerName: "Pedro Martínez",
    dayOfWeek: "wednesday",
    startTime: "07:00",
    endTime: "08:00",
    maxCapacity: 20,
    currentEnrollment: 15,
    isActive: true,
    createdAt: "2024-01-01",
  },
]

const daysOfWeek = [
  { id: "monday", name: "Lunes" },
  { id: "tuesday", name: "Martes" },
  { id: "wednesday", name: "Miércoles" },
  { id: "thursday", name: "Jueves" },
  { id: "friday", name: "Viernes" },
  { id: "saturday", name: "Sábado" },
  { id: "sunday", name: "Domingo" },
]

const mockTrainers = [
  { id: "2", name: "Ana Silva" },
  { id: "3", name: "Pedro Martínez" },
  { id: "4", name: "Laura Morales" },
]

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [searchTerm, setSearchTerm] = useState("")
  const [dayFilter, setDayFilter] = useState<string>("all")
  const [trainerFilter, setTrainerFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trainerId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    maxCapacity: "",
  })

  const filteredClasses = classes.filter((class_) => {
    const matchesSearch =
      class_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      class_.trainerName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDay = dayFilter === "all" || class_.dayOfWeek === dayFilter
    const matchesTrainer = trainerFilter === "all" || class_.trainerId === trainerFilter
    return matchesSearch && matchesDay && matchesTrainer
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedTrainer = mockTrainers.find((t) => t.id === formData.trainerId)!

    if (editingClass) {
      // Update existing class
      setClasses(
        classes.map((class_) =>
          class_.id === editingClass.id
            ? {
                ...class_,
                name: formData.name,
                description: formData.description,
                trainerId: formData.trainerId,
                trainerName: selectedTrainer.name,
                dayOfWeek: formData.dayOfWeek,
                startTime: formData.startTime,
                endTime: formData.endTime,
                maxCapacity: Number.parseInt(formData.maxCapacity),
              }
            : class_,
        ),
      )
    } else {
      // Create new class
      const newClass: Class = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        trainerId: formData.trainerId,
        trainerName: selectedTrainer.name,
        dayOfWeek: formData.dayOfWeek,
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxCapacity: Number.parseInt(formData.maxCapacity),
        currentEnrollment: 0,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setClasses([...classes, newClass])
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      trainerId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      maxCapacity: "",
    })
    setEditingClass(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (class_: Class) => {
    setEditingClass(class_)
    setFormData({
      name: class_.name,
      description: class_.description,
      trainerId: class_.trainerId,
      dayOfWeek: class_.dayOfWeek,
      startTime: class_.startTime,
      endTime: class_.endTime,
      maxCapacity: class_.maxCapacity.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (classId: string) => {
    const class_ = classes.find((c) => c.id === classId)
    if (class_ && class_.currentEnrollment > 0) {
      alert(`No se puede eliminar esta clase porque tiene ${class_.currentEnrollment} socios inscritos.`)
      return
    }

    if (confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
      setClasses(classes.filter((class_) => class_.id !== classId))
    }
  }

  const getDayName = (dayId: string) => {
    const day = daysOfWeek.find((d) => d.id === dayId)
    return day ? day.name : dayId
  }

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 100) return "destructive"
    if (percentage >= 80) return "secondary"
    return "default"
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión de Clases</h1>
            <p className="text-muted-foreground">Administra las clases grupales y horarios del gimnasio</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingClass(null)
                  setFormData({
                    name: "",
                    description: "",
                    trainerId: "",
                    dayOfWeek: "",
                    startTime: "",
                    endTime: "",
                    maxCapacity: "",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Clase
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingClass ? "Editar Clase" : "Crear Nueva Clase"}</DialogTitle>
                <DialogDescription>
                  {editingClass
                    ? "Modifica los datos de la clase seleccionada."
                    : "Completa los datos para crear una nueva clase grupal."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la clase *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Yoga Matutino"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descripción de la clase..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trainerId">Entrenador *</Label>
                    <Select
                      value={formData.trainerId}
                      onValueChange={(value) => setFormData({ ...formData, trainerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un entrenador" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTrainers.map((trainer) => (
                          <SelectItem key={trainer.id} value={trainer.id}>
                            {trainer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dayOfWeek">Día de la semana *</Label>
                      <Select
                        value={formData.dayOfWeek}
                        onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Día" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day.id} value={day.id}>
                              {day.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxCapacity">Capacidad máxima *</Label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        value={formData.maxCapacity}
                        onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                        placeholder="15"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Hora inicio *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endTime">Hora fin *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingClass ? "Actualizar Clase" : "Crear Clase"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clases</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground">{classes.filter((c) => c.isActive).length} activas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.reduce((sum, c) => sum + c.maxCapacity, 0)}</div>
              <p className="text-xs text-muted-foreground">Cupos disponibles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscritos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.reduce((sum, c) => sum + c.currentEnrollment, 0)}</div>
              <p className="text-xs text-muted-foreground">Socios inscritos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  (classes.reduce((sum, c) => sum + c.currentEnrollment, 0) /
                    classes.reduce((sum, c) => sum + c.maxCapacity, 0)) *
                    100,
                )}
                %
              </div>
              <p className="text-xs text-muted-foreground">Promedio de ocupación</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar clases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Select value={dayFilter} onValueChange={setDayFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Día" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los días</SelectItem>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.id} value={day.id}>
                      {day.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Select value={trainerFilter} onValueChange={setTrainerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Entrenador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los entrenadores</SelectItem>
                  {mockTrainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clases</CardTitle>
            <CardDescription>Gestiona todas las clases grupales del gimnasio</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Clase</TableHead>
                  <TableHead>Entrenador</TableHead>
                  <TableHead>Horario</TableHead>
                  <TableHead>Capacidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((class_) => (
                  <TableRow key={class_.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{class_.name}</div>
                        <div className="text-sm text-muted-foreground">{class_.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {class_.trainerName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {getDayName(class_.dayOfWeek)}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3" />
                          {class_.startTime} - {class_.endTime}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getCapacityColor(class_.currentEnrollment, class_.maxCapacity) as any}>
                        {class_.currentEnrollment}/{class_.maxCapacity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={class_.isActive ? "default" : "secondary"}>
                        {class_.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(class_)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(class_.id)}
                          className="text-destructive hover:text-destructive"
                          disabled={class_.currentEnrollment > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
