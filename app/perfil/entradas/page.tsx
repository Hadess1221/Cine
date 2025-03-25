"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Ticket } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ProfileSidebar } from "@/components/profile-sidebar"

// Tipo para las entradas
type TicketType = {
  id: string
  movieId: string
  movieTitle: string
  date: string
  time: string
  seats: string[]
  cinema?: string
  hall?: string
  status?: "confirmed" | "pending" | "cancelled"
}

export default function TicketsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!user) {
      router.push("/")
      return
    }

    // Cargar entradas (simulado)
    const loadTickets = async () => {
      setIsLoading(true)
      try {
        // Simulamos un retraso para mostrar el estado de carga
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Usar entradas del usuario o crear algunas de ejemplo si no tiene
        const userTickets = user.tickets || [
          {
            id: "1",
            movieId: "123",
            movieTitle: "El Último Horizonte",
            date: "2023-12-15",
            time: "19:30",
            seats: ["A12", "A13"],
            cinema: "CineMax Centro",
            hall: "Sala 3",
            status: "confirmed",
          },
          {
            id: "2",
            movieId: "456",
            movieTitle: "Secretos del Pasado",
            date: "2023-12-20",
            time: "21:00",
            seats: ["C5"],
            cinema: "CineMax Norte",
            hall: "Sala 1",
            status: "confirmed",
          },
        ]

        setTickets(userTickets as TicketType[])
      } catch (error) {
        console.error("Error al cargar entradas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTickets()
  }, [user, router])

  // Si no hay usuario, mostramos un estado de carga en lugar de redirigir inmediatamente
  if (!user) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Mis Entradas</h1>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <ProfileSidebar />

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Mis Entradas</CardTitle>
              <CardDescription>Historial de tus entradas compradas.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Cargando tus entradas...</p>
                </div>
              ) : tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="p-6 flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold">{ticket.movieTitle}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span>
                                  {format(new Date(ticket.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>{ticket.time}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPin className="mr-1 h-4 w-4" />
                                <span>
                                  {ticket.hall}, {ticket.cinema || "CineMax"}
                                </span>
                              </div>
                            </div>
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Ticket className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                          <div className="mt-4">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                              Confirmado
                            </div>
                            <p className="mt-2 text-sm">Asientos: {ticket.seats.join(", ")}</p>
                          </div>
                        </div>
                        <div className="bg-muted p-6 md:w-1/3 flex flex-col justify-between">
                          <div>
                            <p className="text-sm font-medium">Código QR</p>
                            <div className="mt-2 bg-white p-2 rounded-md w-32 h-32 flex items-center justify-center">
                              <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect x="10" y="10" width="30" height="30" fill="black" />
                                <rect x="60" y="10" width="30" height="30" fill="black" />
                                <rect x="10" y="60" width="30" height="30" fill="black" />
                                <rect x="60" y="60" width="30" height="10" fill="black" />
                                <rect x="60" y="80" width="10" height="10" fill="black" />
                                <rect x="80" y="60" width="10" height="30" fill="black" />
                              </svg>
                            </div>
                          </div>
                          <Button className="mt-4">Descargar</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-primary/10 p-4 rounded-full inline-flex mb-4">
                    <Ticket className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No tienes entradas</h3>
                  <p className="text-muted-foreground mb-6">
                    Aún no has comprado ninguna entrada. Explora nuestra cartelera y disfruta del mejor cine.
                  </p>
                  <Button asChild>
                    <a href="/cartelera">Ver Cartelera</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

