"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { CheckCircle, User, Mail, Shield } from "lucide-react"

interface Props {
  correo: string
  id: number
}

type CuentaData = {
  nombre: string
  apellido: string
  correo: string
}

export default function SeccionCuenta({ correo, id }: Props) {
  const [cuenta, setCuenta] = useState<CuentaData>({
    nombre: "",
    apellido: "",
    correo: correo,
  })
  const [otp, setOtp] = useState("")
  const [verificado, setVerificado] = useState(false)
  const [mostrarOtp, setMostrarOtp] = useState(false)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!id) return

    fetch(`https://www.cuentas.devcorebits.com/cuenta/getCuenta/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.nombre) {
          setCuenta(data)
        } else {
          toast.error("Error cargando cuenta")
        }
      })
      .catch(() => toast.error("Error cargando cuenta"))
  }, [id])

  const handleEnviarOtp = async () => {
    setCargando(true)
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "actualizacion" }),
      })

      if (!res.ok) throw new Error()
      toast.success("OTP enviado correctamente al correo")
      setMostrarOtp(true)
    } catch {
      toast.error("Error al enviar OTP")
    } finally {
      setCargando(false)
    }
  }

  const handleConfirmarOtp = async () => {
    setCargando(true)
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, otp }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success("Identidad verificada")
      setVerificado(true)
      setMostrarOtp(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "OTP inválido")
      } else {
        toast.error("Error desconocido")
      }
    } finally {
      setCargando(false)
    }
  }

  const handleActualizar = async () => {
    if (!cuenta.nombre || !cuenta.apellido || !cuenta.correo) {
      toast.error("Todos los campos son obligatorios")
      return
    }

    setCargando(true)
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/actualizar-con-otp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo,
          otp,
          nombre: cuenta.nombre,
          apellido: cuenta.apellido,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      toast.success("Información actualizada correctamente")
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error al actualizar")
      } else {
        toast.error("Error desconocido")
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="space-y-6">
      {!verificado && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800">Verificación requerida</h3>
            <p className="text-sm text-blue-700 mt-1">
              Para actualizar tu información personal, necesitamos verificar tu identidad.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={cuenta.nombre}
              onChange={(e) => setCuenta({ ...cuenta, nombre: e.target.value })}
              disabled={!verificado}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                verificado
                  ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all duration-200`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={cuenta.apellido}
              onChange={(e) => setCuenta({ ...cuenta, apellido: e.target.value })}
              disabled={!verificado}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                verificado
                  ? "border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                  : "bg-gray-50 border-gray-200"
              } transition-all duration-200`}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={cuenta.correo}
            disabled
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede modificar</p>
      </div>

      {!verificado && !mostrarOtp && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-6">
          <button
            onClick={handleEnviarOtp}
            disabled={cargando}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
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
        </motion.div>
      )}

      {mostrarOtp && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-5 bg-white border border-blue-100 rounded-xl shadow-sm"
        >
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Código enviado</span>
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Hemos enviado un código de verificación a tu correo electrónico. Introdúcelo a continuación:
          </p>

          <div className="space-y-4">
            <div className="flex gap-2">
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
                onClick={handleEnviarOtp}
                disabled={cargando}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Reenviar código
              </button>

              <button
                onClick={handleConfirmarOtp}
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
        </motion.div>
      )}

      {verificado && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end mt-6">
          <button
            onClick={handleActualizar}
            disabled={cargando}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
          >
            {cargando ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Guardar cambios</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </div>
  )
}
