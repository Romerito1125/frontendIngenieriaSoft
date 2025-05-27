"use client"

import { useState, useEffect } from "react"
import { obtenerForosUsuario } from "./api-service"
import { getCurrentUser, isAuthenticated } from "./auth-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageSquare, Calendar, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

type Foro = {
  idforo: string
  idcuenta: string | number
  titulo: string
  descripcion: string
  fecha: string
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
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)

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

        const forosUsuario = await obtenerForosUsuario(usuario.idcuenta)
        setForos(forosUsuario || [])
      } catch (err) {
        console.error("Error al cargar historial:", err)
        setError("No se pudo cargar tu historial de foros")
      } finally {
        setIsLoading(false)
      }
    }

    cargarHistorial()
  }, [])

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const obtenerCantidadRespuestas = (foro: Foro) => {
    return foro.respuestas_foro?.length || 0
  }

  if (!isAuthenticated()) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Acceso restringido</h3>
          <p className="text-gray-500 mb-6">Debes iniciar sesión para ver tu historial de foros</p>
          <Link href="/auth/login">
            <Button>Iniciar sesión</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={`container mx-auto px-4 py-8 ${className}`}>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
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
            <div className="flex items-center gap-4 mb-4">
              <Link href="/foro">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a foros
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Mi Historial de Foros</h1>
            <p className="text-blue-100">{currentUser ? `Bienvenido ${currentUser.nombre}` : "Cargando..."}</p>
          </div>
          <div className="text-white text-right">
            <div className="text-2xl font-bold">{foros.length}</div>
            <div className="text-blue-100 text-sm">Foros creados</div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Foros</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foros.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Respuestas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foros.reduce((total, foro) => total + obtenerCantidadRespuestas(foro), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio de Respuestas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {foros.length > 0
                ? Math.round(
                    (foros.reduce((total, foro) => total + obtenerCantidadRespuestas(foro), 0) / foros.length) * 10,
                  ) / 10
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de foros */}
      {foros.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No has creado foros aún</h3>
          <p className="text-gray-500 mb-6">¡Crea tu primer foro y comienza a participar en la comunidad!</p>
          <Link href="/foro">
            <Button>Crear mi primer foro</Button>
          </Link>
        </div>
      ) : (
        <motion.div className="grid gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {foros.map((foro, index) => (
            <motion.div
              key={foro.idforo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2 line-clamp-2">{foro.titulo}</CardTitle>
                      <CardDescription className="line-clamp-3 mb-4">{foro.descripcion}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-4">
                      {obtenerCantidadRespuestas(foro)} respuestas
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      Creado el {formatearFecha(foro.fecha)}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/foro/${foro.idforo}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver foro
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
