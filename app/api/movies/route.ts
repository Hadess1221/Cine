import { NextResponse } from "next/server"

// Clave API protegida en el servidor
const API_KEY = ""
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Caché en memoria simple para reducir solicitudes a la API
const CACHE: Record<string, { data: any; timestamp: number }> = {}
const CACHE_TTL = 60 * 60 * 1000 // 1 hora en milisegundos

// Función para formatear los datos de películas
function formatMovies(movies: any[]) {
  return movies.map((movie) => ({
    id: movie.id.toString(),
    title: movie.title,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : "/placeholder.svg?height=600&width=400",
    backdrop: movie.backdrop_path
      ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
      : "/placeholder.svg?height=1080&width=1920",
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    popularity: movie.popularity,
    genre_ids: movie.genre_ids || [],
    rating: movie.adult ? "R" : "PG-13",
    synopsis: movie.overview,
    showTimes: movie.release_date && new Date(movie.release_date) <= new Date() ? generateShowTimes() : [],
    comingSoon: movie.release_date && new Date(movie.release_date) > new Date(),
  }))
}

// Función para generar horarios ficticios
function generateShowTimes() {
  const today = new Date()
  const showTimes = []

  for (let i = 0; i < 3; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    showTimes.push({
      date: date.toISOString().split("T")[0],
      times: ["14:30", "17:00", "19:30", "22:00"],
    })
  }

  return showTimes
}

// Función para obtener datos de la API con caché
async function fetchWithCache(url: string, cacheKey: string) {
  // Verificar si tenemos datos en caché y si son válidos
  if (CACHE[cacheKey] && Date.now() - CACHE[cacheKey].timestamp < CACHE_TTL) {
    console.log(`Usando datos en caché para: ${cacheKey}`)
    return CACHE[cacheKey].data
  }

  // Si no hay caché o expiró, hacer la solicitud a la API
  console.log(`Solicitando datos a la API para: ${cacheKey}`)

  // Implementar reintentos con backoff exponencial
  let retries = 3
  let delay = 1000 // Empezar con 1 segundo

  while (retries > 0) {
    try {
      const response = await fetch(url)

      // Manejar errores HTTP
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Error HTTP ${response.status}: ${errorText}`)

        // Si es un error de límite de solicitudes, esperar y reintentar
        if (response.status === 429) {
          retries--
          if (retries > 0) {
            console.log(`Límite de solicitudes excedido. Reintentando en ${delay}ms...`)
            await new Promise((resolve) => setTimeout(resolve, delay))
            delay *= 2 // Backoff exponencial
            continue
          }
          throw new Error(`Límite de solicitudes excedido: ${errorText}`)
        }

        throw new Error(`Error HTTP ${response.status}: ${errorText}`)
      }

      // Procesar respuesta exitosa
      const data = await response.json()

      // Guardar en caché
      CACHE[cacheKey] = {
        data,
        timestamp: Date.now(),
      }

      return data
    } catch (error) {
      retries--
      if (retries > 0) {
        console.log(`Error en la solicitud. Reintentando en ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        delay *= 2 // Backoff exponencial
      } else {
        throw error
      }
    }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const id = searchParams.get("id")
  const query = searchParams.get("query")

  try {
    let url = ""
    let cacheKey = ""

    if (type === "now_playing") {
      url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1&region=ES`
      cacheKey = "now_playing"
    } else if (type === "upcoming") {
      url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES&page=1&region=ES`
      cacheKey = "upcoming"
    } else if (type === "popular") {
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1&region=ES`
      cacheKey = "popular"
    } else if (type === "detail" && id) {
      url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos,similar`
      cacheKey = `detail_${id}`

      try {
        const movie = await fetchWithCache(url, cacheKey)

        // Formatear los detalles de la película
        const trailer = movie.videos?.results?.find(
          (video: any) => video.type === "Trailer" && video.site === "YouTube",
        )

        const formattedMovie = {
          id: movie.id.toString(),
          title: movie.title,
          originalTitle: movie.original_title,
          poster: movie.poster_path
            ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
            : "/placeholder.svg?height=600&width=400",
          backdrop: movie.backdrop_path
            ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
            : "/placeholder.svg?height=1080&width=1920",
          releaseDate: movie.release_date,
          duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`,
          genre: movie.genres.map((g: any) => g.name),
          rating: movie.adult ? "R" : "PG-13",
          synopsis: movie.overview,
          voteAverage: movie.vote_average,
          voteCount: movie.vote_count,
          popularity: movie.popularity,
          trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
          cast:
            movie.credits?.cast?.slice(0, 10).map((actor: any) => ({
              id: actor.id,
              name: actor.name,
              role: actor.character,
              profile: actor.profile_path ? `${IMAGE_BASE_URL}/w185${actor.profile_path}` : null,
            })) || [],
          director: movie.credits?.crew?.find((person: any) => person.job === "Director")?.name || "Desconocido",
          showTimes: movie.release_date && new Date(movie.release_date) <= new Date() ? generateShowTimes() : [],
          comingSoon: movie.release_date && new Date(movie.release_date) > new Date(),
          similar: formatMovies(movie.similar?.results?.slice(0, 4) || []),
        }

        return NextResponse.json(formattedMovie)
      } catch (error) {
        console.error(`Error al obtener detalles de la película ${id}:`, error)
        return NextResponse.json({ error: "Error al obtener detalles de la película" }, { status: 500 })
      }
    } else if (type === "search" && query) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1&include_adult=false`
      cacheKey = `search_${query}`
    } else {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 })
    }

    try {
      const data = await fetchWithCache(url, cacheKey)

      if (type === "search" || type === "now_playing" || type === "upcoming" || type === "popular") {
        return NextResponse.json({
          results: formatMovies(data.results),
          page: data.page,
          totalPages: data.total_pages,
          totalResults: data.total_results,
        })
      }

      return NextResponse.json(data)
    } catch (error) {
      console.error(`Error al obtener datos para ${type}:`, error)
      return NextResponse.json({ error: "Error al obtener datos de películas" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error en la API:", error)
    return NextResponse.json({ error: "Error al obtener datos de películas" }, { status: 500 })
  }
}

