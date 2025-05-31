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
  const [fortaleza, setFortaleza] = useState(0)
  const [mostrarNueva, setMostrarNueva] = useState(false)
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false)

  const handleEnviarOtp = async () => {
    if (!correo.trim()) {
      return toast.error("Por favor ingresa tu correo electrónico")
    }

    setLoading(true)
    try {
      const res = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/send-otp", {
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
      const res = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/verify-otp", {
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

    if (nueva.length < 8) {
      return toast.error("La contraseña debe tener al menos 8 caracteres")
    }

    if (fortaleza < 3) {
      return toast.error("La contraseña debe ser más fuerte")
    }

    setLoading(true)
    try {
      const res = await fetch("https://www.api.devcorebits.com/cuenta/reset-password", {
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

  const evaluarFortaleza = (password: string) => {
    let puntaje = 0
    if (password.length >= 8) puntaje++
    if (/[A-Z]/.test(password)) puntaje++
    if (/[a-z]/.test(password)) puntaje++
    if (/[0-9]/.test(password)) puntaje++
    if (/[^A-Za-z0-9]/.test(password)) puntaje++
    setFortaleza(puntaje)
    return puntaje
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
                type={mostrarNueva ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={nueva}
                onChange={(e) => {
                  setNueva(e.target.value)
                  evaluarFortaleza(e.target.value)
                }}
                className="pl-10 pr-12 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarNueva(!mostrarNueva)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {mostrarNueva ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-2">
              <div className="flex justify-between mb-1">
                <span className="text-xs text-gray-500">Fortaleza de la contraseña:</span>
                <span className="text-xs font-medium">
                  {fortaleza === 0 && "Muy débil"}
                  {fortaleza === 1 && "Débil"}
                  {fortaleza === 2 && "Moderada"}
                  {fortaleza === 3 && "Buena"}
                  {fortaleza === 4 && "Fuerte"}
                  {fortaleza === 5 && "Muy fuerte"}
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    fortaleza <= 1
                      ? "bg-red-500"
                      : fortaleza <= 2
                        ? "bg-orange-500"
                        : fortaleza <= 3
                          ? "bg-yellow-500"
                          : fortaleza <= 4
                            ? "bg-green-500"
                            : "bg-emerald-500"
                  }`}
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

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type={mostrarConfirmar ? "text" : "password"}
                placeholder="Confirmar nueva contraseña"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                className={`pl-10 pr-12 w-full border ${
                  confirmar && nueva !== confirmar
                    ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
                } rounded-lg px-3 py-3 focus:outline-none focus:ring-2 transition-all`}
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {mostrarConfirmar ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {confirmar && nueva !== confirmar && (
              <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading || !nueva || !confirmar || nueva !== confirmar || fortaleza < 3}
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
