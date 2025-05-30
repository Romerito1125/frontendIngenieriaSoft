"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import toast, { Toaster } from "react-hot-toast"
import { loginUsuario } from "./utils"
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supaClient"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter()
  const [correo, setCorreo] = useState("")
  const [contrasenia, setContrasenia] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      router.push("/")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (correo.trim() === "" && contrasenia.trim() === "") {
      toast.error("Completa todos los campos")
      return
    }
    if (!emailRegex.test(correo)) {
      toast.error("Ingresa un correo electrónico válido")
      return
    }
    if (contrasenia.trim() === "") {
      toast.error("La contraseña no puede estar vacía")
      return
    }
    if (contrasenia.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    try {
      const { token } = await loginUsuario({ correo, contrasenia })

      Cookies.set("token", token, {
        expires: 1,
        sameSite: "strict",
      })

      toast.success("Bienvenido 👋")
      window.location.href = "/"
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error de autenticación")
      } else {
        toast.error("Error desconocido")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLoginGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error("Error al iniciar con Google")
      console.error(error)
    } else {
      toast.success("Redirigiendo a Google...")
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Toaster position="top-center" />

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-800">Iniciar Sesión</h1>
            <p className="text-blue-600 mt-2">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type="text"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Contraseña</label>
                  <Link href="/auth/recuperar" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={contrasenia}
                    onChange={(e) => setContrasenia(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-500" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full flex items-center justify-center bg-blue-700 text-white py-3 px-4 rounded-lg hover:bg-blue-800 transition-all transform hover:scale-[1.02] ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  "Cargando..."
                ) : (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Ingresar
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">O continúa con</span>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleLoginGoogle}
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 px-4 text-gray-700 hover:bg-gray-50 transition-all"
                >
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
              ¿No tienes cuenta?{" "}
              <Link href="/auth/register" className="text-blue-700 font-medium hover:text-blue-800 hover:underline">
                Regístrate
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-900/90 z-10"></div>
        <div className="absolute inset-0 z-0"></div>
        <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 text-white">
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-6">Bienvenido de nuevo</h2>
            <p className="text-lg text-blue-100 mb-8">
              Accede a tu cuenta para gestionar tus proyectos y continuar con tu trabajo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
