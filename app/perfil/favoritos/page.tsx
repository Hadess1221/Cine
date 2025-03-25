"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Trash2 } from "lucide-react"
import MovieCard from "@/components/movie-card"
import { ProfileSidebar } from "@/components/profile-sidebar"

export default function FavoritesPage() {
  const { user, removeFromFavorites } = useAuth()
  const router = useRouter()
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!user) {
      router.push("/")
      return
    }

    // Cargar películas favoritas
    const fetchFavorites = async () => {
      setIsLoading(true)
      try {
        // Simulamos la carga de películas favoritas
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // En un caso real, haríamos una llamada a la API para obtener los detalles de las películas favoritas
        // Aquí simulamos algunas películas
        const mockFavorites = [
          {
            id: "1",
            title: "El Último Horizonte",
            poster: "/placeholder.svg?height=600&width=400",
            releaseDate: "2023-10-15",
            voteAverage: 8.5,
            genre: ["Ciencia Ficción", "Aventura"],
            synopsis:
              "En un futuro distante, un grupo de exploradores debe viajar más allá de los límites conocidos del espacio para encontrar un nuevo hogar para la humanidad.",
          },
          {
            id: "2",
            title: "Secretos del Pasado",
            poster: "/placeholder.svg?height=600&width=400",
            releaseDate: "2023-09-28",
            voteAverage: 7.8,
            genre: ["Drama", "Misterio"],
            synopsis:
              "Un detective retirado se ve obligado a enfrentar un caso sin resolver de su pasado cuando nuevas pistas salen a la luz después de 20 años.",
          },
        ]

        setFavoriteMovies(mockFavorites)
      } catch (error) {
        console.error("Error al cargar favoritos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
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

  const handleRemoveFavorite = (movieId: string) => {
    removeFromFavorites(movieId)
    setFavoriteMovies((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Mis Favoritos</h1>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <ProfileSidebar />

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Películas Favoritas</CardTitle>
              <CardDescription>Películas que has marcado como favoritas.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-muted-foreground">Cargando tus favoritos...</p>
                </div>
              ) : favoriteMovies.length > 0 ? (
                <div className="grid gap-6">
                  {favoriteMovies.map((movie) => (
                    <div key={movie.id} className="relative">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10"
                        onClick={() => handleRemoveFavorite(movie.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Eliminar de favoritos</span>
                      </Button>
                      <MovieCard movie={movie} featured={true} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-primary/10 p-4 rounded-full inline-flex mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No tienes favoritos</h3>
                  <p className="text-muted-foreground mb-6">
                    Aún no has añadido ninguna película a tus favoritos. Explora nuestra cartelera y marca las películas
                    que te gusten.
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

