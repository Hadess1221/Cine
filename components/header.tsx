"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import SearchMovies from "@/components/search-movies"
import { LoginModal } from "@/components/login-modal"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CartDropdown } from "@/components/cart-dropdown"

// Modificar el array de rutas para eliminar Promociones y Sobre Nosotros
const routes = [
  { href: "/", label: "Inicio" },
  { href: "/cartelera", label: "Cartelera" },
  { href: "/proximos-estrenos", label: "Próximos Estrenos" },
  { href: "/contacto", label: "Contacto" },
]

export default function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6 lg:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              CineMax
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="relative hidden md:block w-[250px] lg:w-[300px]">
              <SearchMovies />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setShowSearch(false)}
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setShowSearch(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          )}

          <ThemeToggle />

          {user ? (
            <>
              <UserMenu />
              <CartDropdown />
              <Button variant="default" className="hidden md:flex" asChild>
                <Link href="/cartelera">Comprar Entradas</Link>
              </Button>
            </>
          ) : (
            <>
              <LoginModal
                trigger={
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Cuenta</span>
                  </Button>
                }
              />
              <CartDropdown />
              <Button variant="default" className="hidden md:flex" asChild>
                <Link href="/cartelera">Comprar Entradas</Link>
              </Button>
              <LoginModal
                trigger={
                  <Button variant="outline" className="hidden md:flex">
                    Iniciar Sesión
                  </Button>
                }
              />
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
              <div className="grid gap-6 py-6">
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => document.body.classList.remove("overflow-hidden")}
                >
                  <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
                    CineMax
                  </span>
                </Link>
                <div className="relative">
                  <SearchMovies />
                </div>
                <nav className="grid gap-3">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                        pathname === route.href ? "text-primary bg-muted" : "text-muted-foreground",
                      )}
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-2 mt-2">
                  <Button variant="default" className="w-full" asChild>
                    <Link href="/cartelera">Comprar Entradas</Link>
                  </Button>
                  {user ? (
                    <div className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          logout()
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <LoginModal
                      trigger={
                        <Button variant="outline" className="w-full">
                          Iniciar Sesión
                        </Button>
                      }
                    />
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

