import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MovieCardProps {
  movie: any
  featured?: boolean
  className?: string
}

export default function MovieCard({ movie, featured = false, className }: MovieCardProps) {
  const isComingSoon = movie.comingSoon || movie.showTimes?.length === 0

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all duration-300 hover:shadow-lg h-full",
        featured ? "md:flex" : "",
        className,
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "md:w-1/3 w-full" : "w-full")}>
        <div className="aspect-[2/3] relative overflow-hidden">
          <Image
            src={movie.poster || "/placeholder.svg?height=600&width=400"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 25vw"}
            priority={featured}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {movie.voteAverage > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full p-1.5 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-medium">{movie.voteAverage.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-3rem)]">
          {movie.genre?.slice(0, 2).map((genre: string, index: number) => (
            <Badge key={index} variant="secondary" className="bg-black/70 backdrop-blur-sm text-xs">
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      <div className={cn("flex flex-col", featured ? "md:w-2/3 w-full" : "")}>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>

          <div className="flex items-center text-xs md:text-sm text-muted-foreground mb-2">
            <Clock className="mr-1 h-4 w-4" />
            <span>{movie.duration || "N/A"}</span>
            <span className="mx-2">•</span>
            <span>{movie.rating}</span>
          </div>

          {featured && <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{movie.synopsis}</p>}

          <div className="flex items-center text-xs md:text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>
              {isComingSoon
                ? `Estreno: ${new Date(movie.releaseDate).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}`
                : `En cartelera`}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2 flex-wrap">
          <Button asChild className="flex-1 group-hover:bg-primary/90 text-sm md:text-base">
            <Link href={`/pelicula/${movie.id}`}>{isComingSoon ? "Ver Detalles" : "Comprar Entradas"}</Link>
          </Button>

          {featured && !isComingSoon && movie.trailer && (
            <Button variant="outline" asChild className="group-hover:bg-secondary/80 text-sm md:text-base">
              <Link href={`/pelicula/${movie.id}?trailer=true`}>Ver Trailer</Link>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}

