//Zuluaga


"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { actualizarForo } from "./api-service"
import { isOwner, getCurrentUserId } from "./auth-service"
import { Edit } from "lucide-react"

type Props = {
  children: React.ReactNode
  foro: {
    idforo: string
    idcuenta: string | number
    titulo: string
    descripcion: string
    fecha: string
    nombreUsuario?: string
    cuentas?: {
      nombre?: string
    }
    cantidadRespuestas?: number
  }
  onForoActualizado: (foro: any) => void
}

export default function EditarForoDialog({ children, foro, onForoActualizado }: Props) {
  const [open, setOpen] = useState(false)
  const [titulo, setTitulo] = useState(foro.titulo)
  const [descripcion, setDescripcion] = useState(foro.descripcion)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setTitulo(foro.titulo)
      setDescripcion(foro.descripcion)
      setError(null)
    }
  }, [open, foro])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !descripcion.trim()) {
      return setError("Por favor completa todos los campos")
    }

    // Verificar que el usuario esté autenticado y sea el propietario
    const userId = getCurrentUserId()
    if (!userId) {
      return setError("Debes iniciar sesión para editar")
    }

    if (!isOwner(String(foro.idcuenta))) {
      return setError("No tienes permiso para editar este foro")
    }

    try {
      setIsSubmitting(true)
      setError(null)

      // Enviar solo los campos que se van a actualizar
      await actualizarForo(foro.idforo, {
        titulo,
        descripcion,
      })

      // Crear un objeto completo con todos los datos originales y los actualizados
      const foroActualizado = {
        ...foro,
        titulo,
        descripcion,
        // Mantener estos campos del foro original
        fecha: foro.fecha,
        nombreUsuario: foro.nombreUsuario,
        cuentas: foro.cuentas,
        cantidadRespuestas: foro.cantidadRespuestas,
      }

      // Actualizar el estado en el componente padre
      onForoActualizado(foroActualizado)
      setOpen(false)
    } catch (error: any) {
      console.error("Error al actualizar foro:", error)
      setError(error.message || "No se pudo actualizar el foro. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) setError(null)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Edit className="w-4 h-4 text-blue-600" />
            </div>
            Editar foro
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            Actualiza el título y la descripción de tu foro.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Nuevo título del foro"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción detallada"
              className="min-h-[150px]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
