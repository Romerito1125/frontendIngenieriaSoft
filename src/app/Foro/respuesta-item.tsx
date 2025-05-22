"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Calendar, User, Check, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { actualizarRespuesta, eliminarRespuesta } from "./api-service"
import { isOwner } from "./auth-service"
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
  }
  onRespuestaActualizada: (r: any) => void
  onRespuestaEliminada: (id: string) => void
}

export default function RespuestaItem({ respuesta, onRespuestaActualizada, onRespuestaEliminada }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mensaje, setMensaje] = useState(respuesta.mensaje)
  const [error, setError] = useState<string | null>(null)

  let tiempo = "Fecha inválida";
    try {
      const fecha = new Date(respuesta.fecha);
      if (!isNaN(fecha.getTime())) {
        tiempo = formatDistanceToNow(fecha, { addSuffix: true, locale: es });
      }
    } catch (e) {
      console.warn("⚠️ Fecha no válida en respuesta:", respuesta.fecha);
    }
  const esAutor = isOwner(String(respuesta.idcuenta))

  // Convertir idcuenta a string antes de usar substring
  const idCuentaStr = String(respuesta.idcuenta)
  const idCortado = idCuentaStr.substring(0, 5) // Mostrar solo los primeros 5 caracteres del ID

  const handleGuardar = async () => {
    if (!mensaje.trim()) return setError("El mensaje no puede estar vacío")

    try {
      const actualizada = await actualizarRespuesta(respuesta.idrespuesta, { mensaje })
      onRespuestaActualizada(actualizada)
      setIsEditing(false)
      setError(null)
    } catch (err) {
      setError("Error al actualizar. Intenta nuevamente.")
    }
  }

  const handleEliminar = async () => {
    try {
      setIsDeleting(true)
      await eliminarRespuesta(respuesta.idrespuesta)
      onRespuestaEliminada(respuesta.idrespuesta)
    } catch {
      setError("No se pudo eliminar. Intenta nuevamente.")
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
                <div className="font-medium">Usuario {idCortado}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {tiempo}
                </div>
              </div>
            </div>

            {esAutor && !isEditing && (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar esta respuesta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. La respuesta será eliminada permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleEliminar} className="bg-red-600 hover:bg-red-700">
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <Textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} className="min-h-[100px]" />
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
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleGuardar} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">{respuesta.mensaje}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
