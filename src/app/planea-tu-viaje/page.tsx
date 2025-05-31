"use client"

import { useEffect, useState, useRef } from "react"
import { MapPin, ChevronRight, Search, Loader2, MapPinned, Route, Bus } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  obtenerEstaciones,
  planearViaje,
  obtenerNombreEstacion,
  obtenerTipoRuta,
  getColorByType,
  getNombreZona,
  getZonaColor,
  agruparEstacionesPorZona,
  filtrarEstaciones,
  calcularTiempoEstimado,
  type Estacion,
  type RutaResultado,
  type RutaConTipo,
} from "./utils"

type AgrupadasPorZona = {
  [zona: string]: Estacion[]
}

export default function EstacionesPage() {
  const [estaciones, setEstaciones] = useState<Estacion[]>([])
  const [agrupadas, setAgrupadas] = useState<AgrupadasPorZona>({})
  const [origen, setOrigen] = useState<number | null>(null)
  const [destino, setDestino] = useState<number | null>(null)
  const [rutaResultado, setRutaResultado] = useState<RutaResultado | null>(null)
  const [rutasConTipo, setRutasConTipo] = useState<RutaConTipo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("todas")
  const resultadoRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const cargarEstaciones = async () => {
      try {
        setIsLoading(true)
        const data = await obtenerEstaciones()
        setEstaciones(data)
        const agrupado = agruparEstacionesPorZona(data)
        setAgrupadas(agrupado)
      } catch (error) {
        toast.error("Error al cargar las estaciones")
        console.error("Error al cargar estaciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    cargarEstaciones()
  }, [])

  const calcularRuta = async () => {
    if (!origen || !destino) {
      toast.error("Selecciona origen y destino")
      return
    }

    try {
      setIsCalculating(true)
      setRutaResultado(null)
      setRutasConTipo([])

      const data = await planearViaje({
        tipo: "viaje_normal",
        origen,
        destino,
      })

      let nombreEstacionTransbordo: string | undefined = undefined

      if (data.transbordo && data.estacionTransbordo) {
        nombreEstacionTransbordo = await obtenerNombreEstacion(data.estacionTransbordo)
      }

      const resultado: RutaResultado = {
        rutas: data.rutas,
        transbordo: data.transbordo,
        estacionTransbordo: data.estacionTransbordo,
        nombreEstacionTransbordo,
      }

      setRutaResultado(resultado)

      // Obtiene tipo de cada ruta
      const tipos = await Promise.all(
        data.rutas.map(async (idruta: string) => {
          const tipo = await obtenerTipoRuta(idruta)
          return {
            id: idruta,
            tipo,
          }
        }),
      )

      setRutasConTipo(tipos)

      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)

      toast.success("Ruta calculada con éxito")
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Error al conectarse con el servidor.")
      }
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSeleccion = (idestacion: number) => {
    // Si la estación ya está seleccionada como origen, la deseleccionamos
    if (origen === idestacion) {
      setOrigen(null)
      toast.success("Origen deseleccionado")
      return
    }

    // Si la estación ya está seleccionada como destino, la deseleccionamos
    if (destino === idestacion) {
      setDestino(null)
      toast.success("Destino deseleccionado")
      return
    }

    // Si no hay origen seleccionado, esta estación se convierte en origen
    if (origen === null) {
      setOrigen(idestacion)
      toast.success("Origen seleccionado")
      return
    }

    // Si hay origen pero no destino, esta estación se convierte en destino
    if (destino === null) {
      setDestino(idestacion)
      toast.success("Destino seleccionado")
      return
    }

    // Si ya hay origen y destino, reemplazamos el origen con esta nueva selección
    setOrigen(idestacion)
    setDestino(null)
    setRutaResultado(null)
    toast.success("Nueva selección iniciada")
  }

  const resetSeleccion = () => {
    setOrigen(null)
    setDestino(null)
    setRutaResultado(null)
    setRutasConTipo([])
    toast.success("Selección reiniciada")
  }

  const filteredEstaciones = filtrarEstaciones(estaciones, searchTerm)

  const getEstacionesForActiveTab = () => {
    if (activeTab === "todas") {
      return Object.entries(agrupadas)
    } else {
      return Object.entries(agrupadas).filter(([zona]) => zona === activeTab)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-6">
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "#e7f9e5",
              color: "#155724",
              border: "1px solid #28a745",
              borderLeft: "6px solid #28a745",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            icon: "🚍",
          },
          error: {
            style: {
              background: "#fcebea",
              color: "#721c24",
              border: "1px solid #dc3545",
              borderLeft: "6px solid #dc3545",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
            icon: "⚠️",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header con efecto de glassmorphism */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-blue-600 opacity-30 rounded-full blur"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-full shadow-lg">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mt-3">
                Planificador de Rutas
              </h1>
              <p className="text-blue-600 text-center opacity-80 max-w-2xl">
                Selecciona tu estación de origen y destino para calcular la mejor ruta disponible
              </p>
            </div>

            {/* Panel de selección */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-200 rounded-xl px-6 py-5 shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 px-2 py-1">
                      Origen
                    </Badge>
                    <span className="text-sm text-blue-600">Estación de partida</span>
                  </div>
                  <div className="bg-white rounded-lg border border-blue-200 p-3 h-16 flex items-center shadow-sm">
                    {origen ? (
                      <div className="flex items-center gap-2 w-full">
                        <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium text-gray-800 truncate">
                          {estaciones.find((e) => e.idestacion === origen)?.nombre}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No seleccionado</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 px-2 py-1">
                      Destino
                    </Badge>
                    <span className="text-sm text-green-600">Estación de llegada</span>
                  </div>
                  <div className="bg-white rounded-lg border border-green-200 p-3 h-16 flex items-center shadow-sm">
                    {destino ? (
                      <div className="flex items-center gap-2 w-full">
                        <MapPinned className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="font-medium text-gray-800 truncate">
                          {estaciones.find((e) => e.idestacion === destino)?.nombre}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No seleccionado</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 items-end justify-end">
                  <Button
                    variant="outline"
                    onClick={resetSeleccion}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    disabled={!origen && !destino}
                  >
                    Reiniciar
                  </Button>
                  <Button
                    onClick={calcularRuta}
                    disabled={!origen || !destino || isCalculating}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:from-blue-700 hover:to-blue-600 transition-all"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculando...
                      </>
                    ) : (
                      <>
                        <Route className="mr-2 h-4 w-4" />
                        Calcular ruta
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Buscador */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar estación por nombre o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
            </div>

            {/* Resultados de búsqueda */}
            {searchTerm && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  {filteredEstaciones.length} resultados encontrados
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto p-1">
                  <AnimatePresence>
                    {filteredEstaciones.map((estacion) => {
                      const isOrigen = estacion.idestacion === origen
                      const isDestino = estacion.idestacion === destino

                      return (
                        <motion.div
                          key={estacion.idestacion}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 overflow-hidden group relative ${
                              isOrigen
                                ? "ring-2 ring-blue-400 shadow-lg shadow-blue-100"
                                : isDestino
                                  ? "ring-2 ring-green-400 shadow-lg shadow-green-100"
                                  : "hover:ring-1 hover:ring-blue-200 hover:shadow-md"
                            }`}
                            onClick={() => handleSeleccion(estacion.idestacion)}
                          >
                            <div
                              className={`h-2 w-full ${
                                isOrigen
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                  : isDestino
                                    ? "bg-gradient-to-r from-green-500 to-green-600"
                                    : `bg-gradient-to-r ${getZonaColor(estacion.Zona)}`
                              }`}
                            ></div>

                            <CardContent className="p-3 relative">
                              {(isOrigen || isDestino) && (
                                <div
                                  className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                                    isOrigen ? "bg-blue-500" : "bg-green-500"
                                  }`}
                                >
                                  {isOrigen ? (
                                    <MapPin className="h-3 w-3 text-white" />
                                  ) : (
                                    <MapPinned className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              )}

                              <div className="flex flex-col space-y-1">
                                <h3
                                  className={`font-medium text-sm leading-tight ${
                                    isOrigen
                                      ? "text-blue-700"
                                      : isDestino
                                        ? "text-green-700"
                                        : "text-gray-800 group-hover:text-blue-700"
                                  }`}
                                >
                                  {estacion.nombre}
                                </h3>
                                <p className="text-xs text-gray-500">{estacion.ubicacion}</p>

                                <div className="flex items-center justify-between mt-2">
                                  <Badge
                                    className={`text-xs bg-gradient-to-r ${getZonaColor(estacion.Zona)} text-white`}
                                  >
                                    {getNombreZona(estacion.Zona).split(" - ")[0]}
                                  </Badge>

                                  {(isOrigen || isDestino) && (
                                    <Badge
                                      className={`text-xs ${
                                        isOrigen
                                          ? "bg-blue-100 text-blue-700 border-blue-300"
                                          : "bg-green-100 text-green-700 border-green-300"
                                      }`}
                                    >
                                      {isOrigen ? "Origen" : "Destino"}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Resultado de la ruta */}
        <AnimatePresence>
          {rutaResultado && rutasConTipo.length > 0 && (
            <motion.div
              ref={resultadoRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-green-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-green-600 to-green-500 p-2 rounded-full shadow-md">
                  <Route className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                  Ruta Recomendada
                </h2>
              </div>

              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {estaciones.find((e) => e.idestacion === origen)?.nombre}
                    </span>
                  </div>
                  <div className="flex-1 border-t-2 border-dashed border-gray-300 mx-2"></div>
                  <div className="flex items-center gap-1">
                    <MapPinned className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {estaciones.find((e) => e.idestacion === destino)?.nombre}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  {rutasConTipo.map((ruta, index) => (
                    <div key={index} className="flex items-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="flex items-center"
                      >
                        <div
                          className={`px-4 py-2 rounded-lg shadow-md text-white font-medium border ${getColorByType(
                            ruta.tipo,
                          )}`}
                          style={{ minWidth: "60px", textAlign: "center" }}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <Bus className="h-4 w-4" />
                            <span>{ruta.id}</span>
                          </div>
                        </div>

                        {/* Mostrar flecha y transbordo si hay más rutas */}
                        {rutaResultado.transbordo && index === 0 && (
                          <>
                            <div className="mx-1">
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="flex flex-col items-center text-sm text-gray-600">
                              <span>Transbordo en</span>
                              <span className="font-medium text-gray-700">
                                {rutaResultado.nombreEstacionTransbordo}
                              </span>
                            </div>
                            <div className="mx-1">
                              <ChevronRight className="w-5 h-5 text-gray-500" />
                            </div>
                          </>
                        )}

                        {!rutaResultado.transbordo && index < rutasConTipo.length - 1 && (
                          <div className="mx-1">
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">
                  <p>Tiempo estimado: {calcularTiempoEstimado(rutasConTipo.length)} minutos</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs para zonas */}
        <div className="mb-6">
          <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white border border-blue-100 p-1 rounded-lg shadow-sm overflow-x-auto flex w-full">
              <TabsTrigger
                value="todas"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 data-[state=active]:text-white rounded-md"
              >
                Todas las zonas
              </TabsTrigger>
              {Object.keys(agrupadas)
                .sort()
                .map((zona) => (
                  <TabsTrigger
                    key={zona}
                    value={zona}
                    className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${getZonaColor(
                      zona,
                    )} data-[state=active]:text-white rounded-md`}
                  >
                    {getNombreZona(zona).split(" - ")[0]}
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Estaciones por zona */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-ping"></div>
              <div className="relative flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full shadow-lg">
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              </div>
            </div>
            <p className="mt-6 text-lg font-medium text-blue-700">Cargando estaciones...</p>
            <p className="text-sm text-blue-500 animate-pulse">Esto puede tomar unos momentos</p>
          </div>
        ) : (
          <div className="space-y-8">
            {getEstacionesForActiveTab().map(([zona, estacionesZona]) => (
              <motion.div
                key={zona}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`bg-gradient-to-r ${getZonaColor(zona)} p-2 rounded-full shadow-md`}>
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2
                    className={`text-xl font-bold bg-gradient-to-r ${getZonaColor(zona)} bg-clip-text text-transparent`}
                  >
                    {getNombreZona(zona)}
                  </h2>
                  <Badge className="ml-auto bg-gray-100 text-gray-700 hover:bg-gray-200">
                    {estacionesZona.length} estaciones
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {estacionesZona.map((estacion, index) => {
                      const isOrigen = estacion.idestacion === origen
                      const isDestino = estacion.idestacion === destino

                      return (
                        <motion.div
                          key={estacion.idestacion}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all duration-300 overflow-hidden group relative ${
                              isOrigen
                                ? "ring-2 ring-blue-400 shadow-lg shadow-blue-100"
                                : isDestino
                                  ? "ring-2 ring-green-400 shadow-lg shadow-green-100"
                                  : "hover:ring-1 hover:ring-blue-200 hover:shadow-md"
                            }`}
                            onClick={() => handleSeleccion(estacion.idestacion)}
                          >
                            {/* Barra superior con gradiente */}
                            <div
                              className={`h-2 w-full relative overflow-hidden ${
                                isOrigen
                                  ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                  : isDestino
                                    ? "bg-gradient-to-r from-green-500 to-green-600"
                                    : `bg-gradient-to-r ${getZonaColor(zona)}`
                              }`}
                            >
                              {(isOrigen || isDestino) && (
                                <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                              )}
                            </div>

                            <CardContent className="p-4 relative">
                              {/* Icono de estado en la esquina superior derecha */}
                              {(isOrigen || isDestino) && (
                                <div
                                  className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                                    isOrigen ? "bg-blue-500" : "bg-green-500"
                                  }`}
                                >
                                  {isOrigen ? (
                                    <MapPin className="h-3 w-3 text-white" />
                                  ) : (
                                    <MapPinned className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              )}

                              <div className="flex flex-col space-y-2">
                                {/* Nombre de la estación */}
                                <h3
                                  className={`font-semibold text-lg leading-tight transition-colors ${
                                    isOrigen
                                      ? "text-blue-700"
                                      : isDestino
                                        ? "text-green-700"
                                        : "text-gray-800 group-hover:text-blue-700"
                                  }`}
                                >
                                  {estacion.nombre}
                                </h3>

                                {/* Ubicación */}
                                <p className="text-sm text-gray-500 leading-relaxed">{estacion.ubicacion}</p>

                                {/* Badge de estado */}
                                {(isOrigen || isDestino) && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                  >
                                    <Badge
                                      className={`w-fit ${
                                        isOrigen
                                          ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                                          : "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                                      }`}
                                    >
                                      <div className="flex items-center gap-1">
                                        {isOrigen ? (
                                          <>
                                            <MapPin className="h-3 w-3" />
                                            <span>Origen</span>
                                          </>
                                        ) : (
                                          <>
                                            <MapPinned className="h-3 w-3" />
                                            <span>Destino</span>
                                          </>
                                        )}
                                      </div>
                                    </Badge>
                                  </motion.div>
                                )}

                                {/* Indicador de zona */}
                                <div className="flex items-center gap-2 mt-2">
                                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getZonaColor(zona)}`}></div>
                                  <span className="text-xs text-gray-400 font-medium">{getNombreZona(zona)}</span>
                                </div>
                              </div>

                              {/* Efecto de hover */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                            </CardContent>

                            {/* Efecto de brillo en el borde */}
                            <div
                              className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                                isOrigen
                                  ? "shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]"
                                  : isDestino
                                    ? "shadow-[inset_0_0_0_1px_rgba(34,197,94,0.3)]"
                                    : "shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                              }`}
                            ></div>
                          </Card>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Decoración de fondo */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-100 opacity-30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-blue-200 opacity-20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
    </div>
  )
}
