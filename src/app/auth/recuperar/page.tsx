"use client"

import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Mail, Key, Lock, RefreshCw, CheckCircle } from "lucide-react"

export default function RecuperarPasswordPage() {
  const [correo, setCorreo] = useState("")
  const [otp, setOtp] = useState("")
  const [nueva, setNueva] = useState("")
  const [confirmar, setConfirmar] = useState("")
  const [fase, setFase] = useState<"inicio" | "verificacion" | "recuperacion">("inicio")
  const [loading, setLoading] = useState(false)

  const handleEnviarOtp = async () => {
    if (!correo.trim()) {
      return toast.error("Por favor ingresa tu correo electrónico")
    }

    setLoading(true)
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "recuperacion" }),
      })

      if (!res.ok) throw new Error()
      toast.success("Código OTP enviado al correo")
      setFase("verificacion")
    } catch {
      toast.error("Error al enviar OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleVerificarOtp = async () => {
    if (!otp.trim()) {
      return toast.error("Por favor ingresa el código OTP")
    }

    setLoading(true)
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, otp }),
      })

      if (!res.ok) throw new Error("OTP inválido o expirado")
      toast.success("OTP verificado")
      setFase("recuperacion")
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error("Error desconocido")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (nueva !== confirmar) {
      return toast.error("Las contraseñas no coinciden")
    }

    if (nueva.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres")
    }

    setLoading(true)
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, nuevaContrasenia: nueva }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Error al cambiar contraseña")

      toast.success("Contraseña restablecida con éxito")
      setTimeout(() => (window.location.href = "/auth/login"), 2000)
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message)
      } else {
        toast.error("Error desconocido")
      }
    } finally {
      setLoading(false)
    }
  }

  // Función para renderizar el paso actual
  const renderPaso = () => {
    switch (fase) {
      case "inicio":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleEnviarOtp}
              disabled={loading}
              className={`w-full flex items-center justify-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-all transform hover:scale-[1.02] ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Enviando...
                </div>
              ) : (
                "Enviar código OTP"
              )}
            </button>
          </div>
        )

      case "verificacion":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">
              Hemos enviado un código a <span className="font-medium">{correo}</span>. Revisa tu bandeja de entrada e
              ingresa el código a continuación.
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="Código OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleVerificarOtp}
              disabled={loading}
              className={`w-full flex items-center justify-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-all transform hover:scale-[1.02] ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Verificando...
                </div>
              ) : (
                "Verificar código"
              )}
            </button>

            <div className="text-center">
              <button
                onClick={() => setFase("inicio")}
                className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
              >
                Cambiar correo electrónico
              </button>
            </div>
          </div>
        )

      case "recuperacion":
        return (
          <div className="space-y-6">
            <p className="text-gray-600">Crea una nueva contraseña segura para tu cuenta.</p>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={nueva}
                onChange={(e) => setNueva(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="password"
                placeholder="Confirmar nueva contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className={`w-full flex items-center justify-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-all transform hover:scale-[1.02] ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Procesando...
                </div>
              ) : (
                "Cambiar contraseña"
              )}
            </button>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Left Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Toaster position="top-center" />

          <div className="mb-6">
            <Link
              href="/auth/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio de sesión
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-800">Recuperar contraseña</h1>
            <p className="text-blue-600 mt-2">Sigue los pasos para recuperar tu acceso</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            {/* Indicador de pasos */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    fase === "inicio" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600 border-2 border-blue-600"
                  }`}
                >
                  <span>1</span>
                </div>
                <span className="text-xs mt-1 text-gray-600">Correo</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div
                  className={`h-full bg-blue-600 transition-all duration-300 ${
                    fase === "inicio" ? "w-0" : fase === "verificacion" ? "w-1/2" : "w-full"
                  }`}
                ></div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    fase === "verificacion"
                      ? "bg-blue-600 text-white"
                      : fase === "recuperacion"
                        ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <span>2</span>
                </div>
                <span className="text-xs mt-1 text-gray-600">Verificar</span>
              </div>
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div
                  className={`h-full bg-blue-600 transition-all duration-300 ${
                    fase === "recuperacion" ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    fase === "recuperacion" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <span>3</span>
                </div>
                <span className="text-xs mt-1 text-gray-600">Nueva</span>
              </div>
            </div>

            {/* Contenido del paso actual */}
            {renderPaso()}
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Recuperar contraseña"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">¿Olvidaste tu contraseña?</h2>
            <p className="text-lg text-blue-100 mb-8">
              No te preocupes, te ayudaremos a recuperar el acceso a tu cuenta en unos simples pasos.
            </p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-blue-200" />
              </div>
              <p className="text-lg">
                Tu seguridad es nuestra prioridad. Por eso verificamos tu identidad antes de permitir cualquier cambio
                en tu cuenta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
