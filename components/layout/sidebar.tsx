"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dumbbell,
  Users,
  CreditCard,
  Calendar,
  ClipboardCheck,
  BarChart3,
  Package,
  Clock,
  Settings,
  LogOut,
  Menu,
  X,
  UserCog,
} from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  className?: string
}

const adminNavItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: UserCog, label: "Usuarios", href: "/usuarios" },
  { icon: Users, label: "Socios", href: "/socios" },
  { icon: CreditCard, label: "Membresías", href: "/membresias" },
  { icon: CreditCard, label: "Pagos", href: "/pagos" },
  { icon: Calendar, label: "Clases", href: "/clases" },
  { icon: Dumbbell, label: "Entrenadores", href: "/entrenadores" },
  { icon: ClipboardCheck, label: "Asistencia", href: "/asistencia" },
  { icon: Package, label: "Inventario", href: "/inventario" },
  { icon: Clock, label: "Turnos", href: "/turnos" },
  { icon: BarChart3, label: "Reportes", href: "/reportes" },
  { icon: Settings, label: "Configuración", href: "/configuracion" },
]

const trainerNavItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Mis Clases", href: "/mis-clases" },
  { icon: Users, label: "Mis Clientes", href: "/mis-clientes" },
  { icon: ClipboardCheck, label: "Asistencia", href: "/asistencia" },
  { icon: Package, label: "Inventario", href: "/inventario" },
]

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = user?.role === "admin" ? adminNavItems : trainerNavItems

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="bg-sidebar-primary p-2 rounded-lg">
              <Dumbbell className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-sidebar-foreground">Mundo Fitness</h2>
              <p className="text-xs text-muted-foreground">Chimbarongo</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="bg-sidebar-accent p-2 rounded-full">
              <Users className="h-4 w-4 text-sidebar-accent-foreground" />
            </div>
            <div>
              <p className="font-medium text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 p-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed ? "px-2" : "px-3",
                  pathname === item.href && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <item.icon className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
                {!isCollapsed && item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={logout}
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground",
            isCollapsed ? "px-2" : "px-3",
          )}
        >
          <LogOut className={cn("h-4 w-4", isCollapsed ? "" : "mr-3")} />
          {!isCollapsed && "Cerrar Sesión"}
        </Button>
      </div>
    </div>
  )
}
