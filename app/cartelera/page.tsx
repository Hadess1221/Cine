import MovieCard from "@/components/movie-card"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { getNowPlayingMovies } from "@/lib/tmdb-api"

export default async function Cartelera() {
  const currentMovies = await getNowPlayingMovies()

  if (!currentMovies.length) {
    return (
      <div className="container py-12">
        <ApiErrorFallback message="No pudimos cargar las películas en cartelera. Por favor, inténtalo de nuevo más tarde." />
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Películas en Cartelera</h1>
      <div className="grid grid-cols-1 gap-8">
        {currentMovies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} featured={true} />
        ))}
      </div>
    </div>
  )
}

