"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Zap,
  Calendar,
  CreditCardIcon,
  ShieldCheck,
  Lock,
  AlertCircle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")

  // Datos de tarjeta de crédito
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")

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
      const res = await fetch(`https://www.api.devcorebits.com/tarjetasGateway/tarjetas/${tarjetaId}`)
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
    setStep(1)
    setCardNumber("")
    setCardName("")
    setCardExpiry("")
    setCardCvc("")
    setPaymentMethod("card")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleMontoRapido = (valor: number) => {
    setMonto(valor.toString())
  }

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length > 16) return cardNumber

    // Format as XXXX XXXX XXXX XXXX
    const parts = []
    for (let i = 0; i < numbers.length; i += 4) {
      parts.push(numbers.slice(i, i + 4))
    }
    return parts.join(" ")
  }

  const formatExpiryDate = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length > 4) return cardExpiry

    // Format as MM/YY
    if (numbers.length <= 2) return numbers
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardExpiry(formatExpiryDate(e.target.value))
  }

  const handleContinueToPayment = () => {
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

    setStep(2)
  }

  const validateCardDetails = () => {
    if (paymentMethod === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Número de tarjeta inválido")
        return false
      }
      if (!cardName.trim()) {
        toast.error("Ingresa el nombre del titular")
        return false
      }
      if (cardExpiry.length !== 5) {
        toast.error("Fecha de expiración inválida")
        return false
      }
      if (cardCvc.length !== 3) {
        toast.error("Código de seguridad inválido")
        return false
      }
    }
    return true
  }

  const handleProcessPayment = async () => {
    if (!validateCardDetails()) return

    setLoading(true)

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Actualizar saldo
      const resUpdate = await fetch("https://www.api.devcorebits.com/tarjetasGateway/tarjetas/actualizarSaldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idTarjeta: tarjetaId,
          monto: Number(monto),
        }),
      })

      if (resUpdate.ok) {
        setStep(3)
        toast.success("💳 Pago procesado exitosamente")

        // Esperar un momento y cerrar
        setTimeout(() => {
          onSuccess()
          handleClose()
        }, 3000)
      } else {
        const updateError = await resUpdate.text()
        console.error("Error updating balance:", updateError)
        toast.error("⚠️ Error al actualizar saldo")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("❌ Error al procesar el pago")
    } finally {
      setLoading(false)
    }
  }

  const getCardType = (number: string) => {
    const firstDigit = number.replace(/\D/g, "").charAt(0)

    if (firstDigit === "4") return "Visa"
    if (firstDigit === "5") return "Mastercard"
    if (firstDigit === "3") return "American Express"
    if (firstDigit === "6") return "Discover"
    return "Tarjeta"
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
            <CardHeader className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

              <CardTitle className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Recargar Tarjeta</h2>
                    <p className="text-blue-100 text-sm font-normal">
                      Paso {step} de 3 - {step === 1 ? "Monto" : step === 2 ? "Pago" : "Confirmación"}
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

            <CardContent className="p-6">
              {/* Paso 1: Selección de monto */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
                        className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200"
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
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
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
                          className="h-10 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200"
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
                      className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-blue-600 rounded-lg text-white">
                          <Zap className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-blue-800 text-sm">Resumen de recarga</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Tarjeta:</span>
                          <span className="font-semibold text-blue-800">{tarjeta?.numero_tarjeta}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Monto a recargar:</span>
                          <span className="font-bold text-blue-800">
                            ${Number.parseInt(monto).toLocaleString()} COP
                          </span>
                        </div>
                        {tarjeta && (
                          <div className="flex justify-between border-t border-blue-300 pt-2">
                            <span className="text-blue-700 font-semibold">Nuevo saldo:</span>
                            <span className="font-bold text-blue-800">
                              ${((tarjeta.saldo || 0) + Number.parseInt(monto)).toLocaleString()} COP
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <Button
                    onClick={handleContinueToPayment}
                    disabled={loading || !monto || Number.parseInt(monto) <= 0 || !email.trim()}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <span>Continuar al pago</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Button>
                </motion.div>
              )}

              {/* Paso 2: Método de pago */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Total a pagar:</span>
                      </div>
                      <span className="font-bold text-blue-800 text-lg">
                        ${Number.parseInt(monto).toLocaleString()} COP
                      </span>
                    </div>
                  </div>

                  <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger
                        value="card"
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                      >
                        <CreditCardIcon className="w-4 h-4 mr-2" />
                        Tarjeta
                      </TabsTrigger>
                      <TabsTrigger
                        value="pse"
                        className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="24" height="24" rx="4" fill="currentColor" fillOpacity="0.2" />
                          <path
                            d="M7 12H17M17 12L13 8M17 12L13 16"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        PSE
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber" className="text-sm font-semibold text-gray-700">
                            Número de tarjeta
                          </Label>
                          <div className="relative">
                            <Input
                              id="cardNumber"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              placeholder="1234 5678 9012 3456"
                              className="h-12 pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200 font-mono"
                              maxLength={19}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                              <CreditCardIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            {cardNumber && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {getCardType(cardNumber)}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cardName" className="text-sm font-semibold text-gray-700">
                            Nombre del titular
                          </Label>
                          <Input
                            id="cardName"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Como aparece en la tarjeta"
                            className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardExpiry" className="text-sm font-semibold text-gray-700">
                              Fecha de expiración
                            </Label>
                            <div className="relative">
                              <Input
                                id="cardExpiry"
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                placeholder="MM/YY"
                                className="h-12 pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200 font-mono"
                                maxLength={5}
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="cardCvc" className="text-sm font-semibold text-gray-700">
                              Código de seguridad
                            </Label>
                            <div className="relative">
                              <Input
                                id="cardCvc"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                placeholder="123"
                                className="h-12 pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200 font-mono"
                                maxLength={3}
                                type="password"
                              />
                              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Lock className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                          Tus datos de pago están seguros y encriptados. Nunca almacenamos la información completa de tu
                          tarjeta.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="pse" className="space-y-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank" className="text-sm font-semibold text-gray-700">
                            Selecciona tu banco
                          </Label>
                          <select
                            id="bank"
                            className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200 px-3"
                          >
                            <option value="">Selecciona un banco</option>
                            <option value="bancolombia">Bancolombia</option>
                            <option value="davivienda">Davivienda</option>
                            <option value="bbva">BBVA</option>
                            <option value="bogota">Banco de Bogotá</option>
                            <option value="popular">Banco Popular</option>
                            <option value="occidente">Banco de Occidente</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="docType" className="text-sm font-semibold text-gray-700">
                            Tipo de documento
                          </Label>
                          <select
                            id="docType"
                            className="w-full h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200 px-3"
                          >
                            <option value="">Selecciona tipo de documento</option>
                            <option value="cc">Cédula de Ciudadanía</option>
                            <option value="ce">Cédula de Extranjería</option>
                            <option value="nit">NIT</option>
                            <option value="pp">Pasaporte</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="docNumber" className="text-sm font-semibold text-gray-700">
                            Número de documento
                          </Label>
                          <Input
                            id="docNumber"
                            placeholder="Ingresa tu número de documento"
                            className="h-12 border-2 border-gray-200 focus:border-blue-500 rounded-lg transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                          Serás redirigido al portal de tu banco para completar la transacción de forma segura.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold transition-all duration-200"
                    >
                      Atrás
                    </Button>
                    <Button
                      onClick={handleProcessPayment}
                      disabled={loading}
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5" />
                          <span>Pagar</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Paso 3: Confirmación */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-green-200 text-green-600 mb-4 shadow-xl"
                  >
                    <CheckCircle2 className="w-12 h-12" />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-900">¡Pago exitoso!</h3>
                    <p className="text-gray-600">Tu recarga ha sido procesada correctamente</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 max-w-xs mx-auto">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Tarjeta:</span>
                        <span className="font-semibold text-blue-800">{tarjeta?.numero_tarjeta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Monto recargado:</span>
                        <span className="font-bold text-blue-800">${Number.parseInt(monto).toLocaleString()} COP</span>
                      </div>
                      <div className="flex justify-between border-t border-blue-300 pt-2">
                        <span className="text-blue-700 font-semibold">Nuevo saldo:</span>
                        <span className="font-bold text-blue-800">
                          ${((tarjeta?.saldo || 0) + Number.parseInt(monto)).toLocaleString()} COP
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">Tu saldo ya está disponible para usar</span>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RecargarTarjeta
