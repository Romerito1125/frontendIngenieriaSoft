"use client"

import type React from "react"

import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, Loader2, User, MessageSquare, Building, Send, Check } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { crearDenuncia, validarFormulario } from "./utils"

interface CrearDenunciaProps {
  userId: number
}

export function CrearDenuncia({ userId }: CrearDenunciaProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [charCount, setCharCount] = useState(0)

  const [formData, setFormData] = useState({
    idcuenta: userId,
    mensaje: "",
    tipo: "servicio", // Valor por defecto
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "mensaje") {
      setCharCount(value.length)
    }
  }

  const handleCardClick = (tipo: string) => {
    setFormData((prev) => ({ ...prev, tipo }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación manual del mensaje vacío
    if (!formData.mensaje.trim()) {
      setError("Por favor, describe el problema o incidente")
      toast.error("Por favor, describe el problema o incidente")
      return
    }

    try {
      validarFormulario(formData.mensaje, userId)
      setIsSubmitting(true)
      setError(null)

      await crearDenuncia({
        ...formData,
        idcuenta: userId,
      })

      setSuccess(true)
      setFormData({
        idcuenta: userId,
        mensaje: "",
        tipo: "servicio",
      })
      setCharCount(0)

      toast.success("Tu denuncia ha sido registrada correctamente")

      // Resetear el estado de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err: unknown) {
      console.error("Error al crear denuncia:", err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error desconocido al enviar la denuncia")
      }

      toast.error("Error al enviar la denuncia")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
      data-testid="crear-denuncia-container"
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "white",
            color: "#333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            style: {
              border: "1px solid #10B981",
              borderLeft: "6px solid #10B981",
            },
          },
          error: {
            style: {
              border: "1px solid #EF4444",
              borderLeft: "6px solid #EF4444",
            },
          },
        }}
      />

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600">Reportar un problema</h2>
        <p className="text-gray-500 mt-2">
          Ayúdanos a mejorar nuestro servicio reportando cualquier incidente o problema que hayas experimentado.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          data-testid="error-alert"
        >
          <Alert variant="destructive" className="mb-6 border-l-4 border-l-red-600 shadow-md">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-semibold">Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          data-testid="success-alert"
        >
          <Alert className="mb-6 bg-green-50 border border-green-200 border-l-4 border-l-green-500 shadow-md">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <AlertTitle className="text-green-700 font-semibold">¡Denuncia enviada!</AlertTitle>
            <AlertDescription className="text-green-600">
              Tu denuncia ha sido registrada correctamente. Será revisada por nuestro equipo lo antes posible.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} data-testid="denuncia-form">
        <div className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
          {/* Encabezado con fondo azul completo */}
          <div className="bg-blue-50 p-6">
            <h3 className="text-xl font-semibold text-blue-600">Nueva denuncia</h3>
            <p className="text-gray-600 mt-1">
              Completa el formulario con los detalles del problema que deseas reportar
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="tipo-denuncia" className="text-blue-600 font-medium text-base">
                  Tipo de denuncia
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Tarjeta Servicio */}
                  <div
                    onClick={() => handleCardClick("servicio")}
                    className={`border transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer
                      ${
                        formData.tipo === "servicio"
                          ? "border-green-300 bg-green-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    data-testid="tipo-servicio"
                  >
                    <div className="p-4 flex flex-col items-center text-center h-full">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 mt-2 
                          ${formData.tipo === "servicio" ? "bg-green-100" : "bg-gray-100"}`}
                      >
                        <MessageSquare
                          className={`h-7 w-7 ${formData.tipo === "servicio" ? "text-green-500" : "text-gray-500"}`}
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 
                            ${
                              formData.tipo === "servicio"
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300 bg-white"
                            }`}
                        >
                          {formData.tipo === "servicio" && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="font-medium">Servicio</span>
                      </div>
                      <p className="text-xs text-gray-500">Problemas con horarios, rutas o servicio general</p>
                    </div>
                  </div>

                  {/* Tarjeta Conductor */}
                  <div
                    onClick={() => handleCardClick("conductor")}
                    className={`border transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer
                      ${
                        formData.tipo === "conductor"
                          ? "border-blue-300 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    data-testid="tipo-conductor"
                  >
                    <div className="p-4 flex flex-col items-center text-center h-full">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 mt-2 
                          ${formData.tipo === "conductor" ? "bg-blue-100" : "bg-gray-100"}`}
                      >
                        <User
                          className={`h-7 w-7 ${formData.tipo === "conductor" ? "text-blue-500" : "text-gray-500"}`}
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 
                            ${
                              formData.tipo === "conductor" ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"
                            }`}
                        >
                          {formData.tipo === "conductor" && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="font-medium">Conductor</span>
                      </div>
                      <p className="text-xs text-gray-500">Comportamiento inadecuado o problemas con conductores</p>
                    </div>
                  </div>

                  {/* Tarjeta Estación */}
                  <div
                    onClick={() => handleCardClick("estacion")}
                    className={`border transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer
                      ${
                        formData.tipo === "estacion"
                          ? "border-purple-300 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    data-testid="tipo-estacion"
                  >
                    <div className="p-4 flex flex-col items-center text-center h-full">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 mt-2 
                          ${formData.tipo === "estacion" ? "bg-purple-100" : "bg-gray-100"}`}
                      >
                        <Building
                          className={`h-7 w-7 ${formData.tipo === "estacion" ? "text-purple-500" : "text-gray-500"}`}
                        />
                      </div>
                      <div className="flex items-center mb-2">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 
                            ${
                              formData.tipo === "estacion"
                                ? "border-purple-500 bg-purple-500"
                                : "border-gray-300 bg-white"
                            }`}
                        >
                          {formData.tipo === "estacion" && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="font-medium">Estación</span>
                      </div>
                      <p className="text-xs text-gray-500">Problemas con instalaciones, limpieza o seguridad</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="mensaje" className="text-blue-600 font-medium text-base">
                    Descripción del problema
                  </Label>
                  <span
                    className={`text-xs ${charCount > 500 ? "text-red-500" : "text-gray-500"}`}
                    data-testid="char-counter"
                  >
                    {charCount}/500 caracteres
                  </span>
                </div>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Describe el problema o incidente con el mayor detalle posible..."
                  className="min-h-[180px] border-gray-200 focus-visible:border-blue-400 focus-visible:ring-blue-400 transition-all duration-300 resize-y rounded-xl"
                  maxLength={500}
                  data-testid="mensaje-textarea"
                />
                <p className="text-xs text-gray-500 italic">
                  Por favor, incluye detalles como fecha, hora, ubicación y cualquier otra información relevante.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || charCount > 500}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 transform hover:translate-y-[-2px] rounded-xl py-6"
                data-testid="submit-button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Enviar denuncia
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  )
}
