"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Calendar, User, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { actualizarRespuesta, eliminarRespuesta } from "./api-service"
import { isOwner, getCurrentUserId } from "./auth-service"
import { motion } from "framer-motion"
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

type Props = {
  respuesta: {
    idrespuesta: string
    idcuenta: string | number
    mensaje: string
    fecha: string
    nombreUsuario?: string
    cuentas?: {
      nombre?: string
    }
  }
  onRespuestaActualizada: (r: any) => void
  onRespuestaEliminada: (id: string) => void
}

export default function RespuestaItem({ respuesta, onRespuestaActualizada, onRespuestaEliminada }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [mensaje, setMensaje] = useState(respuesta.mensaje)
  const [error, setError] = useState<string | null>(null)

  let tiempo = "Fecha inválida"
  try {
    const fecha = new Date(respuesta.fecha)
    if (!isNaN(fecha.getTime())) {
      tiempo = formatDistanceToNow(fecha, { addSuffix: true, locale: es })
    }
  } catch (e) {
    console.warn("⚠️ Fecha no válida en respuesta:", respuesta.fecha)
  }

  // Verificar si el usuario actual es el autor de la respuesta
  const esAutor = isOwner(String(respuesta.idcuenta))

  // Mejorar la obtención del nombre de usuario
  const nombreUsuario =
    respuesta.nombreUsuario ||
    (respuesta.cuentas && typeof respuesta.cuentas === "object" && respuesta.cuentas.nombre) ||
    `Usuario ${String(respuesta.idcuenta).substring(0, 4)}`

  const handleGuardar = async () => {
    if (!mensaje.trim()) {
      setError("El mensaje no puede estar vacío")
      return
    }

    try {
      setIsUpdating(true)
      setError(null)

      // Verificar que el usuario esté autenticado
      const userId = getCurrentUserId()
      if (!userId) {
        setError("Debes iniciar sesión para editar")
        return
      }

      // Enviar solo el mensaje para actualizar
      const respuestaActualizada = await actualizarRespuesta(respuesta.idrespuesta, { mensaje })

      // Actualizar la UI después de la actualización exitosa
      onRespuestaActualizada({
        ...respuesta,
        mensaje: mensaje,
      })

      setIsEditing(false)
      setError(null)
    } catch (err: any) {
      console.error("Error al actualizar respuesta:", err)
      setError(err.message || "Error al actualizar. Intenta nuevamente.")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEliminar = async () => {
    try {
      setIsDeleting(true)
      setError(null)

      // Verificar que el usuario esté autenticado
      const userId = getCurrentUserId()
      if (!userId) {
        setError("Debes iniciar sesión para eliminar")
        return
      }

      // Intentar eliminar la respuesta
      await eliminarRespuesta(respuesta.idrespuesta)

      // Si llegamos aquí, la eliminación fue exitosa
      onRespuestaEliminada(respuesta.idrespuesta)
    } catch (err: any) {
      console.error("Error al eliminar respuesta:", err)
      setError(err.message || "No se pudo eliminar. Intenta nuevamente.")
      setIsDeleting(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`overflow-hidden ${esAutor ? "border-l-4 border-l-blue-500" : ""}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">{nombreUsuario}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {tiempo}
                </div>
              </div>
            </div>

            {esAutor && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600"
                  onClick={() => setIsEditing(true)}
                  disabled={isUpdating || isDeleting}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600" disabled={isDeleting || isUpdating}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white border-2 border-gray-200 shadow-2xl max-w-md">
                    <AlertDialogHeader className="space-y-3">
                      <AlertDialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </div>
                        ¿Eliminar esta respuesta?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-600 leading-relaxed">
                        Esta acción no se puede deshacer. La respuesta será eliminada permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-3 pt-4">
                      <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleEliminar}
                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg"
                      >
                        {isDeleting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Eliminando...
                          </div>
                        ) : (
                          "Eliminar"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="min-h-[100px]"
                disabled={isUpdating}
              />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false)
                    setMensaje(respuesta.mensaje)
                    setError(null)
                  }}
                  disabled={isUpdating}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleGuardar}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isUpdating || !mensaje.trim()}
                >
                  <Check className="mr-2 h-4 w-4" />
                  {isUpdating ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{respuesta.mensaje}</p>
              {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
