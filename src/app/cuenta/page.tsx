"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import SeccionCuenta from "./SeccionCuenta"
import SeccionPassword from "./SeccionPassword"
import SeccionPrivacidad from "./SeccionPrivacidad"
import { motion } from "framer-motion"

// Icons
import { UserCircle, KeyRound, ShieldAlert, LogOut, ChevronRight, Settings } from "lucide-react"

// Tipado de la cuenta
interface Cuenta {
  nombre: string
  apellido: string
}

export default function CuentaPage() {
  const [seccion, setSeccion] = useState("cuenta")
  const [correo, setCorreo] = useState<string>("")
  const [userId, setUserId] = useState<number | null>(null)
  const [cuenta, setCuenta] = useState<Cuenta | null>(null)
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    try {
      const decoded = jwtDecode<{ userId: number; correo: string }>(token)
      setCorreo(decoded.correo)
      setUserId(decoded.userId)
    } catch {
      toast.error("Token inválido")
      router.push("/auth/login")
    }
  }, [router])

  useEffect(() => {
    if (!userId) return

    fetch(`https://www.api.devcorebits.com/cuentasGateway/cuenta/getCuenta/${userId}`)
      .then((res) => res.json())
      .then((data: Cuenta) => {
        if (data.nombre) {
          setCuenta(data)
        } else {
          toast.error("Error cargando cuenta")
        }
      })
      .catch(() => toast.error("Error cargando cuenta"))
      .finally(() => setCargando(false))
  }, [userId])

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-medium">Cargando</div>
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: "cuenta", label: "Mi Cuenta", icon: <UserCircle className="w-5 h-5" /> },
    { id: "password", label: "Cambiar Contraseña", icon: <KeyRound className="w-5 h-5" /> },
    { id: "privacidad", label: "Privacidad", icon: <ShieldAlert className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#10B981",
            },
          },
          error: {
            style: {
              background: "#EF4444",
            },
          },
        }}
      />
      <div className="container mx-auto py-8 px-4 md:px-0">
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-80 bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/50">
                    {cuenta?.nombre?.[0]?.toUpperCase() || "?"}
                    {cuenta?.apellido?.[0]?.toUpperCase() || ""}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="font-bold text-lg">
                    {cuenta?.nombre} {cuenta?.apellido}
                  </h2>
                  <p className="text-sm text-blue-100 truncate max-w-[180px]">{correo}</p>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <div className="text-xs uppercase text-gray-500 font-semibold mb-2 px-2">Configuración</div>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <motion.li
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSeccion(item.id)}
                    className={`rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                      seccion === item.id ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {seccion === item.id && <ChevronRight className="w-4 h-4 text-blue-600" />}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    Cookies.remove("token")
                    router.push("/auth/login")
                  }}
                  className="w-full rounded-xl px-3 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </motion.button>
              </div>
            </nav>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <Settings className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">
                  {seccion === "cuenta" && "Mi Cuenta"}
                  {seccion === "password" && "Cambiar Contraseña"}
                  {seccion === "privacidad" && "Privacidad y Seguridad"}
                </h1>
              </div>

              {seccion === "cuenta" && userId !== null && <SeccionCuenta correo={correo} id={userId} />}
              {seccion === "password" && <SeccionPassword correo={correo} />}
              {seccion === "privacidad" && <SeccionPrivacidad correo={correo} />}
            </div>
          </motion.main>
        </div>
      </div>
    </div>
  )
}
