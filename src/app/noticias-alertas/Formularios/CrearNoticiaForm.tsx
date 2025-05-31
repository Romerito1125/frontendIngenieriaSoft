"use client"

import type React from "react"
import { useState } from "react"
import { PlusCircle, Send, Loader2, CheckCircle2 } from "lucide-react"
import { toast, Toaster } from "react-hot-toast"
import { crearNoticia, validarDatosNoticia, type FormDataNoticia } from "../utils"

export default function CrearNoticiaForm() {
  const [formData, setFormData] = useState<FormDataNoticia>({
    titulo: "",
    descripcion: "",
    link: "",
    autor: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validar datos antes de enviar
      validarDatosNoticia(formData)

      await crearNoticia(formData)

      toast.custom(
        <div className="bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded-xl shadow-md flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-700" />
          <span className="font-medium">¡Noticia creada correctamente!</span>
        </div>,
        {
          position: "top-center",
          duration: 4000,
        },
      )

      setFormData({
        titulo: "",
        descripcion: "",
        link: "",
        autor: "",
      })
    } catch (error) {
      console.error("Error al crear la noticia:", error)
      if (error instanceof Error) {
        toast.error(error.message, { position: "top-center" })
      } else {
        toast.error("Error al crear la noticia. Intenta de nuevo.", { position: "top-center" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen relative">
      {/* Toaster */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#DBEAFE",
            color: "#1E40AF",
            border: "1px solid #93C5FD",
            padding: "12px 16px",
            borderRadius: "12px",
            fontWeight: "500",
          },
        }}
      />

      <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.01] transition-transform duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg">
            <PlusCircle className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Crear Noticia</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
              placeholder="Título de la noticia..."
            />
          </div>

          {/* Descripción */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white resize-none"
              placeholder="Describe la noticia en detalle..."
            />
          </div>

          {/* Link y Autor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Link <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
                placeholder="https://ejemplo.com"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Autor</label>
              <input
                type="text"
                name="autor"
                value={formData.autor}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white"
                placeholder="Nombre del autor"
              />
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>

            <div className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              )}
              <span className="text-lg">{isSubmitting ? "Creando Noticia..." : "Crear Noticia"}</span>
            </div>
          </button>
        </form>
      </div>
    </div>
  )
}
