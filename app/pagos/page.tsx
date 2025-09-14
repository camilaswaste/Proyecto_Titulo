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
import { CreditCard, Plus, Search, Receipt, DollarSign, TrendingUp, Calendar, FileText, Download } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"

interface Payment {
  id: string
  memberId: string
  memberName: string
  membershipType: string
  amount: number
  paymentMethod: "cash" | "card" | "transfer" | "other"
  paymentDate: string
  dueDate: string
  status: "paid" | "pending" | "overdue"
  receiptNumber: string
  notes?: string
  processedBy: string
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: "1",
    memberId: "1",
    memberName: "Juan Pérez González",
    membershipType: "Premium",
    amount: 45000,
    paymentMethod: "card",
    paymentDate: "2024-01-15",
    dueDate: "2024-01-15",
    status: "paid",
    receiptNumber: "REC-2024-001",
    processedBy: "Carlos Administrador",
  },
  {
    id: "2",
    memberId: "2",
    memberName: "Ana Silva Morales",
    membershipType: "Básico",
    amount: 25000,
    paymentMethod: "cash",
    paymentDate: "2024-01-20",
    dueDate: "2024-01-20",
    status: "paid",
    receiptNumber: "REC-2024-002",
    processedBy: "Carlos Administrador",
  },
  {
    id: "3",
    memberId: "3",
    memberName: "Pedro Martínez López",
    membershipType: "Premium",
    amount: 45000,
    paymentMethod: "transfer",
    paymentDate: "",
    dueDate: "2024-01-25",
    status: "overdue",
    receiptNumber: "",
    processedBy: "",
  },
  {
    id: "4",
    memberId: "4",
    memberName: "María González",
    membershipType: "VIP",
    amount: 65000,
    paymentMethod: "card",
    paymentDate: "",
    dueDate: "2024-01-30",
    status: "pending",
    receiptNumber: "",
    processedBy: "",
  },
]

