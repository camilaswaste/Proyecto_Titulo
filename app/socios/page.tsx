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
import { Users, Plus, Search, Edit, Trash2, UserCheck, Phone, Mail, Calendar } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface Member {
  id: string
  name: string
  email: string
  phone: string
  rut: string
  birthDate: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  medicalNotes?: string
  status: "active" | "inactive" | "suspended"
  membershipType: string
  membershipStart: string
  membershipEnd: string
  createdAt: string
}

// Mock data
const mockMembers: Member[] = [
  {
    id: "1",
    name: "Juan Pérez González",
    email: "juan.perez@email.com",
    phone: "+56 9 8765 4321",
    rut: "12.345.678-9",
    birthDate: "1990-05-15",
    address: "Av. Principal 123, Chimbarongo",
    emergencyContact: "María Pérez",
    emergencyPhone: "+56 9 8765 4322",
    medicalNotes: "Lesión previa en rodilla izquierda",
    status: "active",
    membershipType: "Premium",
    membershipStart: "2024-01-01",
    membershipEnd: "2024-12-31",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Ana Silva Morales",
    email: "ana.silva@email.com",
    phone: "+56 9 7654 3210",
    rut: "98.765.432-1",
    birthDate: "1985-08-22",
    address: "Calle Los Robles 456, Chimbarongo",
    emergencyContact: "Carlos Silva",
    emergencyPhone: "+56 9 7654 3211",
    status: "active",
    membershipType: "Básico",
    membershipStart: "2024-01-15",
    membershipEnd: "2024-07-15",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    name: "Pedro Martínez López",
    email: "pedro.martinez@email.com",
    phone: "+56 9 6543 2109",
    rut: "11.222.333-4",
    birthDate: "1992-12-10",
    address: "Pasaje Las Flores 789, Chimbarongo",
    emergencyContact: "Laura Martínez",
    emergencyPhone: "+56 9 6543 2108",
    status: "suspended",
    membershipType: "Premium",
    membershipStart: "2023-12-01",
    membershipEnd: "2024-11-30",
    createdAt: "2023-12-01",
  },
]

const membershipTypes = [
  { id: "basico", name: "Básico", duration: 6, price: 25000 },
  { id: "premium", name: "Premium", duration: 12, price: 45000 },
  { id: "vip", name: "VIP", duration: 12, price: 65000 },
]

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rut: "",
    birthDate: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalNotes: "",
    membershipType: "basico",
  })

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.rut.includes(searchTerm)
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedMembership = membershipTypes.find((m) => m.id === formData.membershipType)!
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + selectedMembership.duration)

    if (editingMember) {
      // Update existing member
      setMembers(
        members.map((member) =>
          member.id === editingMember.id
            ? {
                ...member,
                ...formData,
                membershipType: selectedMembership.name,
                membershipStart: member.membershipStart, // Keep original start date
                membershipEnd: member.membershipEnd, // Keep original end date
              }
            : member,
        ),
      )
    } else {
      // Create new member
      const newMember: Member = {
        id: Date.now().toString(),
        ...formData,
        membershipType: selectedMembership.name,
        membershipStart: startDate.toISOString().split("T")[0],
        membershipEnd: endDate.toISOString().split("T")[0],
        status: "active",
        createdAt: startDate.toISOString().split("T")[0],
      }
      setMembers([...members, newMember])
    }

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      rut: "",
      birthDate: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      medicalNotes: "",
      membershipType: "basico",
    })
    setEditingMember(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (member: Member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      rut: member.rut,
      birthDate: member.birthDate,
      address: member.address,
      emergencyContact: member.emergencyContact,
      emergencyPhone: member.emergencyPhone,
      medicalNotes: member.medicalNotes || "",
      membershipType: membershipTypes.find((m) => m.name === member.membershipType)?.id || "basico",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (memberId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este socio?")) {
      setMembers(members.filter((member) => member.id !== memberId))
    }
  }

  const toggleMemberStatus = (memberId: string) => {
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? {
              ...member,
              status: member.status === "active" ? "suspended" : member.status === "suspended" ? "inactive" : "active",
            }
          : member,
      ),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "suspended":
        return "destructive"
      case "inactive":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "suspended":
        return "Suspendido"
      case "inactive":
        return "Inactivo"
      default:
        return status
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión de Socios</h1>
            <p className="text-muted-foreground">Administra la información de todos los socios del gimnasio</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingMember(null)
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    rut: "",
                    birthDate: "",
                    address: "",
                    emergencyContact: "",
                    emergencyPhone: "",
                    medicalNotes: "",
                    membershipType: "basico",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Socio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMember ? "Editar Socio" : "Registrar Nuevo Socio"}</DialogTitle>
                <DialogDescription>
                  {editingMember
                    ? "Modifica los datos del socio seleccionado."
                    : "Completa todos los datos para registrar un nuevo socio."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN PERSONAL</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Juan Pérez González"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rut">RUT *</Label>
                        <Input
                          id="rut"
                          value={formData.rut}
                          onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                          placeholder="12.345.678-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="juan@email.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Teléfono *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+56 9 8765 4321"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="membershipType">Tipo de membresía *</Label>
                        <Select
                          value={formData.membershipType}
                          onValueChange={(value) => setFormData({ ...formData, membershipType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {membershipTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name} - ${type.price.toLocaleString("es-CL")} ({type.duration} meses)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Av. Principal 123, Chimbarongo"
                      />
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">CONTACTO DE EMERGENCIA</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Nombre contacto *</Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                          placeholder="María Pérez"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Teléfono contacto *</Label>
                        <Input
                          id="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                          placeholder="+56 9 8765 4322"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Notes */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN MÉDICA</h4>
                    <div className="space-y-2">
                      <Label htmlFor="medicalNotes">Notas médicas</Label>
                      <Textarea
                        id="medicalNotes"
                        value={formData.medicalNotes}
                        onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                        placeholder="Lesiones previas, condiciones médicas, medicamentos, etc."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingMember ? "Actualizar Socio" : "Registrar Socio"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o RUT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="suspended">Suspendidos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Socios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Socios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{members.filter((m) => m.status === "active").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Socios</CardTitle>
            <CardDescription>Gestiona todos los socios registrados en el gimnasio</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Socio</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Membresía</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.rut}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.membershipType}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(member.status) as any}
                        className="cursor-pointer"
                        onClick={() => toggleMemberStatus(member.id)}
                      >
                        {getStatusLabel(member.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(member.membershipEnd).toLocaleDateString("es-CL")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                          className="text-destructive hover:text-destructive"
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
