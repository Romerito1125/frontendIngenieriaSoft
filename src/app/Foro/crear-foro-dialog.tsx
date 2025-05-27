"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { getCurrentUserId } from "./auth-service"
import { MessageSquare } from "lucide-react"

interface CrearForoDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onCreate: (titulo: string, descripcion: string) => void
}

export function CrearForoDialog({ open, setOpen, onCreate }: CrearForoDialogProps) {
  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !descripcion.trim()) {
      setError("Por favor, completa todos los campos.")
      return
    }

    const userId = getCurrentUserId()
    if (!userId) {
      setError("Debes iniciar sesión para crear un foro")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onCreate(titulo, descripcion)
      setOpen(false)
      setTitulo("")
      setDescripcion("")
    } catch (err: any) {
      setError(err.message || "Error al crear el foro.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px] bg-white border-2 border-gray-200 shadow-2xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            Crear nuevo foro
          </DialogTitle>
          <DialogDescription className="text-gray-600 leading-relaxed">
            Comparte tus ideas y preguntas con la comunidad. Sé claro y específico.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-base font-medium">
              Título
            </Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Escribe un título descriptivo"
              className="h-11 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-base font-medium">
              Descripción
            </Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Describe tu tema con detalle"
              className="min-h-[150px] focus:ring-2 focus:ring-blue-500"
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
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg w-full sm:w-auto"
              disabled={isSubmitting || !titulo.trim() || !descripcion.trim()}
            >
              {isSubmitting ? "Creando..." : "Publicar foro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
