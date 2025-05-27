"use client"
import { useIsAdmin } from "../hooks/isAdmin"
import { useEffect, useState } from "react"
import AlertaCard from "../components/NoticiasAlertas/AlertaCard"
import NoticiaCard from "../components/NoticiasAlertas/NoticiaCard"
import Link from "next/link"
import { PlusCircle, AlertTriangle } from "lucide-react"

interface Alerta {
  idalerta: number
  tipo: string
  mensaje: string
  idruta: string
  idestacion: string
  prioridad: string
  hora: string
}

interface Noticia {
  idnoticia: number
  titulo: string
  descripcion: string
  link?: string
  autor: string
  fecha: string
}

export default function Page() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [alertas, setAlertas] = useState<Alerta[]>([])
  const [loadingNoticias, setLoadingNoticias] = useState(true)
  const [loadingAlertas, setLoadingAlertas] = useState(true)
  const isAdmin = useIsAdmin()

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch("https://servicionoticias.onrender.com/noticias/listarNoticias")
        const data: Noticia[] = await res.json()
        setNoticias(data)
      } catch (error) {
        console.error("Error al cargar noticias:", error)
      } finally {
        setLoadingNoticias(false)
      }
    }

    const fetchAlertas = async () => {
      try {
        const res = await fetch("https://www.alertas.devcorebits.com/alertas/listarAlertas")
        const data: Alerta[] = await res.json()
        setAlertas(data)
      } catch (error) {
        console.error("Error al cargar alertas:", error)
      } finally {
        setLoadingAlertas(false)
      }
    }

    fetchNoticias()
    fetchAlertas()
  }, [])

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10">
      <section>
        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Botón Crear Noticia */}
            <Link href="/crearNoticia">
              <div className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

                <div className="relative flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  <span className="text-lg">Crear Noticia</span>
                </div>

                {/* Partículas decorativas */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/40 rounded-full"></div>

                {/* Borde animado */}
                <div className="absolute inset-0 rounded-xl border-2 border-blue-300/0 group-hover:border-blue-300/50 transition-colors duration-300"></div>
              </div>
            </Link>

            {/* Botón Crear Alerta */}
            <Link href="/crearAlerta">
              <div className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

                <div className="relative flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 group-hover:animate-bounce transition-transform duration-300" />
                  <span className="text-lg">Crear Alerta</span>
                </div>

                {/* Efecto de pulso en el borde */}
                <div className="absolute inset-0 rounded-xl border-2 border-red-300/50 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Partículas decorativas */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full"></div>
                <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/40 rounded-full animate-ping delay-300"></div>
              </div>
            </Link>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-4">🚨 Alertas</h1>
        <div className="space-y-4">
          {loadingAlertas ? (
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : alertas.length === 0 ? (
            <p className="text-red-500">No hay alertas disponibles.</p>
          ) : (
            alertas.map((alerta) => <AlertaCard key={alerta.idalerta} {...alerta} />)
          )}
        </div>
      </section>

      <section>
        <h1 className="text-2xl font-bold mb-4">📰 Noticias</h1>
        <div className="space-y-4">
          {loadingNoticias ? (
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : noticias.length === 0 ? (
            <p className="text-red-500">No hay noticias disponibles.</p>
          ) : (
            noticias.map((noticia) => <NoticiaCard key={noticia.idnoticia} {...noticia} />)
          )}
        </div>
      </section>
    </main>
  )
}
