"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { jwtDecode } from "jwt-decode"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HistorialDenuncias } from "./historial-denuncias/historial-denuncias"
import { CrearDenuncia } from "./crear-denuncia/crear-denuncia"
import { AdminDenuncias } from "./admin-denuncias/admin-denuncias"
import { useIsAdmin } from "../hooks/isAdmin"
import { AlertCircle, FileText, PlusCircle, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type TokenPayload = {
  userId: number
  correo: string
}

export default function Denuncias() {
  const router = useRouter()
  const [userId, setUserId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("crear")
  const isAdmin = useIsAdmin()

  useEffect(() => {
    const token = Cookies.get("token")

    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      setUserId(decoded.userId)
      setIsLoading(false)
    } catch (error) {
      console.error("Error al decodificar token:", error)
      setIsLoading(false)
    }
  }, [])

  // Función para cambiar entre pestañas
  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Mostrar pantalla de carga mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Si no está autenticado, mostrar mensaje
  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6 flex flex-col items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso restringido</AlertTitle>
          <AlertDescription>Debes iniciar sesión para acceder al sistema de denuncias.</AlertDescription>
        </Alert>
        <Button
          className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white"
          onClick={() => router.push("/auth/login")}
        >
          Iniciar sesión
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con efecto de glassmorphism */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
            <h1 className="text-4xl font-bold mb-2 text-center text-blue-600">Sistema de Denuncias</h1>
            <p className="text-blue-600 text-center opacity-80 mb-4">
              Ayúdanos a mejorar reportando incidentes o problemas
            </p>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-4xl mx-auto">
              <TabsList className={`grid w-full ${isAdmin ? "grid-cols-3" : "grid-cols-2"} bg-blue-50 rounded-xl p-1`}>
                <TabsTrigger
                  value="crear"
                  className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Crear Denuncia
                </TabsTrigger>
                <TabsTrigger
                  value="historial"
                  className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Mi Historial
                </TabsTrigger>
                {isAdmin && (
                  <TabsTrigger
                    value="admin"
                    className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Administración
                  </TabsTrigger>
                )}
              </TabsList>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100 mt-4">
                <TabsContent value="crear" className="mt-0">
                  <CrearDenuncia userId={userId} />
                </TabsContent>
                <TabsContent value="historial" className="mt-0">
                  <HistorialDenuncias userId={userId} onCreateClick={() => handleTabChange("crear")} />
                </TabsContent>
                {isAdmin && (
                  <TabsContent value="admin" className="mt-0">
                    <AdminDenuncias userId={userId} />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </div>
        </div>

        {/* Decoración de fondo */}
        <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-100 opacity-30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="fixed bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-blue-200 opacity-20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
      </div>
    </div>
  )
}
