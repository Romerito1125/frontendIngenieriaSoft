"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"
import { motion } from "framer-motion"

type TokenPayload = {
  userId: number
  correo: string
}

type CuentaData = {
  nombre: string
  apellido: string
  correo: string
}

export default function UserMenu() {
  const [user, setUser] = useState<CuentaData | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar si estamos en la página de login o registro
  const isAuthPage = pathname?.includes("/auth/login") || pathname?.includes("/auth/register")

  useEffect(() => {
    const token = Cookies.get("token")
    if (!token) return

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      fetch(`https://www.cuentas.devcorebits.com/cuenta/getCuenta/${decoded.userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
    } catch {
      setUser(null)
    }
  }, [])

  const handleLogout = () => {
    Cookies.remove("token")
    setUser(null)
    router.push("/")
  }

  // No mostrar los botones de login/registro si ya estamos en una página de autenticación
  if (isAuthPage) {
    return null
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/auth/login"
          className="relative overflow-hidden text-blue-700 hover:text-blue-900 transition-colors duration-300 text-base font-medium px-4 py-2 rounded-full group"
        >
          <span className="relative z-10">Iniciar sesión</span>
          <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left rounded-full"></span>
        </Link>

        <Link
          href="/auth/register"
          className="relative overflow-hidden bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300 text-base font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg"
        >
          Registrarse
        </Link>
      </div>
    )
  }

  const letra = user.nombre?.charAt(0)?.toUpperCase() || "U"
  const apellidoLetra = user.apellido?.charAt(0)?.toUpperCase() || ""

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center font-bold cursor-pointer shadow-md"
      >
        {letra}
        {apellidoLetra}
      </motion.div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">
              {user.nombre} {user.apellido}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.correo}</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => router.push("/cuenta")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 transition-colors"
            >
              Mi cuenta
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
