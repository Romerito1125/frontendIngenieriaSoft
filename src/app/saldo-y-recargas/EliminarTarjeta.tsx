"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Shield, AlertTriangle, Mail, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  tarjetaId: string
  numeroTarjeta: string
  userEmail: string
}

const EliminarTarjeta: React.FC<Props> = ({ isOpen, onClose, onSuccess, tarjetaId, numeroTarjeta, userEmail }) => {
  const [step, setStep] = useState(1)
  const [correo, setCorreo] = useState("")
  const [otp, setOtp] = useState("")
  const [confirmacion, setConfirmacion] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && userEmail) {
      setCorreo(userEmail)
    }
  }, [isOpen, userEmail])

  const resetForm = () => {
    setStep(1)
    setOtp("")
    setConfirmacion(false)
    setCorreo(userEmail || "")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleEnviarOtp = async () => {
    if (!correo.trim()) {
      toast.error("Ingresa tu correo electrónico")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "eliminacion_tarjeta" }),
      })
      if (!res.ok) throw new Error()
      toast.success("🔐 Código de verificación enviado")
      setStep(2)
    } catch {
      toast.error("❌ No se pudo enviar el código de verificación")
    } finally {
      setLoading(false)
    }
  }

  const handleVerificarYEliminar = async () => {
    setLoading(true)
    try {
      // Verificar OTP
      const resOtp = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, otp }),
      })

      if (!resOtp.ok) {
        const errorText = await resOtp.text()
        console.error("Error OTP response:", errorText)
        toast.error("❌ Código inválido o expirado")
        return
      }

      const otpResult = await resOtp.json()
      console.log("OTP verification successful:", otpResult)

      // Eliminar tarjeta usando el endpoint correcto
      const resTarjeta = await fetch(`https://www.api.devcorebits.com/tarjetasGateway/tarjetas/eliminar/${tarjetaId}`, {
        method: "DELETE",
      })

      console.log("Delete response status:", resTarjeta.status)

      if (!resTarjeta.ok) {
        const errorText = await resTarjeta.text()
        console.error("Error delete response:", errorText)

        try {
          const errorData = JSON.parse(errorText)
          const errorMessage = errorData.error?.message || errorData.message || "Error al eliminar tarjeta"

          if (errorMessage.includes("no encontrada")) {
            toast.error("❌ La tarjeta no fue encontrada")
          } else if (errorMessage.includes("no se puede eliminar")) {
            toast.error("⚠️ No se puede eliminar esta tarjeta")
          } else {
            toast.error(`❌ ${errorMessage}`)
          }
        } catch (parseError) {
          toast.error("❌ Error del servidor al eliminar tarjeta")
        }
        return
      }

      const result = await resTarjeta.json()
      console.log("Card deleted successfully:", result)

      toast.success("🗑️ Tarjeta eliminada exitosamente")
      setStep(3)
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2000)
    } catch (error: unknown) {
      console.error("Delete error:", error)
      if (error instanceof Error && error.message.includes("fetch")) {
        toast.error("🌐 Error de conexión. Verifica tu internet")
      } else {
        toast.error("❌ Error inesperado al eliminar tarjeta")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />

              <CardTitle className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Eliminar Tarjeta</h2>
                    <p className="text-red-100 text-sm font-normal">
                      Paso {step} de 3 - {step === 1 ? "Verificar" : step === 2 ? "Confirmar" : "Completado"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
              {/* Step 1: Verificación de identidad */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 text-red-600 mb-6 shadow-lg"
                    >
                      <AlertTriangle className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Atención!</h3>
                    <p className="text-gray-600">Esta acción eliminará permanentemente la tarjeta</p>
                    <p className="text-red-600 font-semibold text-sm mt-2">Tarjeta: {numeroTarjeta}</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800">Acción irreversible</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Una vez eliminada, no podrás recuperar esta tarjeta ni su historial.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="correo" className="text-sm font-semibold text-gray-700">
                      Correo electrónico
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="correo"
                        type="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="pl-12 h-12 border-2 border-gray-200 focus:border-red-500 rounded-xl transition-all duration-200"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleEnviarOtp}
                    disabled={loading || !correo.trim()}
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Enviando código...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5" />
                        <span>Verificar identidad</span>
                      </div>
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Verificar OTP y confirmar */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 mb-6 shadow-lg"
                    >
                      <Lock className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Verificar código</h3>
                    <p className="text-gray-600">Ingresa el código enviado a</p>
                    <p className="text-red-600 font-semibold">{correo}</p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <input
                          type="text"
                          maxLength={1}
                          value={otp[i] || ""}
                          onChange={(e) => {
                            const newOtp = otp.split("")
                            newOtp[i] = e.target.value
                            setOtp(newOtp.join(""))

                            if (e.target.value && i < 5) {
                              const nextInput = document.querySelector(
                                `input[data-index="${i + 1}"]`,
                              ) as HTMLInputElement
                              if (nextInput) nextInput.focus()
                            }
                          }}
                          data-index={i}
                          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 focus:border-red-500 rounded-xl transition-all duration-200"
                          placeholder="0"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {otp.length === 6 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-800 font-semibold mb-3">¿Estás completamente seguro?</p>
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={confirmacion}
                            onChange={(e) => setConfirmacion(e.target.checked)}
                            className="mt-1 rounded border-red-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-red-700 leading-relaxed">
                            Confirmo que quiero eliminar la tarjeta <strong>{numeroTarjeta}</strong> permanentemente.
                            Entiendo que esta acción no se puede deshacer.
                          </span>
                        </label>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-200"
                    >
                      Atrás
                    </Button>
                    <Button
                      onClick={handleVerificarYEliminar}
                      disabled={loading || otp.length !== 6 || !confirmacion}
                      className="flex-1 h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Eliminando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Trash2 className="w-5 h-5" />
                          <span>Eliminar tarjeta</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Éxito */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 mb-8 shadow-xl"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 mb-3"
                  >
                    ¡Tarjeta eliminada!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600"
                  >
                    La tarjeta {numeroTarjeta} ha sido eliminada exitosamente
                  </motion.p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default EliminarTarjeta
