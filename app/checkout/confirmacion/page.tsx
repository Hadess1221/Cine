"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function ConfirmacionPage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Si no hay usuario, redirigir a la página principal
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12 max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-green-500" />
          </div>
          <CardTitle className="text-xl md:text-2xl">¡Compra Completada!</CardTitle>
          <CardDescription>Tu compra se ha realizado con éxito</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm md:text-base">
            Hemos enviado un correo electrónico a <strong>{user.email}</strong> con los detalles de tu compra y tus
            entradas.
          </p>
          <p className="text-sm md:text-base">
            También puedes ver tus entradas en la sección <strong>Mis Entradas</strong> de tu perfil.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/perfil/entradas">Ver Mis Entradas</Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

