"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, DollarSign, CreditCard, ExternalLink, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { getCurrentUser } from "./auth-service"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  tarjetaId: string
}

type Tarjeta = {
  numero_tarjeta: string
  saldo: number
  fechaExpedicion: string
}

const RecargarTarjeta: React.FC<Props> = ({ isOpen, onClose, onSuccess, tarjetaId }) => {
  const [tarjeta, setTarjeta] = useState<Tarjeta | null>(null)
  const [monto, setMonto] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [payuData, setPayuData] = useState<any>(null)

  // Montos predefinidos
  const montosRapidos = [5000, 10000, 20000, 50000]

  useEffect(() => {
    setMounted(true)
    // Obtener email del usuario autenticado
    const user = getCurrentUser()
    if (user) {
      setEmail(user.email)
    }
  }, [])

  useEffect(() => {
    if (isOpen && tarjetaId && mounted) {
      fetchTarjeta()
    }
  }, [isOpen, tarjetaId, mounted])

  const fetchTarjeta = async () => {
    try {
      console.log("Fetching tarjeta with ID:", tarjetaId)
      const res = await fetch(`https://serviciotarjetas.onrender.com/tarjetas/${tarjetaId}`)
      console.log("Fetch response status:", res.status)

      if (res.ok) {
        const data = await res.json()
        console.log("Tarjeta data received:", data)

        if (data && typeof data === "object") {
          const tarjetaData = Array.isArray(data) ? data[0] : data
          if (tarjetaData) {
            tarjetaData.saldo = Number(tarjetaData.saldo) || 0
            setTarjeta(tarjetaData)
          }
        }
      } else {
        const errorText = await res.text()
        console.error("Error fetching tarjeta:", errorText)
      }
    } catch (error) {
      console.error("Error al cargar tarjeta:", error)
    }
  }

  const resetForm = () => {
    setMonto("")
    setPayuData(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleMontoRapido = (valor: number) => {
    setMonto(valor.toString())
  }

  const handleGenerarFormulario = async () => {
    if (!monto || Number.parseInt(monto) <= 0) {
      toast.error("💰 Ingresa un monto válido")
      return
    }

    if (Number.parseInt(monto) < 1000) {
      toast.error("💰 El monto mínimo es $1,000 COP")
      return
    }

    if (!email.trim()) {
      toast.error("📧 Ingresa tu correo electrónico")
      return
    }

    setLoading(true)

    try {
      console.log("Generating PayU form for:", { tarjetaId, email, monto: Number(monto) })

      // Generar datos de PayU
      const res = await fetch(`https://serviciotarjetas.onrender.com/tarjetas/recarga/payu/${tarjetaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          monto: Number(monto),
        }),
      })

      console.log("PayU response status:", res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Error PayU response:", errorText)

        try {
          const errorData = JSON.parse(errorText)
          const errorMessage = errorData.error?.message || errorData.message || "Error al generar formulario de pago"

          if (errorMessage.includes("monto")) {
            toast.error("💰 Monto inválido para la recarga")
          } else if (errorMessage.includes("email")) {
            toast.error("📧 Email inválido")
          } else {
            toast.error(`❌ ${errorMessage}`)
          }
        } catch (parseError) {
          toast.error("❌ Error del servidor al procesar la recarga")
        }
        return
      }

      const payuFormData = await res.json()
      console.log("PayU form data received:", payuFormData)
      setPayuData(payuFormData)

      // Actualizar saldo antes de redirigir
      const resUpdate = await fetch("https://serviciotarjetas.onrender.com/tarjetas/actualizarSaldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idTarjeta: tarjetaId,
          monto: Number(monto),
        }),
      })

      if (resUpdate.ok) {
        toast.success("💳 Redirigiendo a PayU...")

        setTimeout(() => {
          const form = document.getElementById("payuForm") as HTMLFormElement
          if (form) {
            console.log("Submitting PayU form")
            form.submit()
          } else {
            console.error("PayU form not found")
            toast.error("❌ Error al cargar formulario de pago")
          }
        }, 1500)
      } else {
        const updateError = await resUpdate.text()
        console.error("Error updating balance:", updateError)
        toast.error("⚠️ Error al actualizar saldo, pero puedes continuar con el pago")

        setTimeout(() => {
          const form = document.getElementById("payuForm") as HTMLFormElement
          if (form) form.submit()
        }, 1500)
      }
    } catch (error: unknown) {
      console.error("Recharge error:", error)
      if (error instanceof Error && error.message.includes("fetch")) {
        toast.error("🌐 Error de conexión. Verifica tu internet")
      } else {
        toast.error("❌ Error inesperado al procesar la recarga")
      }
    } finally {
      setLoading(false)
    }
  }

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
          className="w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <Card className="bg-white shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

              <CardTitle className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Recargar Tarjeta</h2>
                    <p className="text-green-100 text-sm font-normal">Agrega saldo a tu tarjeta TUYO</p>
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

            <CardContent className="p-6">
              {tarjeta && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl text-white">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-blue-900">Tarjeta {tarjeta.numero_tarjeta}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-blue-700 text-sm">Saldo actual:</span>
                        <Badge variant="secondary" className="bg-blue-600 text-white font-bold text-sm">
                          ${(tarjeta.saldo || 0).toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-700">
                      <Zap className="w-3 h-3 mr-1" />
                      Activa
                    </Badge>
                  </div>
                </motion.div>
              )}

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                      Correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="h-10 border-2 border-gray-200 focus:border-green-500 rounded-lg transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Monto a recargar</Label>

                    {/* Montos rápidos */}
                    <div className="grid grid-cols-2 gap-2">
                      {montosRapidos.map((valor) => (
                        <motion.button
                          key={valor}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleMontoRapido(valor)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm ${
                            monto === valor.toString()
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                          }`}
                        >
                          <div className="font-bold">${valor.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">COP</div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Monto personalizado */}
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm text-gray-600">
                        O ingresa un monto personalizado
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        placeholder="Ej: 25000"
                        min="1000"
                        step="1000"
                        className="h-10 border-2 border-gray-200 focus:border-green-500 rounded-lg transition-all duration-200"
                        required
                      />
                      <p className="text-xs text-gray-500">Mínimo: $1,000 COP</p>
                    </div>
                  </div>
                </div>

                {monto && Number.parseInt(monto) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1 bg-green-600 rounded-lg text-white">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-green-800 text-sm">Resumen de recarga</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Tarjeta:</span>
                        <span className="font-semibold text-green-800">{tarjeta?.numero_tarjeta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Monto a recargar:</span>
                        <span className="font-bold text-green-800">${Number.parseInt(monto).toLocaleString()} COP</span>
                      </div>
                      {tarjeta && (
                        <div className="flex justify-between border-t border-green-300 pt-2">
                          <span className="text-green-700 font-semibold">Nuevo saldo:</span>
                          <span className="font-bold text-green-800">
                            ${((tarjeta.saldo || 0) + Number.parseInt(monto)).toLocaleString()} COP
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={handleGenerarFormulario}
                  disabled={loading || !monto || Number.parseInt(monto) <= 0 || !email.trim()}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando recarga...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5" />
                      <span>Pagar con PayU</span>
                    </div>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Serás redirigido a la plataforma segura de PayU para completar el pago.
                  <br />
                  Tu saldo se actualizará automáticamente después del pago exitoso.
                </p>
              </div>

              {/* Formulario oculto de PayU */}
              {payuData && (
                <form
                  id="payuForm"
                  method="post"
                  action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
                  style={{ display: "none" }}
                >
                  {Object.entries(payuData).map(([key, value]) => (
                    <input key={key} name={key} type="hidden" value={String(value)} />
                  ))}
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RecargarTarjeta
