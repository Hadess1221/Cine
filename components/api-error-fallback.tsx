import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ApiErrorFallbackProps {
  message?: string
  showHomeButton?: boolean
}

export function ApiErrorFallback({
  message = "No pudimos cargar los datos en este momento",
  showHomeButton = true,
}: ApiErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-primary"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">¡Ups! Algo salió mal</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{message}</p>

      {showHomeButton && (
        <Button asChild>
          <Link href="/">Volver al Inicio</Link>
        </Button>
      )}
    </div>
  )
}

