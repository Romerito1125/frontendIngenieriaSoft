"use client"

import { useIsAdmin } from "../hooks/isAdmin"
import { useEffect, useState } from "react"
import AlertaCard from "../components/NoticiasAlertas/AlertaCard"
import NoticiaCard from "../components/NoticiasAlertas/NoticiaCard"
import Link from "next/link"
import { PlusCircle, AlertTriangle } from "lucide-react"
import { fetchWithRetry } from "../utils/fetchWithRetry"

interface Alerta {
  idalerta: number
  tipo: string
  mensaje: string
  idruta: string
  prioridad: string
  hora: string
  icono: string
  hace: string
  color: string
  nombreEstacion: string
}

interface Noticia {
  idnoticia: number
  titulo: string
  descripcion: string
  link?: string
  autor: string
  fecha: string
  tipo: string
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
        const data: Noticia[] = await fetchWithRetry("https://www.api.devcorebits.com/noticiasGateway/noticias/listarNoticias")
        setNoticias(data)
      } catch (error) {
        console.error("Error al cargar noticias:", error)
      } finally {
        setLoadingNoticias(false)
      }
    }

    const fetchAlertas = async () => {
      try {
        const dataRaw = await fetchWithRetry("https://www.api.devcorebits.com/alertasGateway/alertas/listarAlertas")

        const alertasConEstacion: Alerta[] = await Promise.all(
          (dataRaw || []).map(async (a: any) => {
            let nombreEstacion = "Sin estación"
            try {
              if (a.idestacion) {
                const estRes = await fetchWithRetry(`https://www.api.devcorebits.com/estacionesGateway/estaciones/${a.idestacion}`)
                nombreEstacion = estRes?.nombre || nombreEstacion
              }
            } catch (e) {
              console.warn(`No se pudo obtener estación ${a.idestacion}`)
            }

            return {
              ...a,
              nombreEstacion
            }
          })
        )

        setAlertas(alertasConEstacion)
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
            <Link href="/crearNoticia">
              <div className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                <div className="relative flex items-center gap-3">
                  <PlusCircle className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                  <span className="text-lg">Crear Noticia</span>
                </div>
              </div>
            </Link>

            <Link href="/crearAlerta">
              <div className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer">
                <div className="relative flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 group-hover:animate-bounce transition-transform duration-300" />
                  <span className="text-lg">Crear Alerta</span>
                </div>
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