const paymentMethods = [
  { id: "cash", name: "Efectivo", icon: DollarSign },
  { id: "card", name: "Tarjeta", icon: CreditCard },
  { id: "transfer", name: "Transferencia", icon: TrendingUp },
  { id: "other", name: "Otro", icon: FileText },
]

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [methodFilter, setMethodFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    membershipType: "",
    amount: "",
    paymentMethod: "cash" as "cash" | "card" | "transfer" | "other",
    notes: "",
  })

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.paymentMethod === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault()

    const today = new Date().toISOString().split("T")[0]
    const receiptNumber = `REC-${new Date().getFullYear()}-${String(payments.length + 1).padStart(3, "0")}`

    if (selectedPayment) {
      // Process existing pending payment
      setPayments(
        payments.map((payment) =>
          payment.id === selectedPayment.id
            ? {
                ...payment,
                amount: Number.parseInt(formData.amount),
                paymentMethod: formData.paymentMethod,
                paymentDate: today,
                status: "paid" as const,
                receiptNumber,
                notes: formData.notes,
                processedBy: "Carlos Administrador", // En producción sería el usuario actual
              }
            : payment,
        ),
      )
    } else {
      // Create new payment record
      const newPayment: Payment = {
        id: Date.now().toString(),
        memberId: formData.memberId,
        memberName: formData.memberName,
        membershipType: formData.membershipType,
        amount: Number.parseInt(formData.amount),
        paymentMethod: formData.paymentMethod,
        paymentDate: today,
        dueDate: today,
        status: "paid",
        receiptNumber,
        notes: formData.notes,
        processedBy: "Carlos Administrador",
      }
      setPayments([...payments, newPayment])
    }

    // Reset form
    setFormData({
      memberId: "",
      memberName: "",
      membershipType: "",
      amount: "",
      paymentMethod: "cash",
      notes: "",
    })
    setSelectedPayment(null)
    setIsDialogOpen(false)
  }

  const handleProcessPendingPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setFormData({
      memberId: payment.memberId,
      memberName: payment.memberName,
      membershipType: payment.membershipType,
      amount: payment.amount.toString(),
      paymentMethod: "cash",
      notes: "",
    })
    setIsDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Pagado"
      case "pending":
        return "Pendiente"
      case "overdue":
        return "Vencido"
      default:
        return status
    }
  }

  const getMethodIcon = (method: string) => {
    const methodData = paymentMethods.find((m) => m.id === method)
    return methodData ? methodData.icon : DollarSign
  }

  const getMethodLabel = (method: string) => {
    const methodData = paymentMethods.find((m) => m.id === method)
    return methodData ? methodData.name : method
  }

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const overdueAmount = payments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0)

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-balance">Gestión de Pagos</h1>
            <p className="text-muted-foreground">Administra los pagos de membresías y genera comprobantes</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedPayment(null)
                  setFormData({
                    memberId: "",
                    memberName: "",
                    membershipType: "",
                    amount: "",
                    paymentMethod: "cash",
                    notes: "",
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Registrar Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{selectedPayment ? "Procesar Pago Pendiente" : "Registrar Nuevo Pago"}</DialogTitle>
                <DialogDescription>
                  {selectedPayment
                    ? "Completa la información para procesar este pago."
                    : "Registra un nuevo pago de membresía."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleProcessPayment}>
                <div className="grid gap-4 py-4">
                  {!selectedPayment && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="memberName">Socio *</Label>
                        <Input
                          id="memberName"
                          value={formData.memberName}
                          onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                          placeholder="Nombre del socio"
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
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Básico">Básico - $25.000</SelectItem>
                            <SelectItem value="Premium">Premium - $45.000</SelectItem>
                            <SelectItem value="VIP">VIP - $65.000</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {selectedPayment && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium">{selectedPayment.memberName}</h4>
                      <p className="text-sm text-muted-foreground">{selectedPayment.membershipType}</p>
                      <p className="text-sm text-muted-foreground">
                        Vencimiento: {new Date(selectedPayment.dueDate).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="amount">Monto (CLP) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="45000"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de pago *</Label>
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(value: "cash" | "card" | "transfer" | "other") =>
                        setFormData({ ...formData, paymentMethod: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona método" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas adicionales</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Observaciones sobre el pago..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">{selectedPayment ? "Procesar Pago" : "Registrar Pago"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString("es-CL")}</div>
              <p className="text-xs text-muted-foreground">
                {payments.filter((p) => p.status === "paid").length} pagos procesados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pendingAmount.toLocaleString("es-CL")}</div>
              <p className="text-xs text-muted-foreground">
                {payments.filter((p) => p.status === "pending").length} pagos pendientes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Vencidos</CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">${overdueAmount.toLocaleString("es-CL")}</div>
              <p className="text-xs text-muted-foreground">
                {payments.filter((p) => p.status === "overdue").length} pagos vencidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{payments.length}</div>
              <p className="text-xs text-muted-foreground">Este mes</p>
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
                  placeholder="Buscar pagos..."
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
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="paid">Pagados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="overdue">Vencidos</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="card">Tarjeta</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Registro completo de todos los pagos de membresías</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Socio</TableHead>
                  <TableHead>Membresía</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Pago</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const MethodIcon = getMethodIcon(payment.paymentMethod)
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payment.memberName}</div>
                          <div className="text-sm text-muted-foreground">ID: {payment.memberId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{payment.membershipType}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">${payment.amount.toLocaleString("es-CL")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4" />
                          {getMethodLabel(payment.paymentMethod)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(payment.status) as any}>{getStatusLabel(payment.status)}</Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString("es-CL") : "Pendiente"}
                      </TableCell>
                      <TableCell>
                        {payment.receiptNumber && (
                          <Button variant="ghost" size="sm">
                            <Receipt className="h-4 w-4 mr-1" />
                            {payment.receiptNumber}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.status !== "paid" && (
                          <Button variant="outline" size="sm" onClick={() => handleProcessPendingPayment(payment)}>
                            Procesar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
