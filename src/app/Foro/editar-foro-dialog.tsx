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
import { isOwner } from "./auth-service"

type Props = {
  children: React.ReactNode
  foro: {
    idforo: string
    idcuenta: string | number
    titulo: string
    descripcion: string
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
    }
  }, [open, foro])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!titulo.trim() || !descripcion.trim()) {
      return setError("Por favor completa todos los campos")
    }

    if (!isOwner(String(foro.idcuenta))) {
      return setError("No tienes permiso para editar este foro")
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const actualizado = await actualizarForo(foro.idforo, { titulo, descripcion })
      onForoActualizado(actualizado)
      setOpen(false)
    } catch {
      setError("No se pudo actualizar el foro. Intenta nuevamente.")
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
      <DialogContent className="sm:max-w-[550px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-700">Editar foro</DialogTitle>
          <DialogDescription>Actualiza el título y la descripción de tu foro.</DialogDescription>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-700 hover:bg-blue-800" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
