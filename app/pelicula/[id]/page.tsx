import { Suspense } from "react"
import { MovieDetailSkeleton } from "@/components/skeletons"
import MovieDetail from "@/components/movie-detail"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { getMovieDetails } from "@/lib/tmdb-api"

export async function generateMetadata({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id)

  if (!movie) {
    return {
      title: "Película no encontrada | CineMax",
      description: "La película que buscas no está disponible.",
    }
  }

  return {
    title: `${movie.title} | CineMax`,
    description: movie.synopsis?.substring(0, 160) || "Descubre más sobre esta película en CineMax",
    openGraph: {
      title: `${movie.title} | CineMax`,
      description: movie.synopsis?.substring(0, 160) || "Descubre más sobre esta película en CineMax",
      images: [{ url: movie.backdrop || movie.poster }],
    },
  }
}

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieDetails(params.id)

  if (!movie) {
    return (
      <div className="container py-12">
        <ApiErrorFallback message="No pudimos cargar los detalles de esta película. Por favor, inténtalo de nuevo más tarde." />
      </div>
    )
  }

  return (
    <Suspense fallback={<MovieDetailSkeleton />}>
      <MovieDetail movie={movie} />
    </Suspense>
  )
}

