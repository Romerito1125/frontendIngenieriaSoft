"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import Cookies from "js-cookie"
import { registerUsuario } from "./utils"
import { ArrowLeft, User, Mail, Lock, RefreshCw, UserPlus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [correo, setCorreo] = useState("")
  const [contrasenia, setContrasenia] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [correoRepetido, setCorreoRepetido] = useState(false)
  const [fortaleza, setFortaleza] = useState(0)

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

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

  const isValid =
    nombre.trim().length >= 2 &&
    apellido.trim().length >= 2 &&
    isValidEmail(correo) &&
    contrasenia.trim().length >= 8 &&
    fortaleza >= 3

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setCorreoRepetido(false)
    try {
      const { token } = await registerUsuario({
        nombre,
        apellido,
        correo,
        contrasenia,
      })

      Cookies.set("token", token, {
        expires: 1,
        sameSite: "strict",
      })

      toast.success("¡Registro exitoso!")
      window.location.href = "/"
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error al registrar"
      if (message.toLowerCase().includes("correo") && message.toLowerCase().includes("registrado")) {
        setCorreoRepetido(true)
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="hidden lg:block lg:w-1/2 bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Register background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Tuyo es tu aplicación</h2>
            <p className="text-xl text-blue-100 mb-8">Adéntrate en el transporte masivo de la mejor manera</p>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg mb-8">
              <p className="text-lg italic">
                "Simplifica tu experiencia de viaje con nuestra plataforma intuitiva y eficiente."
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <svg className="h-8 w-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                <div className="text-blue-200 text-sm">Rutas optimizadas</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                <svg className="h-8 w-8 text-white mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-blue-200 text-sm">Tiempo real</div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <h1 className="text-3xl font-bold text-blue-800">Crear Cuenta</h1>
            <p className="text-blue-600 mt-2">Completa el formulario para registrarte</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  {nombre && nombre.length < 2 && <p className="text-sm text-red-600">Mínimo 2 caracteres</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Apellido</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Apellido"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  {apellido && apellido.length < 2 && <p className="text-sm text-red-600">Mínimo 2 caracteres</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={correo}
                    onChange={(e) => {
                      setCorreo(e.target.value)
                      setCorreoRepetido(false)
                    }}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                {correo && !isValidEmail(correo) && <p className="text-sm text-red-600">Correo no válido</p>}
                {correoRepetido && <p className="text-sm text-red-600">Este correo ya está registrado</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    data-testid="contrasenia"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={contrasenia}
                    onChange={(e) => {
                      setContrasenia(e.target.value)
                      evaluarFortaleza(e.target.value)
                    }}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    minLength={8}
                  />
                  <button
                    data-testid = "ojito"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <li className={`flex items-center gap-1 ${/[A-Z]/.test(contrasenia) ? "text-green-600" : ""}`}>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(contrasenia) ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span>Mayúsculas</span>
                    </li>
                    <li className={`flex items-center gap-1 ${/[a-z]/.test(contrasenia) ? "text-green-600" : ""}`}>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(contrasenia) ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span>Minúsculas</span>
                    </li>
                    <li className={`flex items-center gap-1 ${/[0-9]/.test(contrasenia) ? "text-green-600" : ""}`}>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(contrasenia) ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span>Números</span>
                    </li>
                    <li
                      className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(contrasenia) ? "text-green-600" : ""}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(contrasenia) ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span>Símbolos</span>
                    </li>
                    <li className={`flex items-center gap-1 ${contrasenia.length >= 8 ? "text-green-600" : ""}`}>
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${contrasenia.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span>Mínimo 8 caracteres</span>
                    </li>
                  </ul>
                </div>
                {contrasenia && contrasenia.length < 8 && <p className="text-sm text-red-600">Mínimo 8 caracteres</p>}
              </div>

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`w-full flex items-center justify-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-all transform hover:scale-[1.02] ${
                  !isValid || loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Registrando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Crear cuenta
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                </div>
              </div>

              <div className="mt-4">
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 transition-all">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Google
                </button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              Al registrarte, aceptas nuestros{" "}
              <a href="#" className="text-blue-700 hover:underline">
                Términos y Condiciones
              </a>{" "}
              y{" "}
              <a href="#" className="text-blue-700 hover:underline">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
