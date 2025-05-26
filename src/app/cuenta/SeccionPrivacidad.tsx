"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle, Mail, Trash2, Shield } from "lucide-react"

interface Props {
  correo: string
}

export default function SeccionPrivacidad({ correo }: Props) {
  const [otp, setOtp] = useState("")
  const [validado, setValidado] = useState(false)
  const [confirmacion, setConfirmacion] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [otpEnviado, setOtpEnviado] = useState(false)

  const handleEnviarOtp = async () => {
    console.log("🚀 Iniciando envío de OTP para eliminación...")
    console.log("Correo:", correo)

    if (!correo) {
      toast.error("Correo no disponible")
      return
    }

    setCargando(true)
    try {
      console.log("📤 Enviando solicitud OTP...")
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim(), tipo: "eliminacion" }),
      })

      const data = await res.json()
      console.log("📥 Respuesta del servidor:", data)

      if (!res.ok) {
        throw new Error(data.message || "Error al enviar OTP")
      }

      toast.success("✅ Código OTP enviado a tu correo")
      // Mostrar automáticamente el campo OTP después de enviar
      if (otp.length === 0) {
        setOtp(" ") // Trigger para mostrar el campo OTP
        setTimeout(() => setOtp(""), 100) // Reset inmediato pero mantiene la animación
      }
      setOtpEnviado(true)
    } catch (error) {
      console.error("❌ Error enviando OTP:", error)
      toast.error(error instanceof Error ? error.message : "No se pudo enviar el código OTP")
    } finally {
      setCargando(false)
    }
  }

  const handleVerificarOtp = async () => {
    console.log("🔐 Verificando OTP para eliminación...")
    console.log("OTP ingresado:", otp)
    console.log("Correo:", correo)

    if (!otp || otp.length !== 6) {
      toast.error("Ingresa el código OTP completo")
      return
    }

    setCargando(true)
    try {
      console.log("📤 Enviando verificación OTP...")
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim(), otp }),
      })

      const data = await res.json()
      console.log("📥 Respuesta verificación OTP:", data)

      if (!res.ok) {
        throw new Error(data.message || "OTP inválido o expirado")
      }

      toast.success("✅ Identidad verificada correctamente")
      setValidado(true)
      setOtpEnviado(false)
    } catch (error) {
      console.error("❌ Error verificando OTP:", error)
      toast.error(error instanceof Error ? error.message : "Error al verificar el código")
    } finally {
      setCargando(false)
    }
  }

  const handleEliminarCuenta = async () => {
    console.log("🗑️ Iniciando eliminación de cuenta...")
    console.log("Correo:", correo)
    console.log("Validado:", validado)
    console.log("Confirmación:", confirmacion)

    if (!validado) {
      toast.error("Debes verificar tu identidad primero")
      return
    }

    if (!confirmacion) {
      toast.error("Debes confirmar la eliminación")
      return
    }

    setCargando(true)
    try {
      console.log("📤 Buscando cuenta por correo...")
      // Primero buscar la cuenta por correo para obtener el ID
      const buscarRes = await fetch(`https://www.cuentas.devcorebits.com/cuenta/buscar-por-correo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: correo.trim() }),
      })

      let cuentaId = null

      if (!buscarRes.ok) {
        // Si no existe el endpoint de búsqueda, intentar con el endpoint directo
        console.log("📤 Endpoint de búsqueda no disponible, intentando método alternativo...")

        // Intentar obtener el ID desde el localStorage o desde el JWT
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1]
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split(".")[1]))
            cuentaId = payload.userId
            console.log("📥 ID obtenido del token:", cuentaId)
          } catch (e) {
            console.error("Error decodificando token:", e)
          }
        }

        if (!cuentaId) {
          throw new Error("No se pudo identificar la cuenta para eliminar")
        }
      } else {
        const buscarData = await buscarRes.json()
        console.log("📥 Datos de búsqueda:", buscarData)
        cuentaId = buscarData.idcuenta || buscarData.id
      }

      if (!cuentaId) {
        throw new Error("No se pudo identificar la cuenta")
      }

      console.log("📤 Eliminando cuenta con ID:", cuentaId)
      // Ahora eliminar usando el ID
      const res = await fetch(`https://www.cuentas.devcorebits.com/cuenta/eliminar/${cuentaId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      })

      const data = await res.json()
      console.log("📥 Respuesta eliminación:", data)

      if (!res.ok) throw new Error(data?.message || "Ocurrió un error inesperado")

      toast.success("✅ Cuenta eliminada exitosamente")

      // Limpiar cookies y redirigir
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      setTimeout(() => (window.location.href = "/auth/login"), 2000)
    } catch (e: unknown) {
      console.error("❌ Error eliminando cuenta:", e)
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error("Error desconocido")
      }
    } finally {
      setCargando(false)
    }
  }

  const resetearFormulario = () => {
    console.log("🔄 Reseteando formulario de eliminación...")
    setOtp("")
    setValidado(false)
    setOtpEnviado(false)
    setConfirmacion(false)
    toast.success("Proceso cancelado")
  }

  return (
    <div className="max-w-xl mx-auto">
      {!validado ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Zona de peligro</h3>
              <p className="text-sm text-red-700 mt-1">
                La eliminación de tu cuenta es permanente y no se puede deshacer. Todos tus datos serán eliminados.
              </p>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Eliminar cuenta</h3>
            <p className="text-gray-600 mb-6">
              Al eliminar tu cuenta, perderás acceso a todos los servicios y datos asociados. Esta acción no se puede
              deshacer.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Tu correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={correo}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enviaremos un código de verificación a este correo</p>
              </div>

              {!otpEnviado ? (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      console.log("🔘 Botón 'Verificar identidad' clickeado")
                      handleEnviarOtp()
                    }}
                    disabled={cargando}
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
                  >
                    {cargando ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Verificar identidad</span>
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
                  <div className="mt-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
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

                              // Auto-focus next input
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
                          onClick={() => {
                            console.log("🔘 Botón 'Reenviar código' clickeado")
                            handleEnviarOtp()
                          }}
                          disabled={cargando}
                          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                        >
                          Reenviar código
                        </button>

                        <button
                          onClick={() => {
                            console.log("🔘 Botón 'Verificar' clickeado")
                            handleVerificarOtp()
                          }}
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
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-8 border border-red-200 rounded-xl bg-red-50">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <Trash2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-red-800 mb-2">Eliminar cuenta permanentemente</h3>
              <p className="text-red-700 mb-6 max-w-md mx-auto">
                Esta acción eliminará permanentemente tu cuenta y todos los datos asociados. No podrás recuperar esta
                información.
              </p>

              {!confirmacion ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        console.log("🔘 Botón 'Cancelar' clickeado")
                        resetearFormulario()
                      }}
                      className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        console.log("🔘 Botón 'Quiero eliminar mi cuenta' clickeado")
                        setConfirmacion(true)
                        toast.success("Confirmación activada. Ahora puedes proceder con la eliminación.")
                      }}
                      className="px-6 py-3 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Quiero eliminar mi cuenta
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-red-800 font-medium">
                    ¿Estás completamente seguro? Esta acción no se puede deshacer.
                  </p>

                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => {
                        console.log("🔘 Botón 'Cancelar' (segunda confirmación) clickeado")
                        setConfirmacion(false)
                        toast.success("Eliminación cancelada")
                      }}
                      className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>

                    <button
                      onClick={() => {
                        console.log("🔘 Botón 'Eliminar permanentemente' clickeado")
                        handleEliminarCuenta()
                      }}
                      disabled={cargando}
                      className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                    >
                      {cargando ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Eliminando...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          <span>Eliminar permanentemente</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
