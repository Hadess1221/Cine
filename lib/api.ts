// Clave API proporcionada
const API_KEY = ""

// URL base para la API de TMDB (asumiendo que es esta API)
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

// Función para obtener películas en cartelera
export async function getNowPlayingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1&region=ES`)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return formatMovies(data.results)
  } catch (error) {
    console.error("Error fetching now playing movies:", error)
    return []
  }
}

// Función para obtener próximos estrenos
export async function getUpcomingMovies() {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES&page=1&region=ES`)

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return formatMovies(data.results)
  } catch (error) {
    console.error("Error fetching upcoming movies:", error)
    return []
  }
}

// Función para obtener detalles de una película
export async function getMovieDetails(movieId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos`,
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return formatMovieDetails(data)
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error)
    return null
  }
}

// Función para buscar películas
export async function searchMovies(query: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1&include_adult=false`,
    )

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`)
    }

    const data = await response.json()
    return formatMovies(data.results)
  } catch (error) {
    console.error("Error searching movies:", error)
    return []
  }
}

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
    genre: [], // Se llenaría con los géneros si tuviéramos esa información
    rating: movie.adult ? "R" : "PG-13", // Simplificado, en realidad TMDB no proporciona clasificación por edad directamente
    synopsis: movie.overview,
    // Generamos horarios ficticios para las películas en cartelera
    showTimes: movie.release_date && new Date(movie.release_date) <= new Date() ? generateShowTimes() : [],
    comingSoon: movie.release_date && new Date(movie.release_date) > new Date(),
  }))
}

// Función para formatear los detalles de una película
function formatMovieDetails(movie: any) {
  const trailer = movie.videos?.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube")

  return {
    id: movie.id.toString(),
    title: movie.title,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}/w500${movie.poster_path}` : "/placeholder.svg?height=600&width=400",
    backdrop: movie.backdrop_path
      ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
      : "/placeholder.svg?height=1080&width=1920",
    releaseDate: movie.release_date,
    duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`,
    genre: movie.genres.map((g: any) => g.name),
    rating: movie.adult ? "R" : "PG-13",
    synopsis: movie.overview,
    trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast:
      movie.credits?.cast?.slice(0, 10).map((actor: any) => ({
        name: actor.name,
        role: actor.character,
      })) || [],
    director: movie.credits?.crew?.find((person: any) => person.job === "Director")?.name || "Desconocido",
    showTimes: movie.release_date && new Date(movie.release_date) <= new Date() ? generateShowTimes() : [],
    comingSoon: movie.release_date && new Date(movie.release_date) > new Date(),
  }
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

