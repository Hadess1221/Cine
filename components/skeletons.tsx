import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function MovieSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[2/3] bg-muted animate-pulse" />
      <CardContent className="p-4">
        <div className="h-6 bg-muted animate-pulse rounded-md mb-2" />
        <div className="h-4 bg-muted animate-pulse rounded-md w-2/3 mb-2" />
        <div className="h-4 bg-muted animate-pulse rounded-md w-1/2" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="h-10 bg-muted animate-pulse rounded-md w-full" />
      </CardFooter>
    </Card>
  )
}

export function MovieDetailSkeleton() {
  return (
    <div className="container py-12">
      <div className="grid gap-6 md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr] md:gap-12">
        <div className="aspect-[2/3] bg-muted animate-pulse rounded-lg" />
        <div className="space-y-4">
          <div className="h-10 bg-muted animate-pulse rounded-md w-3/4" />
          <div className="h-6 bg-muted animate-pulse rounded-md w-1/2" />
          <div className="space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded-md" />
            <div className="h-4 bg-muted animate-pulse rounded-md" />
            <div className="h-4 bg-muted animate-pulse rounded-md w-3/4" />
          </div>
          <div className="h-6 bg-muted animate-pulse rounded-md w-1/3" />
          <div className="h-6 bg-muted animate-pulse rounded-md w-1/4" />
          <div className="flex gap-2">
            <div className="h-10 bg-muted animate-pulse rounded-md w-40" />
            <div className="h-10 bg-muted animate-pulse rounded-md w-40" />
          </div>
        </div>
      </div>
    </div>
  )
}

