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
import { Users, Plus, Search, Edit, Trash2, Shield, User } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface SystemUser {
  id: string
  name: string
  email: string
  role: "admin" | "trainer"
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
}

// Mock data
const mockUsers: SystemUser[] = [
  {
    id: "1",
    name: "Carlos Administrador",
    email: "admin@mundofitness.cl",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-01-20 09:30",
  },
  {
    id: "2",
    name: "Ana Silva",
    email: "ana.silva@mundofitness.cl",
    role: "trainer",
    status: "active",
    createdAt: "2024-01-20",
    lastLogin: "2024-01-20 08:15",
  },
  {
    id: "3",
    name: "Pedro Martínez",
    email: "pedro.martinez@mundofitness.cl",
    role: "trainer",
    status: "inactive",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-18 16:45",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<SystemUser[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "trainer" as "admin" | "trainer",
    password: "",
  })

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id
            ? { ...user, name: formData.name, email: formData.email, role: formData.role }
            : user,
        ),
      )
    } else {
      // Create new user
      const newUser: SystemUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, newUser])
    }

    // Reset form
    setFormData({ name: "", email: "", role: "trainer", password: "" })
    setEditingUser(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (user: SystemUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (userId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== userId))
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">Administra los usuarios del sistema y sus permisos</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingUser(null)
                  setFormData({ name: "", email: "", role: "trainer", password: "" })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? "Modifica los datos del usuario seleccionado."
                    : "Completa los datos para crear un nuevo usuario del sistema."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ingresa el nombre completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="usuario@mundofitness.cl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "admin" | "trainer") => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="trainer">Entrenador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {!editingUser && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Contraseña temporal"
                        required={!editingUser}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">{editingUser ? "Actualizar" : "Crear Usuario"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter((u) => u.status === "active").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>Gestiona todos los usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Último Acceso</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            Administrador
                          </>
                        ) : (
                          <>
                            <User className="mr-1 h-3 w-3" />
                            Entrenador
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{user.lastLogin || "Nunca"}</TableCell>
                    <TableCell className="text-sm">{new Date(user.createdAt).toLocaleDateString("es-CL")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
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
