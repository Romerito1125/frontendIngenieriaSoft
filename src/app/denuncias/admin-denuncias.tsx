"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertCircle,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Tag,
  User,
  Search,
  RefreshCw,
  Building,
  Send,
  Shield,
  CheckCircle,
  Filter,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Denuncia {
  iddenuncia: number
  idcuenta: number
  mensaje: string
  fecha: string
  estado: string
  tipo: string
  respuesta: string | null
}

interface AdminDenunciasProps {
  userId: number
}

export function AdminDenuncias({ userId }: AdminDenunciasProps) {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filterStatus, setFilterStatus] = useState("todas")
  const [filterType, setFilterType] = useState("todos")
  const [respondingTo, setRespondingTo] = useState<number | null>(null)
  const [responses, setResponses] = useState<{ [key: number]: string }>({})
  const [submittingResponse, setSubmittingResponse] = useState<number | null>(null)

  const API_BASE_URL = "https://serviciodenuncias.onrender.com/denuncias"

  const fetchAllDenuncias = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const apiUrl = `${API_BASE_URL}/listarTodas`
      console.log("Obteniendo todas las denuncias para administrador")

      const response = await axios.get(apiUrl)
      setDenuncias(response.data || [])
    } catch (err: any) {
      console.error("Error al obtener denuncias:", err)

      if (err.response) {
        setError(`Error del servidor: ${err.response.status}. Por favor, intenta nuevamente más tarde.`)
      } else if (err.request) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
      } else {
        setError(`Error: ${err.message}`)
      }

      toast.error("Error al cargar denuncias")
      setDenuncias([])
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDenuncias = async () => {
    setIsRefreshing(true)
    await fetchAllDenuncias()
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Denuncias actualizadas")
    }, 800)
  }

  const handleResponseSubmit = async (iddenuncia: number, idcuenta: number) => {
    const respuesta = responses[iddenuncia]

    if (!respuesta || !respuesta.trim()) {
      toast.error("Por favor, escribe una respuesta")
      return
    }

    try {
      setSubmittingResponse(iddenuncia)

      const apiUrl = `${API_BASE_URL}/contestar/${iddenuncia}/${idcuenta}`
      console.log(`Respondiendo denuncia ID: ${iddenuncia} para cuenta: ${idcuenta}`)

      await axios.patch(apiUrl, {
        respuesta: respuesta.trim(),
      })

      // Actualizar la denuncia en el estado local
      setDenuncias((prev) =>
        prev.map((denuncia) =>
          denuncia.iddenuncia === iddenuncia
            ? { ...denuncia, respuesta: respuesta.trim(), estado: "procesada" }
            : denuncia,
        ),
      )

      // Limpiar el campo de respuesta
      setResponses((prev) => ({ ...prev, [iddenuncia]: "" }))
      setRespondingTo(null)

      toast.success("Respuesta enviada correctamente")
    } catch (err: any) {
      console.error("Error al enviar respuesta:", err)
      toast.error("No se pudo enviar la respuesta. Por favor, intenta nuevamente.")
    } finally {
      setSubmittingResponse(null)
    }
  }

  useEffect(() => {
    fetchAllDenuncias()
  }, [])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "procesada":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "cerrada":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type.toLowerCase()) {
      case "conductor":
        return "Conductor"
      case "estacion":
        return "Estación"
      case "servicio":
        return "Servicio"
      default:
        return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "conductor":
        return <User className="h-4 w-4 mr-2 text-blue-500" />
      case "estacion":
        return <Building className="h-4 w-4 mr-2 text-purple-500" />
      case "servicio":
        return <MessageSquare className="h-4 w-4 mr-2 text-green-500" />
      default:
        return <Tag className="h-4 w-4 mr-2 text-blue-500" />
    }
  }

  const filteredDenuncias = denuncias.filter((denuncia) => {
    const matchesSearch =
      denuncia.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.iddenuncia.toString().includes(searchTerm) ||
      denuncia.idcuenta.toString().includes(searchTerm)

    const matchesStatus = filterStatus === "todas" || denuncia.estado.toLowerCase() === filterStatus
    const matchesType = filterType === "todos" || denuncia.tipo.toLowerCase() === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-ping"></div>
          <div className="relative flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full shadow-lg">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-blue-700">Cargando todas las denuncias...</p>
        <p className="text-sm text-blue-500 animate-pulse">Esto puede tomar unos momentos</p>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <Alert variant="destructive" className="my-6 border-l-4 border-l-red-600 shadow-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Error al cargar denuncias</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button
            onClick={() => fetchAllDenuncias()}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 transform hover:scale-105 rounded-lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar nuevamente
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "white",
            color: "#333",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            padding: "16px",
          },
          success: {
            style: {
              border: "1px solid #10B981",
              borderLeft: "6px solid #10B981",
            },
          },
          error: {
            style: {
              border: "1px solid #EF4444",
              borderLeft: "6px solid #EF4444",
            },
          },
        }}
      />

      {/* Header con acciones */}
      <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-600">Panel de Administración</h2>
              <p className="text-gray-500 text-sm">Gestión de todas las denuncias del sistema</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={refreshDenuncias}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-700">{denuncias.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {denuncias.filter((d) => d.estado.toLowerCase() === "pendiente").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Procesadas</p>
                <p className="text-2xl font-bold text-blue-700">
                  {denuncias.filter((d) => d.estado.toLowerCase() === "procesada").length}
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Cerradas</p>
                <p className="text-2xl font-bold text-green-700">
                  {denuncias.filter((d) => d.estado.toLowerCase() === "cerrada").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, mensaje, tipo o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="border-gray-200 focus:ring-blue-500">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="procesada">Procesada</SelectItem>
              <SelectItem value="cerrada">Cerrada</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-gray-200 focus:ring-blue-500">
              <Tag className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="servicio">Servicio</SelectItem>
              <SelectItem value="conductor">Conductor</SelectItem>
              <SelectItem value="estacion">Estación</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contador de resultados */}
      {(searchTerm || filterStatus !== "todas" || filterType !== "todos") && (
        <div className="mb-4 text-sm text-gray-500">
          Se encontraron {filteredDenuncias.length} resultados
          {searchTerm && ` para "${searchTerm}"`}
        </div>
      )}

      {/* Lista de denuncias */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDenuncias.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No se encontraron denuncias</h3>
            <p className="mt-2 text-gray-500">
              {searchTerm || filterStatus !== "todas" || filterType !== "todos"
                ? "No hay denuncias que coincidan con los filtros aplicados"
                : "No hay denuncias en el sistema"}
            </p>
          </div>
        ) : (
          filteredDenuncias.map((denuncia, index) => (
            <motion.div
              key={denuncia.iddenuncia}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border border-gray-200 hover:border-blue-200 transition-all duration-300 hover:shadow-lg group rounded-xl">
                <CardHeader className="bg-blue-50 pb-3 flex flex-row items-center justify-between">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-700 flex items-center">
                        Denuncia #{denuncia.iddenuncia}
                        <span className="ml-2 text-sm text-gray-500 font-normal">(Usuario: {denuncia.idcuenta})</span>
                      </CardTitle>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(denuncia.fecha)}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(denuncia.estado)} shadow-sm px-3 py-1 rounded-full`}>
                    {denuncia.estado.charAt(0).toUpperCase() + denuncia.estado.slice(1)}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-5">
                  <div className="mb-4 flex items-center p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
                    {getTypeIcon(denuncia.tipo)}
                    <span className="text-sm font-medium text-gray-700">Tipo: {getTypeLabel(denuncia.tipo)}</span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <MessageSquare className="h-4 w-4 mr-2 text-blue-500 mt-1" />
                      <span className="text-sm font-medium text-gray-700">Mensaje:</span>
                    </div>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 group-hover:border-gray-200 transition-all duration-300">
                      {denuncia.mensaje}
                    </p>
                  </div>

                  {denuncia.respuesta && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-4"
                    >
                      <div className="flex items-start mb-2">
                        <User className="h-4 w-4 mr-2 text-green-500 mt-1" />
                        <span className="text-sm font-medium text-gray-700">Respuesta del administrador:</span>
                      </div>
                      <p className="text-gray-600 bg-green-50 p-4 rounded-lg border border-green-100 group-hover:border-green-200 transition-all duration-300">
                        {denuncia.respuesta}
                      </p>
                    </motion.div>
                  )}

                  {/* Formulario de respuesta */}
                  {!denuncia.respuesta && (
                    <div className="mt-4">
                      {respondingTo === denuncia.iddenuncia ? (
                        <div className="space-y-3">
                          <Label
                            htmlFor={`respuesta-${denuncia.iddenuncia}`}
                            className="text-sm font-medium text-gray-700"
                          >
                            Respuesta del administrador:
                          </Label>
                          <Textarea
                            id={`respuesta-${denuncia.iddenuncia}`}
                            placeholder="Escribe tu respuesta a esta denuncia..."
                            value={responses[denuncia.iddenuncia] || ""}
                            onChange={(e) =>
                              setResponses((prev) => ({ ...prev, [denuncia.iddenuncia]: e.target.value }))
                            }
                            className="min-h-[100px] border-gray-200 focus-visible:border-blue-400 focus-visible:ring-blue-400 transition-all duration-300 resize-y rounded-lg"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleResponseSubmit(denuncia.iddenuncia, denuncia.idcuenta)}
                              disabled={
                                submittingResponse === denuncia.iddenuncia || !responses[denuncia.iddenuncia]?.trim()
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                              size="sm"
                            >
                              {submittingResponse === denuncia.iddenuncia ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Enviando...
                                </>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-2" />
                                  Enviar respuesta
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => {
                                setRespondingTo(null)
                                setResponses((prev) => ({ ...prev, [denuncia.iddenuncia]: "" }))
                              }}
                              variant="outline"
                              size="sm"
                              className="rounded-lg"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setRespondingTo(denuncia.iddenuncia)}
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Responder denuncia
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
