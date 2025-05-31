"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CheckCircle, KeyRound, Mail, Eye, EyeOff, Lock, AlertTriangle } from "lucide-react"
import {
  enviarOtp,
  verificarOtp,
  cambiarPassword,
  evaluarFortaleza,
  obtenerTextoFortaleza,
  obtenerColorFortaleza,
  validarPasswords,
  manejarError,
} from "./utils"

interface Props {
  correo: string
}

export default function SeccionPassword({ correo }: Props) {
  const [otp, setOtp] = useState("")
  const [validado, setValidado] = useState(false)
  const [nueva, setNueva] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [cargando, setCargando] = useState(false)
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)
  const [fortaleza, setFortaleza] = useState(0)
  const [otpEnviado, setOtpEnviado] = useState(false)

  const handleEnviarOtp = async () => {
    setCargando(true)
    try {
      await enviarOtp({ correo, tipo: "cambio" })
      toast.success("✅ Código OTP enviado a tu correo")

      if (otp.length === 0) {
        setOtp(" ")
        setTimeout(() => setOtp(""), 100)
      }
      setOtpEnviado(true)
    } catch (error) {
      const errorMessage = manejarError(error)
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      })
    } finally {
      setCargando(false)
    }
  }

  const handleVerificarOtp = async () => {
    setCargando(true)
    try {
      await verificarOtp({ correo, otp })
      toast.success("✅ Identidad verificada correctamente")
      setValidado(true)
      setOtpEnviado(false)
    } catch (error) {
      const errorMessage = manejarError(error)
      toast.error(errorMessage, {
        duration: 5000,
        position: "top-center",
      })
    } finally {
      setCargando(false)
    }
  }

  const handleCambiarPassword = async () => {
    // Validaciones usando la función utilitaria
    const errorValidacion = validarPasswords(nueva, confirmar, fortaleza)
    if (errorValidacion) {
      toast.error(errorValidacion)
      return
    }

    if (!validado) {
      toast.error("Debes verificar tu identidad primero")
      return
    }

    setCargando(true)
    try {
      await cambiarPassword({ correo, nuevaContrasenia: nueva })

      toast("🔐 ¡Contraseña cambiada con éxito!", {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#10B981",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
        icon: "🔐",
      })

      console.log("🔐 CONFIRMACIÓN: Contraseña cambiada exitosamente")

      // Resetear formulario
      resetearFormulario()
    } catch (error) {
      const errorMessage = manejarError(error)
      toast.error(errorMessage, {
        duration: 6000,
        position: "top-center",
        style: {
          background: "#EF4444",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          padding: "16px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        },
      })
    } finally {
      setCargando(false)
    }
  }

  const actualizarFortaleza = (password: string) => {
    const puntaje = evaluarFortaleza(password)
    setFortaleza(puntaje)
    return puntaje
  }

  const resetearFormulario = () => {
    console.log("🔄 Reseteando formulario de contraseña...")
    setOtp("")
    setValidado(false)
    setOtpEnviado(false)
    setNueva("")
    setConfirmar("")
    setFortaleza(0)
    toast.success("Formulario reseteado")
  }

  return (
    <div className="max-w-xl mx-auto">
      {!validado ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-800">Verificación de seguridad</h3>
              <p className="text-sm text-blue-700 mt-1">
                Para cambiar tu contraseña, primero necesitamos verificar tu identidad mediante un código OTP.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Tu correo electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={correo || ""}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Enviaremos un código de verificación a este correo</p>
          </div>

          {!otpEnviado ? (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleEnviarOtp}
                disabled={cargando || !correo}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
              >
                {cargando ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Enviar código OTP</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: otp.length > 0 || otpEnviado ? 1 : 0,
                height: otp.length > 0 || otpEnviado ? "auto" : 0,
              }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-5 bg-white border border-blue-100 rounded-xl shadow-sm">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-blue-500" />
                  <span>Verificar código</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex gap-2 justify-center">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={otp[i] || ""}
                        onChange={(e) => {
                          const newOtp = otp.split("")
                          newOtp[i] = e.target.value
                          setOtp(newOtp.join(""))

                          if (e.target.value && i < 5) {
                            const nextInput = e.target.parentElement?.nextElementSibling?.querySelector("input")
                            if (nextInput) nextInput.focus()
                          }
                        }}
                        className="w-10 h-12 text-center border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleEnviarOtp}
                      disabled={cargando}
                      className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      Reenviar código
                    </button>

                    <button
                      onClick={handleVerificarOtp}
                      disabled={cargando || otp.length !== 6}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {cargando ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Verificando...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Verificar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-800">Identidad verificada</h3>
              <p className="text-sm text-green-700 mt-1">
                Tu identidad ha sido verificada correctamente. Ahora puedes establecer una nueva contraseña.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={mostrarPassword ? "text" : "password"}
                value={nueva}
                onChange={(e) => {
                  setNueva(e.target.value)
                  actualizarFortaleza(e.target.value)
                }}
                className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                placeholder="Ingresa tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {mostrarPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Fortaleza de la contraseña:</span>
                <span className="text-xs font-medium">{obtenerTextoFortaleza(fortaleza)}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${obtenerColorFortaleza(fortaleza)}`}
                  style={{ width: `${(fortaleza / 5) * 100}%` }}
                ></div>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                <li className={`flex items-center gap-1 ${/[A-Z]/.test(nueva) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(nueva) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>Mayúsculas</span>
                </li>
                <li className={`flex items-center gap-1 ${/[a-z]/.test(nueva) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(nueva) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>Minúsculas</span>
                </li>
                <li className={`flex items-center gap-1 ${/[0-9]/.test(nueva) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(nueva) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>Números</span>
                </li>
                <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(nueva) ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(nueva) ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>Símbolos</span>
                </li>
                <li className={`flex items-center gap-1 ${nueva.length >= 8 ? "text-green-600" : ""}`}>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${nueva.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                  ></div>
                  <span>Mínimo 8 caracteres</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={mostrarConfirmar ? "text" : "password"}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${
                  confirmar && nueva !== confirmar
                    ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                }`}
                placeholder="Confirma tu nueva contraseña"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {mostrarConfirmar ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {confirmar && nueva !== confirmar && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={resetearFormulario}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleCambiarPassword}
              disabled={cargando || !nueva || !confirmar || nueva !== confirmar || fortaleza < 3 || !correo}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
            >
              {cargando ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Cambiar contraseña</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
