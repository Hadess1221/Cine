import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8 md:py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">CineMax</h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Tu cine de confianza con las mejores películas y experiencias cinematográficas.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-4 w-4 md:h-5 md:w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/cartelera" className="text-muted-foreground hover:text-primary">
                  Cartelera
                </Link>
              </li>
              <li>
                <Link href="/proximos-estrenos" className="text-muted-foreground hover:text-primary">
                  Próximos Estrenos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">Información</h3>
            <ul className="space-y-2 text-xs md:text-sm">
              <li>
                <Link href="/contacto" className="text-muted-foreground hover:text-primary">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-primary">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-primary">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 md:mb-4 text-base md:text-lg font-semibold">Contacto</h3>
            <address className="not-italic text-xs md:text-sm text-muted-foreground">
              <p>Av. Principal 123</p>
              <p>Ciudad, CP 12345</p>
              <p className="mt-2">Teléfono: (123) 456-7890</p>
              <p>Email: info@cinemax.com</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs md:text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CineMax. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

