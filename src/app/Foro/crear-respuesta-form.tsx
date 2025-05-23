//Zuluaga


"use client"

import type React from "react"
import { useState } from "react"
import { getCurrentUserId, getCurrentUser } from "./auth-service"
import { crearRespuesta } from "./api-service"
import { Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface Props {
  idForo: string
  onRespuestaCreada: (respuesta: any) => void
}

const CrearRespuestaForm: React.FC<Props> = ({ idForo, onRespuestaCreada }) => {
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mensaje.trim()) {
      return setError("Por favor escribe un mensaje")
    }

    const userId = getCurrentUserId()
    if (!userId) {
      return setError("Debes iniciar sesión para responder")
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Obtener el usuario actual para tener acceso a su nombre
      const currentUser = getCurrentUser()

      // Crear la respuesta
      const respuestaResponse = await crearRespuesta(idForo, {
        mensaje,
        idcuenta: userId,
      })

      // Extraer la respuesta del response (puede venir en data[0] o directamente)
      const nuevaRespuesta = respuestaResponse.data?.[0] || respuestaResponse

      // Asegurar que la respuesta tenga todos los datos necesarios
      const respuestaCompleta = {
        ...nuevaRespuesta,
        fecha: nuevaRespuesta.fecha || new Date().toISOString(),
        nombreUsuario:
          nuevaRespuesta.nombreUsuario ||
          (currentUser ? currentUser.nombre || currentUser.email?.split("@")[0] : null) ||
          `Usuario ${String(userId).substring(0, 4)}`,
      }

      onRespuestaCreada(respuestaCompleta)
      setMensaje("")
    } catch (err) {
      console.error("Error al crear respuesta:", err)
      setError("No se pudo crear la respuesta. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder="Escribe tu respuesta..."
        className="min-h-[120px] focus:border-blue-500 focus:ring-blue-500"
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isSubmitting || !mensaje.trim()}>
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Enviando..." : "Enviar respuesta"}
        </Button>
      </div>
    </form>
  )
}

export default CrearRespuestaForm
