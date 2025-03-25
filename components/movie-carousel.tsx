"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MovieCarouselProps {
  movies: any[]
  autoplay?: boolean
  interval?: number
}

export default function MovieCarousel({ movies, autoplay = true, interval = 5000 }: MovieCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef<number>(0)

  const prev = () => setCurrent((current) => (current === 0 ? movies.length - 1 : current - 1))
  const next = () => setCurrent((current) => (current === movies.length - 1 ? 0 : current + 1))

  useEffect(() => {
    if (autoplay && !isHovering && !isTouching) {
      timerRef.current = setInterval(next, interval)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [autoplay, interval, isHovering, isTouching])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true)
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching) return

    const touchEndX = e.touches[0].clientX
    const diff = touchStartX.current - touchEndX

    // Swipe right to left (next)
    if (diff > 50) {
      next()
      setIsTouching(false)
    }
    // Swipe left to right (prev)
    else if (diff < -50) {
      prev()
      setIsTouching(false)
    }
  }

  const handleTouchEnd = () => {
    setIsTouching(false)
  }

  if (!movies.length) {
    return null
  }

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-full flex-shrink-0 relative">
            <div className="aspect-[16/9] md:aspect-[21/9] w-full">
              <Image
                src={movie.backdrop || "/placeholder.svg?height=1080&width=1920"}
                alt={movie.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 lg:p-12">
              <div className="flex flex-wrap gap-2 mb-3">
                {movie.genre?.slice(0, 2).map((genre: string, index: number) => (
                  <Badge key={index} variant="secondary" className="bg-black/50 backdrop-blur-sm text-xs">
                    {genre}
                  </Badge>
                ))}

                {movie.voteAverage > 0 && (
                  <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm flex items-center gap-1 text-xs">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span>{movie.voteAverage.toFixed(1)}</span>
                  </Badge>
                )}
              </div>

              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 text-white drop-shadow-md">
                {movie.title}
              </h2>

              <p className="text-xs md:text-sm lg:text-base text-white/90 mb-2 md:mb-4 max-w-md line-clamp-2 md:line-clamp-3 drop-shadow-md">
                {movie.synopsis}
              </p>

              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="gap-2 text-xs md:text-sm">
                  <Link href={`/pelicula/${movie.id}`}>{movie.comingSoon ? "Ver Detalles" : "Comprar Entradas"}</Link>
                </Button>

                {movie.trailer && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="gap-2 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-xs md:text-sm"
                  >
                    <Link href={`/pelicula/${movie.id}?trailer=true`}>
                      <Play className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                      Ver Trailer
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full h-8 w-8 md:h-10 md:w-10"
        onClick={prev}
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        <span className="sr-only">Anterior</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white rounded-full h-8 w-8 md:h-10 md:w-10"
        onClick={next}
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        <span className="sr-only">Siguiente</span>
      </Button>

      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {movies.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300",
              index === current ? "bg-primary w-4 md:w-6" : "bg-white/50 hover:bg-white/80",
            )}
            onClick={() => setCurrent(index)}
          >
            <span className="sr-only">Diapositiva {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

