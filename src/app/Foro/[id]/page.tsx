"use client"
import { supabase } from "../api-service"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { obtenerForo, listarRespuestasArbol } from "../api-service"
import { isAuthenticated, isOwner, getCurrentUser } from "../auth-service"
import ForoDetail from "../foro-detail"
import RespuestasList from "../respuestas-list"
import CrearRespuestaForm from "../crear-respuesta-form"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

function contarRespuestasEnArbol(nodos: any[]): number {
  let total = 0
  for (const nodo of nodos) {
    total += 1
    if (nodo.hijos && nodo.hijos.length > 0) {
      total += contarRespuestasEnArbol(nodo.hijos)
    }
  }
  return total
}

export default function ForoDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [foro, setForo] = useState<any>(null)
  const [respuestasArbol, setRespuestasArbol] = useState<any[]>([])
  const [cantidadRespuestas, setCantidadRespuestas] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    setIsAuth(isAuthenticated())
    setCurrentUser(getCurrentUser())

    const fetchData = async () => {
      if (!id) return

      try {
        const foroData = await obtenerForo(id)
        const arbolData = await listarRespuestasArbol(id)

        const totalRespuestas = contarRespuestasEnArbol(arbolData)

        const foroConRespuestas = {
          ...foroData,
          cantidadRespuestas: totalRespuestas,
        }

        console.log("[FORO] Foro cargado:", foroConRespuestas)
        console.log("[RESPUESTAS] Árbol cargado:", arbolData)

        setForo(foroConRespuestas)
        setRespuestasArbol(arbolData)
        setCantidadRespuestas(totalRespuestas)
      } catch (err) {
        console.error("[ERROR] No se pudo cargar el foro:", err)
        setError("No se pudo cargar el foro. Intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  // Aquí va el nuevo useEffect con postgres_changes:
  useEffect(() => {
    const canalRespuestas = supabase
      .channel("public:respuestas_foro")
      .on("postgres_changes", {
        event: "*", // INSERT, UPDATE, DELETE
        schema: "public",
        table: "respuestas_foro",
      }, async (payload) => {
        console.log("[REALTIME] Cambio en respuestas:", payload)

        try {
          const arbolActualizado = await listarRespuestasArbol(id)
          const totalRespuestas = contarRespuestasEnArbol(arbolActualizado)

          console.log("[RELOAD] Árbol actualizado por cambio en respuestas:", arbolActualizado)

          setRespuestasArbol(arbolActualizado)
          setCantidadRespuestas(totalRespuestas)

          if (foro) {
            setForo({
              ...foro,
              cantidadRespuestas: totalRespuestas,
            })
          }
        } catch (error) {
          console.error("[ERROR] Al recargar árbol (postgres_changes):", error)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canalRespuestas)
    }
  }, [id, foro])

  const handleRespuestaCreada = async () => {
    try {
      const arbolActualizado = await listarRespuestasArbol(id)
      const totalRespuestas = contarRespuestasEnArbol(arbolActualizado)

      console.log("[FORM] Árbol actualizado después de crear respuesta:", arbolActualizado)

      setRespuestasArbol(arbolActualizado)
      setCantidadRespuestas(totalRespuestas)

      if (foro) {
        setForo({ ...foro, cantidadRespuestas: totalRespuestas })
      }
    } catch (error) {
      console.error("[ERROR] Al crear respuesta:", error)
    }
  }

  const handleRespuestaActualizada = async () => {
    try {
      const arbolActualizado = await listarRespuestasArbol(id)
      console.log("[FORM] Árbol actualizado después de editar respuesta:", arbolActualizado)
      setRespuestasArbol(arbolActualizado)
    } catch (error) {
      console.error("[ERROR] Al actualizar respuesta:", error)
    }
  }

  const handleRespuestaEliminada = async () => {
    try {
      const arbolActualizado = await listarRespuestasArbol(id)
      const totalRespuestas = contarRespuestasEnArbol(arbolActualizado)

      console.log("[FORM] Árbol actualizado después de eliminar respuesta:", arbolActualizado)

      setRespuestasArbol(arbolActualizado)
      setCantidadRespuestas(totalRespuestas)

      if (foro) {
        setForo({ ...foro, cantidadRespuestas: totalRespuestas })
      }
    } catch (error) {
      console.error("[ERROR] Al eliminar respuesta:", error)
    }
  }

  const handleReplicaCreada = handleRespuestaCreada

  const handleForoActualizado = (foroActualizado: any) => {
    setForo({
      ...foroActualizado,
      cantidadRespuestas: foro.cantidadRespuestas,
    })
  }

  const handleForoEliminado = () => {
    router.push("/Foro")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-700" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
        <div className="mt-4">
          <Link href="/Foro">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista de foros
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!foro) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
          El foro no existe o ha sido eliminado.
        </div>
        <div className="mt-4">
          <Link href="/Foro">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a la lista de foros
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const esAutor = isAuth && isOwner(foro.idcuenta)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/Foro" className="inline-flex items-center text-blue-700 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la lista de foros
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <ForoDetail foro={foro} onForoActualizado={handleForoActualizado} onForoEliminado={handleForoEliminado} />
      </motion.div>

      <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
            {cantidadRespuestas}
          </span>
          {cantidadRespuestas === 1 ? "Respuesta" : "Respuestas"}
        </h2>

        <RespuestasList
          respuestas={respuestasArbol}
          onRespuestaActualizada={handleRespuestaActualizada}
          onRespuestaEliminada={handleRespuestaEliminada}
          onReplicaCreada={handleReplicaCreada}
          idForo={id}
        />

        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Añadir tu respuesta</h3>
          {isAuth ? (
            <CrearRespuestaForm idForo={foro.idforo} onRespuestaCreada={handleRespuestaCreada} />
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">Debes iniciar sesión para responder a este foro</p>
              <Link href="/auth/login">
                <Button className="bg-blue-700 hover:bg-blue-800">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
