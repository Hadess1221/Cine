"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export type CartItem = {
  id: string
  movieId: string
  movieTitle: string
  date: string
  time: string
  seats: string[]
  price: number
  posterUrl: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = "cinemax_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (storedCart) {
          setItems(JSON.parse(storedCart))
        }
      }
    } catch (e) {
      console.error("Error parsing stored cart:", e)
      if (typeof window !== "undefined") {
        localStorage.removeItem(CART_STORAGE_KEY)
      }
    } finally {
      setIsInitialized(true)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, isInitialized])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      // Verificar si ya existe un item con el mismo id
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)

      if (existingItemIndex >= 0) {
        // Si existe, reemplazarlo
        const newItems = [...prevItems]
        newItems[existingItemIndex] = item

        toast({
          title: "Carrito actualizado",
          description: `Se actualizaron las entradas para ${item.movieTitle}`,
        })

        return newItems
      } else {
        // Si no existe, agregarlo
        toast({
          title: "Entradas agregadas",
          description: `Se agregaron entradas para ${item.movieTitle}`,
        })

        return [...prevItems, item]
      }
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id)
      if (itemToRemove) {
        toast({
          title: "Entradas eliminadas",
          description: `Se eliminaron las entradas para ${itemToRemove.movieTitle}`,
        })
      }
      return prevItems.filter((item) => item.id !== id)
    })
  }

  const clearCart = () => {
    setItems([])
    toast({
      title: "Carrito vacío",
      description: "Se han eliminado todas las entradas del carrito",
    })
  }

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price, 0)
  }

  const getItemCount = () => {
    return items.length
  }

  // No renderizamos nada hasta que hayamos intentado cargar el carrito
  if (!isInitialized) {
    return null
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

