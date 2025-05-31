"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Wrench,
  Clock,
  XCircle,
  Info,
  Bell,
  Loader2,
  MapPin,
  Route,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  obtenerAlertaEspecifica,
  formatearFechaHora,
  obtenerEstilosPrioridad,
  validarAlerta,
  formatearPrioridad,
  type Alerta,
} from "../../utils"

const iconMap = {
  AlertTriangle,
  Wrench,
  Clock,
  XCircle,
  Info,
  Bell,
}

export default function AlertaDetalle() {
  const { idAlerta } = useParams()
  const [alerta, setAlerta] = useState<Alerta | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerta = async () => {
      if (!idAlerta || typeof idAlerta !== "string") {
        setError("ID de alerta no válido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await obtenerAlertaEspecifica(idAlerta)
        setAlerta(data)
      } catch (err: unknown) {
        console.error("Error cargando la alerta:", err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("Error desconocido al cargar la alerta")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAlerta()
  }, [idAlerta])

  const getIcon = (tipo: string) => {
    // Mapeo simple de tipos a iconos
    const iconName = tipo.toLowerCase().includes("emergencia")
      ? "AlertTriangle"
      : tipo.toLowerCase().includes("mantenimiento")
        ? "Wrench"
        : tipo.toLowerCase().includes("retraso")
          ? "Clock"
          : tipo.toLowerCase().includes("cancelacion")
            ? "XCircle"
            : tipo.toLowerCase().includes("informacion")
              ? "Info"
              : "Bell"

    const IconComponent = iconMap[iconName as keyof typeof iconMap] || Bell
    return <IconComponent className="h-6 w-6" />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48" data-testid="loading-state">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-red-100 rounded-full opacity-30 animate-ping"></div>
          <div className="relative flex items-center justify-center w-20 h-20 bg-red-600 rounded-full shadow-lg">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-6"
        data-testid="error-state"
      >
        <Alert variant="destructive" className="border-l-4 border-l-red-600 shadow-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Error al cargar la alerta</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
        </Alert>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-300 transform hover:scale-105 rounded-lg"
            data-testid="retry-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Intentar nuevamente
          </Button>
        </div>
      </motion.div>
    )
  }

  if (!alerta || !validarAlerta(alerta)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto p-6"
        data-testid="not-found-state"
      >
        <Alert className="border-l-4 border-l-yellow-600 shadow-md bg-yellow-50">
          <Info className="h-5 w-5 text-yellow-600" />
          <AlertTitle className="text-lg font-semibold text-yellow-800">Alerta no encontrada</AlertTitle>
          <AlertDescription className="mt-2 text-yellow-700">
            No se encontró la alerta solicitada o los datos están incompletos.
          </AlertDescription>
        </Alert>

        <div className="flex justify-center mt-6">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 rounded-lg"
            data-testid="back-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>
      </motion.div>
    )
  }

  const estilosPrioridad = obtenerEstilosPrioridad(alerta.prioridad)

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6 space-y-6"
      data-testid="alerta-detalle-container"
    >
      {/* Header con botón de volver */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => window.history.back()}
          variant="outline"
          size="sm"
          className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
          data-testid="back-button-header"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        <Badge
          className={`${estilosPrioridad.badge} text-white px-3 py-1 rounded-full border`}
          data-testid="badge-prioridad"
        >
          Prioridad: {formatearPrioridad(alerta.prioridad)}
        </Badge>
      </div>

      {/* Card principal */}
      <Card className="overflow-hidden border border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-lg">{getIcon(alerta.tipo)}</div>
              <div>
                <CardTitle className="text-2xl text-red-700 flex items-center" data-testid="alerta-tipo">
                  {alerta.tipo}
                </CardTitle>
                <div className="text-sm text-gray-500 flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span data-testid="alerta-fecha">{formatearFechaHora(alerta.hora)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Mensaje principal */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
            <p
              className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed"
              data-testid="alerta-mensaje"
            >
              {alerta.mensaje}
            </p>
          </div>

          {/* Información de ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Route className="h-5 w-5 mr-2 text-blue-500" />
                <span className="font-medium">Ruta</span>
              </div>
              <p className="text-gray-800 bg-blue-50 p-3 rounded-lg border border-blue-100" data-testid="alerta-ruta">
                {alerta.idruta}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                <span className="font-medium">Estación</span>
              </div>
              <p
                className="text-gray-800 bg-purple-50 p-3 rounded-lg border border-purple-100"
                data-testid="alerta-estacion"
              >
                {alerta.idestacion}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.main>
  )
}
