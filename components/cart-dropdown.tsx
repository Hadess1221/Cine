"use client"

import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export function CartDropdown() {
  const { items, removeItem, getTotal, getItemCount } = useCart()
  const itemCount = getItemCount()
  const total = getTotal()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
              {itemCount}
            </Badge>
          )}
          <span className="sr-only">Carrito</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] sm:w-[350px]" sideOffset={8}>
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Mi Carrito</span>
          {itemCount > 0 && (
            <Badge variant="outline">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[60vh] overflow-auto">
          {items.length > 0 ? (
            <div className="space-y-2 p-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-2 p-2 rounded-md hover:bg-muted">
                  <div className="w-12 h-18 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.posterUrl || "/placeholder.svg"}
                      alt={item.movieTitle}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-xs sm:text-sm truncate">{item.movieTitle}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()} - {item.time}
                    </p>
                    <p className="text-xs text-muted-foreground">Asientos: {item.seats.join(", ")}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs sm:text-sm font-medium">{formatCurrency(item.price)}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}>
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">Tu carrito está vacío</p>
              <Button asChild variant="outline" size="sm">
                <Link href="/cartelera">Ver Cartelera</Link>
              </Button>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-4 space-y-4">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/checkout">Finalizar Compra</Link>
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

