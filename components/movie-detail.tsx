"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, X, Star, Play, Share2, Heart, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { cn, formatCurrency } from "@/lib/utils"
import MovieCard from "@/components/movie-card"
import { useAuth } from "@/contexts/auth-context"
import { LoginModal } from "@/components/login-modal"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"

interface MovieDetailProps {
  movie: any
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showTrailer, setShowTrailer] = useState(searchParams.get("trailer") === "true")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const { user, addToFavorites, removeFromFavorites, isMovieFavorite } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    if (user && movie) {
      setIsFavorite(isMovieFavorite(movie.id))
    }
  }, [user, movie, isMovieFavorite])

  useEffect(() => {
    if (showTrailer) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showTrailer])

  const isComingSoon = movie.comingSoon || movie.showTimes?.length === 0

  const handleCloseTrailer = () => {
    setShowTrailer(false)
    router.push(`/pelicula/${movie.id}`, { scroll: false })
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setSelectedSeats([])
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    setSelectedSeats([])
  }

  const handleSeatToggle = (seat: string) => {
    setSelectedSeats((prev) => (prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]))
  }

  const handleToggleFavorite = () => {
    if (!user) {
      return
    }

    if (isFavorite) {
      removeFromFavorites(movie.id)
    } else {
      addToFavorites(movie.id)
    }
    setIsFavorite(!isFavorite)
  }

  const handleAddToCart = () => {
    if (!selectedDate || !selectedTime || selectedSeats.length === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona fecha, hora y asientos",
        variant: "destructive",
      })
      return
    }

    // Precio por asiento: 10€
    const price = selectedSeats.length * 10

    addItem({
      id: `${movie.id}-${selectedDate}-${selectedTime}-${selectedSeats.join(",")}`,
      movieId: movie.id,
      movieTitle: movie.title,
      date: selectedDate,
      time: selectedTime,
      seats: selectedSeats,
      price: price,
      posterUrl: movie.poster,
    })

    // Limpiar selección
    setSelectedSeats([])

    // Ir a la primera pestaña
    document.getElementById("horarios-tab")?.click()

    // Mostrar toast de confirmación
    toast({
      title: "Entradas añadidas al carrito",
      description: `Se han añadido ${selectedSeats.length} entradas para ${movie.title}`,
    })
  }

  // Generar asientos con algunos ocupados aleatoriamente
  const generateSeats = () => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const seatsPerRow = 10
    const occupiedSeats = new Set()

    // Generar algunos asientos ocupados aleatoriamente
    for (let i = 0; i < 20; i++) {
      const row = rows[Math.floor(Math.random() * rows.length)]
      const seat = Math.floor(Math.random() * seatsPerRow) + 1
      occupiedSeats.add(`${row}${seat}`)
    }

    return { rows, seatsPerRow, occupiedSeats }
  }

  const { rows, seatsPerRow, occupiedSeats } = generateSeats()

  return (
    <>
      {showTrailer && movie.trailer && (
        <div className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full"
            onClick={handleCloseTrailer}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Cerrar</span>
          </Button>
          <div className="w-full max-w-4xl aspect-video">
            <iframe
              src={movie.trailer}
              title={`Trailer de ${movie.title}`}
              className="w-full h-full rounded-lg"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0">
          <Image
            src={movie.backdrop || "/placeholder.svg?height=1080&width=1920"}
            alt={movie.title}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>

        <div className="container relative py-8 md:py-12">
          <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] md:gap-12">
            <div className="mx-auto md:mx-0" style={{ maxWidth: "300px" }}>
              <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={movie.poster || "/placeholder.svg?height=600&width=400"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 300px, 400px"
                />

                {movie.voteAverage > 0 && (
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1.5 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-medium">{movie.voteAverage.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genre?.map((genre: string) => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {movie.voteAverage > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Puntuación de usuarios</span>
                      <span className="font-medium">{movie.voteAverage.toFixed(1)}/10</span>
                    </div>
                    <Progress value={movie.voteAverage * 10} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Basado en {movie.voteCount?.toLocaleString() || "0"} votos
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {user ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn("flex-1 gap-1", isFavorite && "bg-primary/10 text-primary border-primary/50")}
                      onClick={handleToggleFavorite}
                    >
                      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                      <span>{isFavorite ? "Favorito" : "Añadir a favoritos"}</span>
                    </Button>
                  ) : (
                    <LoginModal
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1 gap-1">
                          <Heart className="h-4 w-4" />
                          <span>Añadir a favoritos</span>
                        </Button>
                      }
                    />
                  )}
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Share2 className="h-4 w-4" />
                    <span>Compartir</span>
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{movie.title}</h1>

              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="text-muted-foreground mb-4">{movie.originalTitle}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground mb-6 text-sm md:text-base">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>
                    {new Date(movie.releaseDate).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>{movie.rating}</div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Sinopsis</h2>
                <p className="text-muted-foreground">{movie.synopsis}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Director</h2>
                <p className="text-muted-foreground">{movie.director}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Reparto Principal</h2>
                <ScrollArea className="whitespace-nowrap pb-4">
                  <div className="flex gap-4">
                    {movie.cast.map((actor: any) => (
                      <div key={actor.id || actor.name} className="text-center w-[100px]">
                        <Avatar className="w-20 h-20 mx-auto mb-2">
                          {actor.profile ? <AvatarImage src={actor.profile} alt={actor.name} /> : null}
                          <AvatarFallback className="text-lg">
                            {actor.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-sm truncate">{actor.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{actor.role}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex flex-wrap gap-3 mb-6 md:mb-0">
                {!isComingSoon && (
                  <Button asChild className="gap-2 text-sm">
                    <Link href="#horarios">
                      <Ticket className="h-4 w-4" />
                      Comprar Entradas
                    </Link>
                  </Button>
                )}

                {movie.trailer && (
                  <Button
                    variant="outline"
                    className="gap-2 text-sm"
                    onClick={() => {
                      setShowTrailer(true)
                      router.push(`/pelicula/${movie.id}?trailer=true`, { scroll: false })
                    }}
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Ver Trailer
                  </Button>
                )}
              </div>
            </div>
          </div>

          {!isComingSoon && (
            <div id="horarios" className="mt-12 pt-6 border-t">
              <h2 className="text-2xl font-bold mb-6">Horarios y Entradas</h2>

              <Tabs defaultValue="horarios" className="w-full">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="horarios" id="horarios-tab" className="flex-1">
                    Horario
                  </TabsTrigger>
                  <TabsTrigger value="asientos" disabled={!selectedTime} className="flex-1">
                    Asientos
                  </TabsTrigger>
                  <TabsTrigger value="resumen" disabled={!selectedSeats.length} className="flex-1">
                    Resumen
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="horarios">
                  <Card className="p-4 md:p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-4">Selecciona una fecha:</h3>
                      <div className="flex flex-wrap gap-2">
                        {movie.showTimes.map((showTime: any) => (
                          <Button
                            key={showTime.date}
                            variant={selectedDate === showTime.date ? "default" : "outline"}
                            onClick={() => handleDateSelect(showTime.date)}
                            className="flex flex-col h-auto py-2 md:py-3"
                          >
                            <span className="text-xs opacity-80">
                              {new Date(showTime.date).toLocaleDateString("es-ES", {
                                weekday: "short",
                              })}
                            </span>
                            <span className="text-base md:text-lg font-bold">{new Date(showTime.date).getDate()}</span>
                            <span className="text-xs opacity-80">
                              {new Date(showTime.date).toLocaleDateString("es-ES", {
                                month: "short",
                              })}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {selectedDate && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Selecciona un horario:</h3>
                        <div className="flex flex-wrap gap-2">
                          {movie.showTimes
                            .find((st: any) => st.date === selectedDate)
                            ?.times.map((time: string) => (
                              <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                onClick={() => handleTimeSelect(time)}
                              >
                                {time}
                              </Button>
                            ))}
                        </div>
                      </div>
                    )}

                    {selectedTime && (
                      <div className="mt-6 flex justify-end">
                        <Button onClick={() => document.getElementById("asientos-tab")?.click()}>
                          Continuar a Selección de Asientos
                        </Button>
                      </div>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="asientos" id="asientos-tab">
                  <Card className="p-4 md:p-6">
                    <h3 className="text-lg font-medium mb-4">Selecciona tus asientos:</h3>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-2xl mb-8 overflow-x-auto">
                        <div className="bg-muted p-2 text-center mb-6 rounded-t-md">PANTALLA</div>
                        <div className="grid grid-cols-10 gap-1 md:gap-2 max-w-full min-w-[500px]">
                          {rows.map((row) => (
                            <React.Fragment key={row}>
                              {Array.from({ length: seatsPerRow }).map((_, i) => {
                                const seatNumber = i + 1
                                const seatId = `${row}${seatNumber}`
                                const isOccupied = occupiedSeats.has(seatId)
                                const isSelected = selectedSeats.includes(seatId)

                                return (
                                  <Button
                                    key={seatId}
                                    variant={isSelected ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                      "aspect-square p-0 min-w-0 text-xs",
                                      isOccupied ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" : "",
                                      isSelected ? "bg-primary text-primary-foreground" : "",
                                    )}
                                    disabled={isOccupied}
                                    onClick={() => handleSeatToggle(seatId)}
                                  >
                                    {seatId}
                                  </Button>
                                )
                              })}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 mb-6 flex-wrap justify-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm border"></div>
                          <span className="text-sm">Disponible</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-primary"></div>
                          <span className="text-sm">Seleccionado</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-sm bg-muted"></div>
                          <span className="text-sm">Ocupado</span>
                        </div>
                      </div>

                      {selectedSeats.length > 0 && (
                        <div className="mt-6 flex justify-between w-full">
                          <Button variant="outline" onClick={() => document.getElementById("horarios-tab")?.click()}>
                            Volver a Horarios
                          </Button>
                          <Button onClick={() => document.getElementById("resumen-tab")?.click()}>
                            Continuar a Resumen ({selectedSeats.length}{" "}
                            {selectedSeats.length === 1 ? "asiento" : "asientos"})
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="resumen" id="resumen-tab">
                  <Card className="p-4 md:p-6">
                    <h3 className="text-lg font-medium mb-4">Resumen de compra:</h3>
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span>Película:</span>
                        <span className="font-medium">{movie.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fecha:</span>
                        <span className="font-medium">
                          {selectedDate &&
                            new Date(selectedDate).toLocaleDateString("es-ES", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hora:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Asientos:</span>
                        <span className="font-medium">{selectedSeats.sort().join(", ")}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Precio por entrada:</span>
                        <span className="font-medium">{formatCurrency(10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">{formatCurrency(selectedSeats.length * 10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cargo por servicio:</span>
                        <span className="font-medium">{formatCurrency(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-lg font-bold">Total:</span>
                        <span className="text-lg font-bold">{formatCurrency(selectedSeats.length * 10 + 2)}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between gap-2">
                      <Button variant="outline" onClick={() => document.getElementById("asientos-tab")?.click()}>
                        Volver a Asientos
                      </Button>
                      <Button onClick={handleAddToCart}>Añadir al Carrito</Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {movie.similar && movie.similar.length > 0 && (
            <div className="mt-12 pt-6 border-t">
              <h2 className="text-2xl font-bold mb-6">Películas Similares</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {movie.similar.map((similarMovie: any) => (
                  <MovieCard key={similarMovie.id} movie={similarMovie} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

