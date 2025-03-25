/**
 * Obtiene la URL base para las solicitudes a la API
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // En el cliente, usamos la URL actual
    return window.location.origin
  }

  // En el servidor, usamos la variable de entorno o un valor predeterminado
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

/**
 * Construye una URL completa para la API
 */
export function getApiUrl(path: string) {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path}`
}

