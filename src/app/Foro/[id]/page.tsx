"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { obtenerForo, listarRespuestas, eliminarForo, obtenerCantidadRespuestas } from "../api-service"
import { isAuthenticated, isOwner, getCurrentUser } from "../auth-service"
import ForoDetail from "../foro-detail"
import RespuestasList from "../respuestas-list"
import CrearRespuestaForm from "../crear-respuesta-form"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2, ArrowLeft, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function ForoDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const [foro, setForo] = useState<any>(null)
  const [respuestas, setRespuestas] = useState<any[]>([])
  const [cantidadRespuestas, setCantidadRespuestas] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
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
        setForo(foroData)
        setCantidadRespuestas(foroData.cantidadRespuestas || 0)

        const respuestasData = await listarRespuestas(id)
        setRespuestas(respuestasData)
      } catch (err) {
        console.error(err)
        setError("No se pudo cargar el foro. Intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const actualizarCantidadRespuestas = async () => {
    if (!id) return

    try {
      const cantidad = await obtenerCantidadRespuestas(id)
      setCantidadRespuestas(cantidad)
      if (foro) {
        setForo({ ...foro, cantidadRespuestas: cantidad })
      }
    } catch (err) {
      console.error("Error actualizando cantidad de respuestas", err)
    }
  }

  const handleRespuestaCreada = (nuevaRespuesta: any) => {
    setRespuestas([...respuestas, nuevaRespuesta])
    actualizarCantidadRespuestas()
  }

  const handleRespuestaActualizada = (respuestaActualizada: any) => {
    setRespuestas(
      respuestas.map((r) => (r.idrespuesta === respuestaActualizada.idrespuesta ? respuestaActualizada : r)),
    )
  }

  const handleRespuestaEliminada = (id: string) => {
    setRespuestas(respuestas.filter((r) => r.idrespuesta !== id))
    actualizarCantidadRespuestas()
  }

  const handleForoActualizado = (foroActualizado: any) => {
    setForo({ ...foroActualizado, cantidadRespuestas })
  }

  const handleEliminarForo = async () => {
    if (!foro?.idforo) return

    try {
      setIsDeleting(true)
      await eliminarForo(foro.idforo)
      router.push("/foro")
    } catch (err) {
      console.error("Error al eliminar foro:", err)
      setError("No se pudo eliminar el foro. Intenta nuevamente.")
      setIsDeleting(false)
    }
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
        <ForoDetail foro={foro} onForoActualizado={handleForoActualizado} />

        {esAutor && (
          <div className="mt-4 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? "Eliminando..." : "Eliminar foro"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará este foro y todas sus respuestas.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleEliminarForo} className="bg-red-600 hover:bg-red-700">
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </motion.div>

      <motion.div className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
          <span className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
            {cantidadRespuestas}
          </span>
          {cantidadRespuestas === 1 ? "Respuesta" : "Respuestas"}
        </h2>

        <RespuestasList
          respuestas={respuestas}
          onRespuestaActualizada={handleRespuestaActualizada}
          onRespuestaEliminada={handleRespuestaEliminada}
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
