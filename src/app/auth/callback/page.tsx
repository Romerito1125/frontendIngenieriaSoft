"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supaClient"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import toast from "react-hot-toast"
import { jwtDecode } from "jwt-decode"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: sessionData, error } = await supabase.auth.getSession()

      if (error || !sessionData?.session?.access_token) {
        toast.error("Error al obtener la sesión")
        router.push("/auth/login")
        return
      }

      const accessToken = sessionData.session.access_token

      const decoded = jwtDecode(accessToken)

      console.log("Token de Google / Supabase decodificado:", decoded)

      Cookies.set("token", accessToken, {
        expires: 1,
        sameSite: "strict"
      })

      toast.success("Bienvenido con Google 👋")
      router.push("/")
    }

    getSession()
  }, [router])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-blue-600">Procesando autenticación...</p>
    </div>
  )
}
