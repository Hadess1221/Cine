export type Movie = {
  id: string
  title: string
  poster: string
  backdrop: string
  releaseDate: string
  duration: string
  genre: string[]
  rating: string
  synopsis: string
  trailer: string
  cast: { name: string; role: string }[]
  director: string
  showTimes: { date: string; times: string[] }[]
  comingSoon?: boolean
}

export const movies: Movie[] = [
  {
    id: "1",
    title: "El Último Horizonte",
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    releaseDate: "2023-10-15",
    duration: "2h 15m",
    genre: ["Ciencia Ficción", "Aventura"],
    rating: "PG-13",
    synopsis:
      "En un futuro distante, un grupo de exploradores debe viajar más allá de los límites conocidos del espacio para encontrar un nuevo hogar para la humanidad.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      { name: "Ana García", role: "Dra. Elena Vega" },
      { name: "Carlos Martínez", role: "Capitán Marcos Torres" },
      { name: "Laura Rodríguez", role: "Ingeniera Sofia Ruiz" },
    ],
    director: "Alejandro Fernández",
    showTimes: [
      {
        date: "2023-10-20",
        times: ["14:30", "17:45", "20:15", "22:30"],
      },
      {
        date: "2023-10-21",
        times: ["14:30", "17:45", "20:15", "22:30"],
      },
    ],
  },
  {
    id: "2",
    title: "Secretos del Pasado",
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    releaseDate: "2023-09-28",
    duration: "1h 58m",
    genre: ["Drama", "Misterio"],
    rating: "R",
    synopsis:
      "Un detective retirado se ve obligado a enfrentar un caso sin resolver de su pasado cuando nuevas pistas salen a la luz después de 20 años.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      { name: "Roberto Sánchez", role: "Detective Miguel Herrera" },
      { name: "María López", role: "Isabel Moreno" },
      { name: "Javier Díaz", role: "Comisario Ramírez" },
    ],
    director: "Carmen Ortega",
    showTimes: [
      {
        date: "2023-10-20",
        times: ["15:00", "18:00", "21:00"],
      },
      {
        date: "2023-10-21",
        times: ["15:00", "18:00", "21:00"],
      },
    ],
  },
  {
    id: "3",
    title: "Corazones en Llamas",
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    releaseDate: "2023-10-05",
    duration: "2h 05m",
    genre: ["Romance", "Drama"],
    rating: "PG-13",
    synopsis:
      "Dos almas perdidas se encuentran en la ciudad de Barcelona y descubren que a veces el amor puede surgir de las cenizas del pasado.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      { name: "Lucía Fernández", role: "Clara Vidal" },
      { name: "Daniel Moreno", role: "Alejandro Soto" },
      { name: "Elena Castro", role: "Marta Vidal" },
    ],
    director: "Pablo Ruiz",
    showTimes: [
      {
        date: "2023-10-20",
        times: ["16:15", "19:00", "21:45"],
      },
      {
        date: "2023-10-21",
        times: ["16:15", "19:00", "21:45"],
      },
    ],
  },
  {
    id: "4",
    title: "La Sombra del Poder",
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    releaseDate: "2023-10-12",
    duration: "2h 22m",
    genre: ["Acción", "Thriller"],
    rating: "R",
    synopsis:
      "Un agente encubierto se infiltra en una organización criminal para desmantelar una red de corrupción que llega hasta las más altas esferas del gobierno.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      { name: "Miguel Ángel Torres", role: "Agente Raúl Mendoza" },
      { name: "Sofía Navarro", role: "Fiscal Claudia Herrera" },
      { name: "Antonio Vega", role: "Ministro Gutiérrez" },
    ],
    director: "Ricardo Montero",
    showTimes: [
      {
        date: "2023-10-20",
        times: ["14:00", "17:15", "20:30", "23:00"],
      },
      {
        date: "2023-10-21",
        times: ["14:00", "17:15", "20:30", "23:00"],
      },
    ],
  },
  {
    id: "5",
    title: "Mundos Paralelos",
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    releaseDate: "2023-11-10",
    duration: "2h 30m",
    genre: ["Ciencia Ficción", "Fantasía"],
    rating: "PG-13",
    synopsis:
      "Un científico descubre una manera de viajar entre dimensiones paralelas, pero pronto se da cuenta de que cada viaje tiene consecuencias inesperadas.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      { name: "David Jiménez", role: "Dr. Alberto Campos" },
      { name: "Patricia Reyes", role: "Dra. Lucía Mendoza" },
      { name: "Fernando Castro", role: "General Ramírez" },
    ],
    director: "Marta Gómez",
    showTimes: [],
    comingSoon: true,
  },
  {
    id: "6",
    title: "El Último Baile",
    poster: "/placeholder.svg?height=600&width=400",
    backdrop: "/placeholder.svg?height=1080&width=1920",
    releaseDate: "2023-12-01",
    duration: "1h 50m",
    genre: ["Drama", "Musical"],
    rating: "PG",
    synopsis:
      "Una bailarina profesional debe enfrentar su mayor desafío cuando una lesión amenaza con terminar su carrera justo antes de la presentación más importante de su vida.",
    trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    cast: [
      { name: "Isabel Torres", role: "Marina Vidal" },
      { name: "Carlos Ruiz", role: "Director Artístico" },
      { name: "Lucía Martín", role: "Sara Vidal" },
    ],
    director: "José Luis Moreno",
    showTimes: [],
    comingSoon: true,
  },
]

export type Promotion = {
  id: string
  title: string
  description: string
  image: string
  validUntil: string
  code?: string
  terms: string[]
}

export const promotions: Promotion[] = [
  {
    id: "1",
    title: "2x1 en Entradas los Martes",
    description:
      "Disfruta de dos entradas por el precio de una todos los martes. Válido para cualquier película y horario.",
    image: "/placeholder.svg?height=400&width=600",
    validUntil: "2023-12-31",
    code: "MARTES2X1",
    terms: [
      "Válido solo los martes",
      "No acumulable con otras promociones",
      "Sujeto a disponibilidad",
      "No válido para estrenos en su primera semana",
    ],
  },
  {
    id: "2",
    title: "Combo Familiar",
    description: "4 entradas + 2 palomitas grandes + 4 refrescos medianos a un precio especial.",
    image: "/placeholder.svg?height=400&width=600",
    validUntil: "2023-12-31",
    terms: ["Válido todos los días", "No acumulable con otras promociones", "Sujeto a disponibilidad"],
  },
  {
    id: "3",
    title: "Descuento Estudiantes",
    description: "30% de descuento presentando carnet estudiantil vigente.",
    image: "/placeholder.svg?height=400&width=600",
    validUntil: "2023-12-31",
    terms: [
      "Válido de lunes a jueves",
      "No acumulable con otras promociones",
      "Necesario presentar carnet estudiantil vigente",
    ],
  },
]

export type Event = {
  id: string
  title: string
  description: string
  image: string
  date: string
  time: string
}

export const events: Event[] = [
  {
    id: "1",
    title: "Maratón de Ciencia Ficción",
    description: "Disfruta de una noche completa con las mejores películas de ciencia ficción de todos los tiempos.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-11-15",
    time: "20:00",
  },
  {
    id: "2",
    title: "Premiere: El Último Horizonte",
    description:
      "Asiste a la premiere exclusiva de 'El Último Horizonte' con la presencia del director y actores principales.",
    image: "/placeholder.svg?height=400&width=600",
    date: "2023-10-14",
    time: "19:30",
  },
]

