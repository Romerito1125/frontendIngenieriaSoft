"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CreditCard, Shield, CheckCircle, Mail, Hash, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import toast from "react-hot-toast"
import { getCurrentUser } from "./auth-service"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  cuentaId: string
}

const RegistrarTarjeta: React.FC<Props> = ({ isOpen, onClose, onSuccess, cuentaId }) => {
  const [step, setStep] = useState(1)
  const [numeroTarjeta, setNumeroTarjeta] = useState("")
  const [correo, setCorreo] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true)
    // Obtener datos del usuario autenticado
    const user = getCurrentUser()
    if (user) {
      setCorreo(user.email)
    }
  }, [])

  const resetForm = () => {
    setStep(1)
    setNumeroTarjeta("")
    setOtp("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // Formatear número de tarjeta mientras se escribe
  const formatCardNumber = (value: string) => {
    // Remover todo excepto números
    const numbers = value.replace(/\D/g, "")

    // Limitar a 13 dígitos (XX.XX.XXXXXXXX-X)
    if (numbers.length > 13) return numeroTarjeta

    // Formatear como XX.XX.XXXXXXXX-X
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4)}`
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 4)}.${numbers.slice(4, 12)}-${numbers.slice(12)}`
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setNumeroTarjeta(formatted)
  }

  const handleEnviarOtp = async () => {
    if (!numeroTarjeta.trim()) {
      toast.error("Ingresa el número de tarjeta")
      return
    }

    // Verificar formato completo (XX.XX.XXXXXXXX-X = 16 caracteres con puntos y guión)
    if (numeroTarjeta.length !== 16) {
      toast.error("El número de tarjeta debe tener el formato XX.XX.XXXXXXXX-X")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "registro_tarjeta" }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Error sending OTP:", errorText)
        throw new Error("Error al enviar código de verificación")
      }

      const result = await res.json()
      console.log("OTP sent successfully:", result)

      toast.success("Código de verificación enviado")
      setStep(2)
    } catch (error) {
      console.error("Send OTP error:", error)
      toast.error("Error al enviar código de verificación")
    } finally {
      setLoading(false)
    }
  }

  const handleVerificarYRegistrar = async () => {
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
        toast.error("Código inválido o expirado")
        return
      }

      const otpResult = await resOtp.json()
      console.log("OTP verification successful:", otpResult)

      // Debug: Log what we're sending to the backend
      console.log("Sending to backend:", {
        url: `https://www.api.devcorebits.com/tarjetasGateway/tarjetas/crearTarjeta/${cuentaId}`,
        body: { numeroTarjeta },
        cuentaId,
        numeroTarjeta,
      })

      // Registrar tarjeta
      const resTarjeta = await fetch(`https://www.api.devcorebits.com/tarjetasGateway/tarjetas/crearTarjeta/${cuentaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeroTarjeta }),
      })

      console.log("Backend response status:", resTarjeta.status)

      if (!resTarjeta.ok) {
        const errorText = await resTarjeta.text()
        console.log("Error response from backend:", errorText)

        try {
          const errorData = JSON.parse(errorText)
          const errorMessage = errorData.error?.message || errorData.message || "Error al registrar tarjeta"

          // Mostrar mensajes específicos según el tipo de error
          if (errorMessage.includes("no existe")) {
            toast.error("❌ El número de tarjeta no existe en el sistema")
          } else if (errorMessage.includes("ya está asignada")) {
            toast.error("⚠️ Esta tarjeta ya está registrada en otra cuenta")
          } else if (errorMessage.includes("requerido")) {
            toast.error("📝 Todos los campos son obligatorios")
          } else {
            toast.error(`❌ ${errorMessage}`)
          }
        } catch (parseError) {
          toast.error("❌ Error del servidor. Intenta nuevamente")
        }
        return
      }

      const tarjetaResult = await resTarjeta.json()
      console.log("Tarjeta registration successful:", tarjetaResult)

      toast.success("🎉 ¡Tarjeta registrada exitosamente!")
      setStep(3)
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2500)
    } catch (error: unknown) {
      console.error("Registration error:", error)
      // Solo mostrar errores de red o problemas de conexión
      if (error instanceof Error && error.message.includes("fetch")) {
        toast.error("🌐 Error de conexión. Verifica tu internet")
      } else {
        toast.error("❌ Error inesperado. Intenta nuevamente")
      }
    } finally {
      setLoading(false)
    }
  }

  // No renderizar hasta que esté montado
  if (!mounted || !isOpen) return null

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
            <CardHeader className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

              <CardTitle className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Nueva Tarjeta TUYO</h2>
                    <p className="text-blue-100 text-sm font-normal">
                      Paso {step} de 3 - {step === 1 ? "Datos" : step === 2 ? "Verificar" : "Completado"}
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
              {/* Step 1: Datos de la tarjeta */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 mb-6 shadow-lg"
                    >
                      <Sparkles className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">¡Bienvenido!</h3>
                    <p className="text-gray-600">Registra tu tarjeta de transporte existente</p>
                  </div>

                  <div className="space-y-6">
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
                          className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                          placeholder="tu@email.com"
                          disabled={!!getCurrentUser()?.email}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numeroTarjeta" className="text-sm font-semibold text-gray-700">
                        Número de tarjeta
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Hash className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="numeroTarjeta"
                          type="text"
                          value={numeroTarjeta}
                          onChange={handleCardNumberChange}
                          placeholder="XX.XX.XXXXXXXX-X"
                          className="pl-12 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 font-mono text-lg"
                        />
                      </div>
                      <p className="text-xs text-gray-500 ml-1">
                        Formato: XX.XX.XXXXXXXX-X (como aparece en tu tarjeta física)
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleEnviarOtp}
                    disabled={loading || numeroTarjeta.length !== 16 || !correo}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

              {/* Step 2: Verificar OTP */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 text-green-600 mb-6 shadow-lg"
                    >
                      <Shield className="w-10 h-10" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Verificación</h3>
                    <p className="text-gray-600">Ingresa el código enviado a</p>
                    <p className="text-blue-600 font-semibold">{correo}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-800">Tarjeta: {numeroTarjeta}</p>
                        <p className="text-sm text-blue-700">Se validará al confirmar el código</p>
                      </div>
                    </div>
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
                                `input[data-otp-index="${i + 1}"]`,
                              ) as HTMLInputElement
                              if (nextInput) nextInput.focus()
                            }
                          }}
                          data-otp-index={i}
                          className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                          placeholder="0"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-200"
                    >
                      Atrás
                    </Button>
                    <Button
                      onClick={handleVerificarYRegistrar}
                      disabled={loading || otp.length !== 6}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Registrando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5" />
                          <span>Registrar</span>
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
                    <CheckCircle className="w-12 h-12" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold text-gray-900 mb-3"
                  >
                    ¡Tarjeta registrada!
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-600"
                  >
                    Tu tarjeta TUYO está lista para usar
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200"
                  >
                    <p className="text-sm text-blue-700 font-medium">Tarjeta: {numeroTarjeta}</p>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RegistrarTarjeta
