"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ProfileSidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  if (!user) return null

  // Obtener iniciales para el avatar de manera segura
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  const menuItems = [
    { href: "/perfil", label: "Mi Perfil" },
    { href: "/perfil/entradas", label: "Mis Entradas" },
    { href: "/perfil/favoritos", label: "Favoritos" },
    { href: "/perfil/configuracion", label: "Configuración" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menú</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href ? "bg-muted font-medium" : "text-muted-foreground",
                )}
                asChild
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}

