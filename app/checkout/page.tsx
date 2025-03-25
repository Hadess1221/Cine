"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import { LoginModal } from "@/components/login-modal"
import { Loader2, CreditCard, Landmark } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    email: user?.email || "",
    name: user?.name || "",
    phone: "",
  })

  useEffect(() => {
    // Si no hay items en el carrito, redirigir a la cartelera
    if (items.length === 0) {
      router.push("/cartelera")
    }
  }, [items, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulamos el procesamiento del pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulamos la creación de tickets en el perfil del usuario
      if (user) {
        const tickets = items.map((item) => ({
          id: `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          movieId: item.movieId,
          movieTitle: item.movieTitle,
          date: item.date,
          time: item.time,
          seats: item.seats,
          cinema: "CineMax Centro",
          hall: "Sala 3",
          status: "confirmed",
        }))

        // Aquí se añadirían los tickets al perfil del usuario
        // En una implementación real, esto se haría a través de una API
      }

      // Limpiar el carrito
      clearCart()

      // Redirigir a la página de confirmación
      router.push("/checkout/confirmacion")
    } catch (error) {
      console.error("Error al procesar el pago:", error)
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
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
    <div className="container py-8 md:py-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">Finalizar Compra</h1>

      {!user ? (
        <div className="max-w-md mx-auto text-center py-8 md:py-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Inicia sesión para continuar</h2>
          <p className="text-muted-foreground mb-6">
            Para finalizar tu compra, necesitas iniciar sesión o crear una cuenta.
          </p>
          <LoginModal
            trigger={
              <Button size="lg" className="w-full">
                Iniciar Sesión / Registrarse
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid gap-6 md:gap-8 md:grid-cols-[1fr_400px]">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Información de Pago</CardTitle>
                <CardDescription>Completa la información para finalizar tu compra</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base md:text-lg font-medium">Información de contacto</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre completo</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Método de pago</h3>
                    <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                      <TabsList className="grid w-full grid-cols-3 text-xs md:text-sm">
                        <TabsTrigger value="card">Tarjeta</TabsTrigger>
                        <TabsTrigger value="transfer">Transferencia</TabsTrigger>
                        <TabsTrigger value="paypal">PayPal</TabsTrigger>
                      </TabsList>
                      <TabsContent value="card" className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Número de tarjeta</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            required={paymentMethod === "card"}
                          />
                        </div>
                        <div className="grid gap-4 grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry">Fecha de expiración</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/AA"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              required={paymentMethod === "card"}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cardCvc">CVC</Label>
                            <Input
                              id="cardCvc"
                              name="cardCvc"
                              placeholder="123"
                              value={formData.cardCvc}
                              onChange={handleInputChange}
                              required={paymentMethod === "card"}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="transfer" className="pt-4">
                        <div className="rounded-lg border p-4 bg-muted/50">
                          <div className="flex items-start gap-4">
                            <Landmark className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                            <div>
                              <h4 className="font-medium">Datos bancarios</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Realiza una transferencia a la siguiente cuenta:
                              </p>
                              <div className="mt-2 space-y-1 text-sm">
                                <p>
                                  <strong>Banco:</strong> Banco CineMax
                                </p>
                                <p>
                                  <strong>IBAN:</strong> ES12 3456 7890 1234 5678 9012
                                </p>
                                <p>
                                  <strong>Beneficiario:</strong> CineMax S.L.
                                </p>
                                <p>
                                  <strong>Concepto:</strong> Tu nombre y email
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="paypal" className="pt-4">
                        <div className="flex justify-center py-6">
                          <Button className="w-full max-w-xs" type="button">
                            <Image
                              src="/placeholder.svg?height=24&width=80"
                              alt="PayPal"
                              width={80}
                              height={24}
                              className="mr-2"
                            />
                            Pagar con PayPal
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pagar {formatCurrency(getTotal() + 2)}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div className="space-y-6 order-first md:order-last">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-18 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.posterUrl || "/placeholder.svg"}
                        alt={item.movieTitle}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm md:text-base">{item.movieTitle}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {new Date(item.date).toLocaleDateString()} - {item.time}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">Asientos: {item.seats.join(", ")}</p>
                      <p className="text-xs md:text-sm font-medium mt-1">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <Separator />
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(getTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cargo por servicio</span>
                    <span>{formatCurrency(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(getTotal() + 2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/cartelera">Seguir comprando</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

