//Zuluaga


"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Calendar, User, MessageSquare, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { isOwner, getCurrentUserId } from "./auth-service"
import EditarForoDialog from "./editar-foro-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { eliminarForo } from "./api-service"
import { useRouter } from "next/navigation"
import { useState } from "react"

type Foro = {
  idforo: string
  idcuenta: string | number
  titulo: string
  descripcion: string
  fecha: string
  cantidadRespuestas?: number
  nombreUsuario?: string
  cuentas?: {
    nombre?: string
  }
}

type Props = {
  foro: Foro
  onForoActualizado: (foroActualizado: Foro) => void
  onForoEliminado?: () => void
}

export default function ForoDetail({ foro, onForoActualizado, onForoEliminado }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Manejar fechas inválidas de manera segura
  let tiempoTranscurrido = "Fecha inválida"
  try {
    const fechaCreacion = new Date(foro.fecha)
    if (!isNaN(fechaCreacion.getTime())) {
      tiempoTranscurrido = formatDistanceToNow(fechaCreacion, {
        addSuffix: true,
        locale: es,
      })
    }
  } catch (e) {
    console.warn("⚠️ Fecha no válida en foro:", foro.fecha)
  }

  const esAutor = isOwner(String(foro.idcuenta))
  const cantidad = foro.cantidadRespuestas || 0

  // Obtener el nombre de usuario de manera más robusta
  const nombreUsuario =
    foro.nombreUsuario ||
    (foro.cuentas && typeof foro.cuentas === "object" ? foro.cuentas.nombre : null) ||
    `Usuario ${String(foro.idcuenta).substring(0, 5)}`

  const handleEliminarForo = async () => {
    if (!foro?.idforo) return

    try {
      setIsDeleting(true)
      setError(null)

      // Verificar que el usuario esté autenticado y sea el propietario
      const userId = getCurrentUserId()
      if (!userId) {
        setIsDeleting(false)
        return setError("Debes iniciar sesión para eliminar")
      }

      if (!isOwner(String(foro.idcuenta))) {
        setIsDeleting(false)
        return setError("No tienes permiso para eliminar este foro")
      }

      // Eliminar el foro
      await eliminarForo(foro.idforo)

      // Redirigir a la página principal
      if (onForoEliminado) {
        onForoEliminado()
      } else {
        router.push("/Foro")
      }
    } catch (err: any) {
      console.error("Error al eliminar foro:", err)
      setError(err.message || "No se pudo eliminar el foro. Intenta nuevamente.")
      setIsDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden border-t-4 border-t-blue-600">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Tema de discusión
              </Badge>
              {esAutor && <Badge className="bg-blue-100 text-blue-700">Tu foro</Badge>}
              <Badge
                className={`flex items-center gap-1 ${
                  cantidad > 0
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                {cantidad} {cantidad === 1 ? "respuesta" : "respuestas"}
              </Badge>
            </div>
            <CardTitle className="text-2xl text-blue-800">{foro.titulo}</CardTitle>
          </div>

          {esAutor && (
            <div className="flex gap-2">
              <EditarForoDialog foro={foro} onForoActualizado={onForoActualizado}>
                <Button variant="outline" size="sm" className="text-blue-700 border-blue-200">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </EditarForoDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md">
                  <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </div>
                      ¿Estás seguro?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 leading-relaxed">
                      Esta acción no se puede deshacer. Se eliminará este foro y todas sus respuestas permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-3 pt-4">
                    <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleEliminarForo}
                      className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
                    >
                      {isDeleting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Eliminando...
                        </div>
                      ) : (
                        "Eliminar foro"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{nombreUsuario}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{tiempoTranscurrido}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{foro.descripcion}</p>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
        )}
      </CardContent>
    </Card>
  )
}
