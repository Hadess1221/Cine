"use client"

import { useState, useEffect } from "react"

// Clave API proporcionada
const API_KEY = ""

// URL base para la API de TMDB
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p"

interface FetchMoviesOptions {
  type: "now_playing" | "upcoming" | "popular" | "detail" | "search"
  id?: string
  query?: string
}

export function useMovies({ type, id, query }: FetchMoviesOptions) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      setError(null)

      try {
        let url = ""

        switch (type) {
          case "now_playing":
            url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1&region=ES`
            break
          case "upcoming":
            url = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES&page=1&region=ES`
            break
          case "popular":
            url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1&region=ES`
            break
          case "detail":
            if (id) {
              url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits,videos,similar`
            }
            break
          case "search":
            if (query) {
              url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1&include_adult=false`
            }
            break
        }

        if (!url) {
          throw new Error("URL inválida")
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const result = await response.json()

        // Formatear los datos según el tipo de solicitud
        if (type === "detail" && result) {
          const trailer = result.videos?.results?.find(
            (video: any) => video.type === "Trailer" && video.site === "YouTube",
          )

          const formattedMovie = {
            id: result.id.toString(),
            title: result.title,
            originalTitle: result.original_title,
            poster: result.poster_path
              ? `${IMAGE_BASE_URL}/w500${result.poster_path}`
              : "/placeholder.svg?height=600&width=400",
            backdrop: result.backdrop_path
              ? `${IMAGE_BASE_URL}/original${result.backdrop_path}`
              : "/placeholder.svg?height=1080&width=1920",
            releaseDate: result.release_date,
            duration: `${Math.floor(result.runtime / 60)}h ${result.runtime % 60}m`,
            genre: result.genres.map((g: any) => g.name),
            rating: result.adult ? "R" : "PG-13",
            synopsis: result.overview,
            voteAverage: result.vote_average,
            voteCount: result.vote_count,
            popularity: result.popularity,
            trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : null,
            cast:
              result.credits?.cast?.slice(0, 10).map((actor: any) => ({
                id: actor.id,
                name: actor.name,
                role: actor.character,
                profile: actor.profile_path ? `${IMAGE_BASE_URL}/w185${actor.profile_path}` : null,
              })) || [],
            director: result.credits?.crew?.find((person: any) => person.job === "Director")?.name || "Desconocido",
            showTimes: result.release_date && new Date(result.release_date) <= new Date() ? generateShowTimes() : [],
            comingSoon: result.release_date && new Date(result.release_date) > new Date(),
            similar: formatMovies(result.similar?.results?.slice(0, 4) || []),
          }

          setData(formattedMovie)
        } else if (["now_playing", "upcoming", "popular", "search"].includes(type) && result.results) {
          setData(formatMovies(result.results))
        } else {
          setData(result)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [type, id, query])

  return { data, isLoading, error }
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
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
    genre: [], // Se llenaría con los géneros si tuviéramos esa información
    rating: movie.adult ? "R" : "PG-13", // Simplificado
    synopsis: movie.overview,
    // Generamos horarios ficticios para las películas en cartelera
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

