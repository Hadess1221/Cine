import MovieCard from "@/components/movie-card"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { getUpcomingMovies } from "@/lib/tmdb-api"

export default async function ProximosEstrenos() {
  const comingSoonMovies = await getUpcomingMovies()

  if (!comingSoonMovies.length) {
    return (
      <div className="container py-12">
        <ApiErrorFallback message="No pudimos cargar los próximos estrenos. Por favor, inténtalo de nuevo más tarde." />
      </div>
    )
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Próximos Estrenos</h1>
      <div className="grid grid-cols-1 gap-8">
        {comingSoonMovies.map((movie: any) => (
          <MovieCard key={movie.id} movie={movie} featured={true} />
        ))}
      </div>
    </div>
  )
}

