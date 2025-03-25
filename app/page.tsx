import Link from "next/link"
import { Button } from "@/components/ui/button"
import MovieCarousel from "@/components/movie-carousel"
import MovieCard from "@/components/movie-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Suspense } from "react"
import { MovieSkeleton } from "@/components/skeletons"
import { ApiErrorFallback } from "@/components/api-error-fallback"
import { getNowPlayingMovies, getUpcomingMovies, getPopularMovies } from "@/lib/tmdb-api"

// Componente para mostrar películas o un fallback
function MovieSection({
  movies,
  title,
  viewAllLink,
  columns = 4,
}: {
  movies: any[]
  title: string
  viewAllLink: string
  columns?: number
}) {
  if (!movies || movies.length === 0) {
    return (
      <ApiErrorFallback
        message="No pudimos cargar las películas en este momento. Por favor, inténtalo de nuevo más tarde."
        showHomeButton={false}
      />
    )
  }

  return (
    <section className="container">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href={viewAllLink}>Ver Todas</Link>
        </Button>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}

export default async function Home() {
  // Obtener datos de películas directamente de TMDB
  const nowPlayingMovies = await getNowPlayingMovies()
  const upcomingMovies = await getUpcomingMovies()
  const popularMovies = await getPopularMovies()

  // Usar solo las primeras películas para las secciones destacadas
  const featuredMovies = popularMovies.slice(0, 5) || []
  const nowPlayingFeatured = nowPlayingMovies.slice(0, 4) || []
  const upcomingFeatured = upcomingMovies.slice(0, 3) || []

  // Verificar si tenemos datos para mostrar
  const hasMovies = featuredMovies.length > 0 || nowPlayingFeatured.length > 0 || upcomingFeatured.length > 0

  if (!hasMovies) {
    return (
      <div className="container py-12">
        <ApiErrorFallback message="No pudimos cargar los datos de películas. Estamos experimentando problemas técnicos. Por favor, inténtalo de nuevo más tarde." />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-8 md:pb-12">
      <section>
        <Suspense fallback={<div className="aspect-[21/9] bg-muted animate-pulse rounded-lg" />}>
          {featuredMovies.length > 0 ? (
            <MovieCarousel movies={featuredMovies} />
          ) : (
            <div className="aspect-[21/9] bg-muted flex items-center justify-center rounded-lg">
              <p className="text-muted-foreground">No se pudieron cargar las películas destacadas</p>
            </div>
          )}
        </Suspense>
      </section>

      <Tabs defaultValue="cartelera" className="container">
        <TabsList className="mb-6">
          <TabsTrigger value="cartelera">En Cartelera</TabsTrigger>
          <TabsTrigger value="estrenos">Próximos Estrenos</TabsTrigger>
        </TabsList>

        <TabsContent value="cartelera" className="space-y-6">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <MovieSkeleton key={i} />
                ))}
              </div>
            }
          >
            {nowPlayingFeatured.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {nowPlayingFeatured.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Button asChild>
                    <Link href="/cartelera">Ver Todas las Películas</Link>
                  </Button>
                </div>
              </>
            ) : (
              <ApiErrorFallback
                message="No pudimos cargar las películas en cartelera. Por favor, inténtalo de nuevo más tarde."
                showHomeButton={false}
              />
            )}
          </Suspense>
        </TabsContent>

        <TabsContent value="estrenos" className="space-y-6">
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <MovieSkeleton key={i} />
                ))}
              </div>
            }
          >
            {upcomingFeatured.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {upcomingFeatured.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
                <div className="flex justify-center mt-6">
                  <Button asChild>
                    <Link href="/proximos-estrenos">Ver Todos los Estrenos</Link>
                  </Button>
                </div>
              </>
            ) : (
              <ApiErrorFallback
                message="No pudimos cargar los próximos estrenos. Por favor, inténtalo de nuevo más tarde."
                showHomeButton={false}
              />
            )}
          </Suspense>
        </TabsContent>
      </Tabs>

      <section className="container py-8 md:py-12 px-4 md:px-8 bg-gradient-to-br from-primary/10 to-background rounded-lg">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4">¿Por qué elegir CineMax?</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Disfruta de la mejor experiencia cinematográfica con nuestras instalaciones de última generación y servicios
            premium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          <div className="bg-card/50 backdrop-blur-sm p-4 md:p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-card">
            <div className="bg-primary/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 md:w-8 md:h-8 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-center">Pantallas 4K</h3>
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              Disfruta de la mejor calidad de imagen con nuestras pantallas 4K de última generación.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-4 md:p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-card">
            <div className="bg-primary/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 md:w-8 md:h-8 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-center">Sonido Envolvente</h3>
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              Sumérgete en la acción con nuestro sistema de sonido Dolby Atmos.
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-4 md:p-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:bg-card">
            <div className="bg-primary/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 md:w-8 md:h-8 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1 .53 0L12.5 3.5l.265-.39a.375.375 0 1 1 .53 0l.265.39.265-.39a.375.375 0 1 1 .53 0l.265.39.265-.39a.375.375 0 1 1 .53 0l.265.39.265-.39a.375.375 0 1 1 .53 0l.265.39.265-.39a.375.375 0 1 1 .53 0l.265.39.265-.39a.375.375 0 1 1 .53 0l.265.39.265-.39a.375.375 0 1 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0l.265.39.265-.39a.375.375 0 0 1 .53 0"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2 text-center">Snack Bar Premium</h3>
            <p className="text-xs md:text-sm text-muted-foreground text-center">
              Disfruta de nuestras palomitas gourmet y una amplia selección de bebidas y snacks.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

