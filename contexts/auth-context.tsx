"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  name: string
  email: string
  avatar?: string
  favorites?: string[]
  tickets?: {
    id: string
    movieId: string
    movieTitle: string
    date: string
    time: string
    seats: string[]
    cinema?: string
    hall?: string
    status?: "confirmed" | "pending" | "cancelled"
  }[]
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  addToFavorites: (movieId: string) => void
  removeFromFavorites: (movieId: string) => void
  isMovieFavorite: (movieId: string) => boolean
  updateUserProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simulación de base de datos de usuarios
const USERS_STORAGE_KEY = "cinemax_users"
const CURRENT_USER_KEY = "cinemax_current_user"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    try {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem(CURRENT_USER_KEY) : null
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error("Error parsing stored user:", e)
      if (typeof window !== "undefined") {
        localStorage.removeItem(CURRENT_USER_KEY)
      }
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Función para obtener usuarios almacenados
  const getStoredUsers = (): Record<string, User> => {
    if (typeof window === "undefined") return {}
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    return storedUsers ? JSON.parse(storedUsers) : {}
  }

  // Función para guardar usuarios
  const saveUsers = (users: Record<string, User>) => {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }

  // Función para guardar el usuario actual
  const saveCurrentUser = (user: User) => {
    if (typeof window === "undefined") return
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    setUser(user)
  }

  // Registro de usuario
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulamos una llamada a API con un retraso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validación básica
      if (!name || !email || !password) {
        throw new Error("Todos los campos son obligatorios")
      }

      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      // Verificar si el email ya está registrado
      const users = getStoredUsers()
      if (users[email]) {
        throw new Error("Este email ya está registrado")
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        favorites: [],
        tickets: [],
      }

      // Guardar en "base de datos"
      users[email] = newUser
      saveUsers(users)

      // Iniciar sesión automáticamente
      saveCurrentUser(newUser)
      return Promise.resolve()
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Error al registrar usuario")
      }
      return Promise.reject(e)
    } finally {
      setIsLoading(false)
    }
  }

  // Inicio de sesión
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulamos una llamada a API con un retraso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validación básica
      if (!email || !password) {
        throw new Error("Por favor, introduce email y contraseña")
      }

      // En un caso real, verificaríamos las credenciales contra la base de datos
      const users = getStoredUsers()
      const user = users[email]

      if (!user) {
        // Para simplificar, si el usuario no existe, lo creamos automáticamente
        const newUser: User = {
          id: Date.now().toString(),
          name: email.split("@")[0],
          email,
          favorites: [],
          tickets: [],
        }

        users[email] = newUser
        saveUsers(users)
        saveCurrentUser(newUser)
        return Promise.resolve()
      }

      // Usuario existe, iniciar sesión
      saveCurrentUser(user)
      return Promise.resolve()
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Error al iniciar sesión")
      }
      return Promise.reject(e)
    } finally {
      setIsLoading(false)
    }
  }

  // Cerrar sesión
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
    setUser(null)
  }

  // Añadir película a favoritos
  const addToFavorites = (movieId: string) => {
    if (!user) return

    const updatedUser = {
      ...user,
      favorites: [...(user.favorites || []), movieId],
    }

    // Actualizar en "base de datos"
    const users = getStoredUsers()
    users[user.email] = updatedUser
    saveUsers(users)

    // Actualizar usuario actual
    saveCurrentUser(updatedUser)
  }

  // Eliminar película de favoritos
  const removeFromFavorites = (movieId: string) => {
    if (!user || !user.favorites) return

    const updatedUser = {
      ...user,
      favorites: user.favorites.filter((id) => id !== movieId),
    }

    // Actualizar en "base de datos"
    const users = getStoredUsers()
    users[user.email] = updatedUser
    saveUsers(users)

    // Actualizar usuario actual
    saveCurrentUser(updatedUser)
  }

  // Verificar si una película está en favoritos
  const isMovieFavorite = (movieId: string): boolean => {
    return user?.favorites?.includes(movieId) || false
  }

  // Actualizar perfil de usuario
  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      ...data,
    }

    // Actualizar en "base de datos"
    const users = getStoredUsers()
    users[user.email] = updatedUser
    saveUsers(users)

    // Actualizar usuario actual
    saveCurrentUser(updatedUser)
  }

  // No renderizamos nada hasta que hayamos intentado cargar el usuario
  if (!isInitialized) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        addToFavorites,
        removeFromFavorites,
        isMovieFavorite,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

