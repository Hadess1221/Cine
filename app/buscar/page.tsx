import MovieCard from "@/components/movie-card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { searchMovies } from "@/lib/tmdb-api"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""

  // Si no hay consulta, mostrar mensaje
  if (!query) {
    return (
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Resultados de búsqueda</h1>
        <p className="text-muted-foreground mb-8">Ingresa un término de búsqueda</p>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No has ingresado ningún término de búsqueda</h2>
          <p className="text-muted-foreground mb-6">
            Utiliza la barra de búsqueda para encontrar películas por título, actor o director.
          </p>
          <Button asChild>
            <Link href="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  try {
    const movies = await searchMovies(query)

    return (
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Resultados de búsqueda</h1>
        <p className="text-muted-foreground mb-8">
          {query ? `Mostrando resultados para "${query}"` : "Ingresa un término de búsqueda"}
        </p>

        {movies.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {movies.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} featured={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No se encontraron resultados</h2>
            <p className="text-muted-foreground mb-6">
              No encontramos películas que coincidan con tu búsqueda. Intenta con otros términos.
            </p>
            <Button asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error en la página de búsqueda:", error)
    return (
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-2">Resultados de búsqueda</h1>
        <p className="text-muted-foreground mb-8">
          {query ? `Mostrando resultados para "${query}"` : "Ingresa un término de búsqueda"}
        </p>
        <ApiErrorFallback message="No pudimos procesar tu búsqueda en este momento. Por favor, inténtalo de nuevo más tarde." />
      </div>
    )
  }
}

