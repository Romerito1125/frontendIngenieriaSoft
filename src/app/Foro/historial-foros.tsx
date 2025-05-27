"use client"

import { useState, useEffect } from "react"
import { obtenerForosUsuarioConRespuestas } from "./api-service"
import { getCurrentUser, isAuthenticated } from "./auth-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MessageSquare,
  Calendar,
  Eye,
  ArrowLeft,
  Search,
  User,
  BookOpen,
  Users,
  Sparkles,
  PlusCircle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

type Foro = {
  idforo: string
  idcuenta: string | number
  titulo: string
  descripcion: string
  fecha: string
  cantidadRespuestas?: number
  cuentas?: { nombre: string }
  respuestas_foro?: { idrespuesta: string }[]
}

type Usuario = {
  idcuenta: string
  email: string
  nombre: string
}

interface HistorialForosProps {
  className?: string
}

export default function HistorialForos({ className }: HistorialForosProps) {
  const [foros, setForos] = useState<Foro[]>([])
  const [filteredForos, setFilteredForos] = useState<Foro[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        if (!isAuthenticated()) {
          setError("Debes iniciar sesión para ver tu historial")
          setIsLoading(false)
          return
        }

        const usuario = getCurrentUser()
        if (!usuario) {
          setError("No se pudo obtener la información del usuario")
          setIsLoading(false)
          return
        }

        setCurrentUser(usuario as Usuario)
        setIsLoading(true)

        // Usar la nueva función que incluye cantidad de respuestas
        const forosUsuario = await obtenerForosUsuarioConRespuestas(usuario.idcuenta)
        console.log("✅ Datos del historial CON respuestas:", forosUsuario)

        setForos(forosUsuario || [])
        setFilteredForos(forosUsuario || [])
      } catch (err) {
        console.error("Error al cargar historial:", err)
        setError("No se pudo cargar tu historial de foros")
      } finally {
        setIsLoading(false)
      }
    }

    cargarHistorial()
  }, [])

  // Efecto para filtrar foros basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredForos(foros)
    } else {
      const filtered = foros.filter(
        (foro) =>
          foro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          foro.descripcion.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredForos(filtered)
    }
  }, [searchTerm, foros])

  const formatearFecha = (fecha: string) => {
    try {
      const fechaCreacion = new Date(fecha)
      if (!isNaN(fechaCreacion.getTime())) {
        return formatDistanceToNow(fechaCreacion, {
          addSuffix: true,
          locale: es,
        })
      }
    } catch (e) {
      console.error("Fecha inválida:", fecha)
    }
    return "Fecha inválida"
  }

  const obtenerCantidadRespuestas = (foro: Foro) => {
    // Primero intentar con cantidadRespuestas (viene del API mejorado)
    if (typeof foro.cantidadRespuestas === "number") {
      return foro.cantidadRespuestas
    }

    // Luego intentar con respuestas_foro (para datos completos)
    if (foro.respuestas_foro && Array.isArray(foro.respuestas_foro)) {
      return foro.respuestas_foro.length
    }

    // Fallback a 0
    return 0
  }

  if (!isAuthenticated()) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Acceso restringido</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Inicia sesión para ver tu historial personal de foros y participar en las conversaciones
            </p>
            <Link href="/auth/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <User className="mr-2 h-5 w-5" />
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tu historial...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2">Mi Historial de Foros</h1>
            <p className="text-blue-100">{currentUser ? `Bienvenido, aquí encontrarás todos tus foros` : "Cargando..."}</p>
          </div>
          <div className="text-white text-right">
            <div className="text-2xl font-bold">{foros.length}</div>
            <div className="text-blue-100 text-sm">Foros creados</div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-t-4 border-t-green-600 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-green-700">Total Respuestas</CardTitle>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {foros.reduce((total, foro) => total + obtenerCantidadRespuestas(foro), 0)}
            </div>
            <p className="text-sm text-green-600 mt-1">respuestas recibidas</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-purple-600 bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-purple-700">Promedio</CardTitle>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {foros.length > 0
                ? Math.round(
                    (foros.reduce((total, foro) => total + obtenerCantidadRespuestas(foro), 0) / foros.length) * 10,
                  ) / 10
                : 0}
            </div>
            <p className="text-sm text-purple-600 mt-1">respuestas por foro</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Buscar en mis foros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center text-sm">
          <div className="flex items-center text-gray-500">
            <MessageSquare className="h-5 w-5 mr-1" />
            <span>{searchTerm ? `${filteredForos.length} de ${foros.length}` : `${foros.length}`} foros</span>
          </div>
        </div>
      </div>

      {/* Lista de foros */}
      {foros.length === 0 ? (
        <div className="text-center py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="max-w-lg mx-auto">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <PlusCircle className="h-4 w-4 text-yellow-800" />
              </div>
            </div>

            <h3 className="text-3xl font-bold text-gray-800 mb-4">¡Comienza tu primera discusión!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Aún no has creado ningún foro. Comparte tus ideas, haz preguntas y conecta con la comunidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Comparte conocimiento</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Conecta con otros</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-blue-200">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-700 font-medium">Inicia conversaciones</p>
              </div>
            </div>

            <Link href="/foro">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Crear mi primer foro
              </Button>
            </Link>
          </div>
        </div>
      ) : filteredForos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No se encontraron resultados</h3>
          <p className="text-gray-500 mb-6">No hay foros que coincidan con tu búsqueda "{searchTerm}"</p>
          <Button variant="outline" onClick={() => setSearchTerm("")}>
            Limpiar búsqueda
          </Button>
        </div>
      ) : (
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredForos.map((foro, index) => (
            <motion.div
              key={foro.idforo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 border-t-blue-600 h-full flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-blue-700 line-clamp-2">
                    <Link href={`/Foro/${foro.idforo}`} className="hover:underline">
                      {foro.titulo}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-3 mb-4 text-gray-600">{foro.descripcion}</CardDescription>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Creado {formatearFecha(foro.fecha)}</span>
                  </div>
                </CardContent>

                <div className="border-t bg-gray-50 p-4 mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center text-sm font-medium ${
                          obtenerCantidadRespuestas(foro) > 0 ? "text-blue-600" : "text-gray-500"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>
                          {obtenerCantidadRespuestas(foro)}{" "}
                          {obtenerCantidadRespuestas(foro) === 1 ? "respuesta" : "respuestas"}
                        </span>
                      </div>
                    </div>

                    <Link href={`/Foro/${foro.idforo}`}>
                      <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver discusión
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
