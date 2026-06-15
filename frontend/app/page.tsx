import Link from 'next/link';
import { ArrowRight, BarChart3, Globe, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <Zap className="h-6 w-6 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">PricePulse</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Comenzar Gratis
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-primary-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Inteligencia Competitiva en Tiempo Real
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Monitorea precios, stock y promociones de tus competidores automáticamente. Toma decisiones basadas en datos.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <button className="inline-flex items-center justify-center rounded-md bg-primary-600 px-8 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-950">
                    Empezar Ahora <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary-100 rounded-full">
                  <Globe className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold">Scraping Automático</h3>
                <p className="text-gray-500">Recopilamos datos de cualquier tienda online sin que tengas que mover un dedo.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary-100 rounded-full">
                  <Zap className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold">Alertas Instantáneas</h3>
                <p className="text-gray-500">Recibe notificaciones cuando un competidor cambie un precio o se quede sin stock.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary-100 rounded-full">
                  <BarChart3 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold">Análisis Histórico</h3>
                <p className="text-gray-500">Visualiza la evolución de precios y tendencias del mercado a lo largo del tiempo.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2026 PricePulse. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
