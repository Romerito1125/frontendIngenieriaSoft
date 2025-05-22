"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { crearRespuesta } from "./api-service"
import { getCurrentUserId } from "./auth-service"
import { Send } from "lucide-react"

type Props = {
  idForo: string
  onRespuestaCreada: (respuesta: any) => void
}

export default function CrearRespuestaForm({ idForo, onRespuestaCreada }: Props) {
  const [mensaje, setMensaje] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      const nueva = await crearRespuesta(idForo, { mensaje, idcuenta: userId })
      onRespuestaCreada(nueva)
      setMensaje("")
    } catch (err) {
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
