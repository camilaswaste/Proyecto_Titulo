"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { CreditCard, Plus, Search, Edit, Trash2, Star, Users } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number // in months
  type: "normal" | "offer"
  features: string[]
  isActive: boolean
  discount?: number
  validUntil?: string
  createdAt: string
  membersCount: number
}

// Mock data
const mockPlans: MembershipPlan[] = [
  {
    id: "1",
    name: "Plan Básico",
    description: "Acceso completo al gimnasio con equipos básicos",
    price: 25000,
    duration: 1,
    type: "normal",
    features: [
      "Acceso a sala de pesas",
      "Acceso a máquinas cardiovasculares",
      "Horario de 6:00 a 22:00",
      "Casillero incluido",
    ],
    isActive: true,
    createdAt: "2024-01-01",
    membersCount: 45,
  },
  {
    id: "2",
    name: "Plan Premium",
    description: "Acceso completo + clases grupales",
    price: 45000,
    duration: 3,
    type: "normal",
    features: [
      "Todo lo del Plan Básico",
      "Clases grupales ilimitadas",
      "Acceso a zona funcional",
      "Evaluación física inicial",
      "Rutina personalizada",
    ],
    isActive: true,
    createdAt: "2024-01-01",
    membersCount: 78,
  },
  {
    id: "3",
    name: "Plan VIP",
    description: "Acceso premium + entrenamiento personalizado",
    price: 65000,
    duration: 6,
    type: "normal",
    features: [
      "Todo lo del Plan Premium",
      "2 sesiones de entrenamiento personal",
      "Acceso 24/7",
      "Zona VIP exclusiva",
      "Seguimiento nutricional básico",
      "Invitado gratis 1 vez al mes",
    ],
    isActive: true,
    createdAt: "2024-01-01",
    membersCount: 23,
  },
  {
    id: "4",
    name: "Oferta Verano 2024",
    description: "Plan Premium con descuento especial",
    price: 35000,
    duration: 3,
    type: "offer",
    features: ["Todo lo del Plan Premium", "Descuento del 22%", "Válido hasta marzo 2024"],
    isActive: true,
    discount: 22,
    validUntil: "2024-03-31",
    createdAt: "2024-01-15",
    membersCount: 12,
  },
]

export default function MembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>(mockPlans)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    type: "normal" as "normal" | "offer",
    features: [""],
    discount: "",
    validUntil: "",
  })

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch =
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || plan.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const planData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseInt(formData.price),
      duration: Number.parseInt(formData.duration),
      type: formData.type,
      features: formData.features.filter((f) => f.trim() !== ""),
      discount: formData.type === "offer" ? Number.parseInt(formData.discount) : undefined,
      validUntil: formData.type === "offer" ? formData.validUntil : undefined,
    }

    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map((plan) => (plan.id === editingPlan.id ? { ...plan, ...planData } : plan)))
    } else {
      // Create new plan
      const newPlan: MembershipPlan = {
        id: Date.now().toString(),
        ...planData,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
        membersCount: 0,
      }
      setPlans([...plans, newPlan])
    }

    // Reset form
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      type: "normal",
      features: [""],
      discount: "",
      validUntil: "",
    })
    setEditingPlan(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      type: plan.type,
      features: plan.features.length > 0 ? plan.features : [""],
      discount: plan.discount?.toString() || "",
      validUntil: plan.validUntil || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    if (plan && plan.membersCount > 0) {
      alert(`No se puede eliminar este plan porque tiene ${plan.membersCount} socios activos.`)
      return
    }

    if (confirm("¿Estás seguro de que deseas eliminar este plan?")) {
      setPlans(plans.filter((plan) => plan.id !== planId))
    }
  }

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map((plan) => (plan.id === planId ? { ...plan, isActive: !plan.isActive } : plan)))
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    })
  }

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({
      ...formData,
      features: newFeatures,
    })
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Planes de Membresía</h1>
            <p className="text-muted-foreground">Gestiona los planes de membresía disponibles para los socios</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPlan(null)
                  setFormData({
                    name: "",
                    description: "",
                    price: "",
                    duration: "",
                    type: "normal",
                    features: [""],
                    discount: "",
                    validUntil: "",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlan ? "Editar Plan" : "Crear Nuevo Plan"}</DialogTitle>
                <DialogDescription>
                  {editingPlan
                    ? "Modifica los datos del plan seleccionado."
                    : "Completa los datos para crear un nuevo plan de membresía."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">INFORMACIÓN BÁSICA</h4>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del plan *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Plan Premium"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descripción del plan de membresía"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio (CLP) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="45000"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duración (meses) *</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                          placeholder="3"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Tipo de plan *</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: "normal" | "offer") => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="offer">Oferta</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  {formData.type === "offer" && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">DETALLES DE OFERTA</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="discount">Descuento (%)</Label>
                          <Input
                            id="discount"
                            type="number"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                            placeholder="20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="validUntil">Válido hasta</Label>
                          <Input
                            id="validUntil"
                            type="date"
                            value={formData.validUntil}
                            onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-muted-foreground">CARACTERÍSTICAS</h4>
                      <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar
                      </Button>
                    </div>
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Característica del plan"
                        />
                        {formData.features.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{editingPlan ? "Actualizar Plan" : "Crear Plan"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar planes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="normal">Normales</SelectItem>
                  <SelectItem value="offer">Ofertas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Planes</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plans.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{plans.filter((p) => p.isActive).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className={`relative ${!plan.isActive ? "opacity-60" : ""}`}>
              {plan.type === "offer" && (
                <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-medium">
                  OFERTA
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <Switch checked={plan.isActive} onCheckedChange={() => togglePlanStatus(plan.id)} />
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${plan.price.toLocaleString("es-CL")}</span>
                  <span className="text-muted-foreground">
                    / {plan.duration} mes{plan.duration > 1 ? "es" : ""}
                  </span>
                </div>

                {plan.discount && (
                  <Badge variant="destructive" className="w-fit">
                    {plan.discount}% descuento
                  </Badge>
                )}

                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {plan.membersCount} socios
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(plan.id)}
                      className="text-destructive hover:text-destructive"
                      disabled={plan.membersCount > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
