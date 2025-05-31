"use client"

import { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertCircle,
  Clock,
  FileText,
  Loader2,
  MessageSquare,
  Tag,
  Trash2,
  User,
  Search,
  RefreshCw,
  Building,
  PlusCircle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import {
  obtenerDenunciasUsuario,
  eliminarDenuncia,
  formatearFecha,
  obtenerColorEstado,
  obtenerEtiquetaTipo,
  filtrarDenuncias,
  type Denuncia,
} from "./utils"

interface HistorialDenunciasProps {
  userId: number
  onCreateClick: () => void
}

export function HistorialDenuncias({ userId, onCreateClick }: HistorialDenunciasProps) {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchDenuncias = async () => {
    if (!userId) return

    try {
      setIsLoading(true)
      setError(null)

      const data = await obtenerDenunciasUsuario(userId)
      setDenuncias(data)
    } catch (err: unknown) {
      console.error("Error al obtener denuncias:", err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Error desconocido al cargar las denuncias")
      }

      toast.error("Error al cargar denuncias")
      setDenuncias([])
    } finally {
      setIsLoading(false)
    }
  }

  const refreshDenuncias = async () => {
    setIsRefreshing(true)
    await fetchDenuncias()
    setTimeout(() => {
      setIsRefreshing(false)
      toast.success("Denuncias actualizadas")
    }, 800)
  }

  useEffect(() => {
    fetchDenuncias()
  }, [userId])

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      await eliminarDenuncia(id)

      // Actualizar la lista de denuncias
      setDenuncias((prev) => prev.filter((denuncia) => denuncia.iddenuncia !== id))
      toast.success("La denuncia ha sido eliminada correctamente")
    } catch (err: unknown) {
      console.error("Error al eliminar denuncia:", err)
      if (err instanceof Error) {
        toast.error(err.message)
      } else {
        toast.error("Error desconocido al eliminar la denuncia")
      }
    } finally {
      setDeletingId(null)
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

  const filteredDenuncias = filtrarDenuncias(denuncias, searchTerm)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12" data-testid="loading-state">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-blue-100 rounded-full opacity-30 animate-ping"></div>
          <div className="relative flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full shadow-lg">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>
        <p className="mt-6 text-lg font-medium text-blue-700">Cargando tus denuncias...</p>
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
        data-testid="error-state"
      >
        <Alert variant="destructive" className="my-6 border-l-4 border-l-red-600 shadow-md">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Error al cargar denuncias</AlertTitle>
          <AlertDescription className="mt-2">{error}</AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button
            onClick={() => fetchDenuncias()}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 transform hover:scale-105 rounded-lg"
            data-testid="retry-button"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar nuevamente
          </Button>
        </div>
      </motion.div>
    )
  }

  if (denuncias.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
        data-testid="empty-state"
      >
        <Toaster position="top-center" />
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 text-blue-600 mb-6 shadow-inner">
          <FileText className="h-12 w-12" />
        </div>
        <h3 className="text-2xl font-medium text-gray-900 mb-3">No tienes denuncias</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Aún no has realizado ninguna denuncia. Puedes crear una nueva para reportar cualquier problema.
        </p>
        <Button
          onClick={onCreateClick}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-300 transform hover:scale-105 px-6 py-2 rounded-lg"
          data-testid="create-button-empty"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Crear una denuncia
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-testid="historial-container"
    >
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
          <h2 className="text-2xl font-bold text-blue-600">Historial de denuncias</h2>

          <div className="flex items-center gap-2">
            <Button
              onClick={refreshDenuncias}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
              disabled={isRefreshing}
              data-testid="refresh-button"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Actualizando..." : "Actualizar"}
            </Button>

            <Button
              onClick={onCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg"
              size="sm"
              data-testid="create-button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva denuncia
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar en tus denuncias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            data-testid="search-input"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              data-testid="clear-search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-500" data-testid="search-results">
          Se encontraron {filteredDenuncias.length} resultados para "{searchTerm}"
        </div>
      )}

      {/* Lista de denuncias */}
      <div className="grid grid-cols-1 gap-6" data-testid="denuncias-list">
        {filteredDenuncias.length === 0 && searchTerm ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200" data-testid="no-results">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No se encontraron resultados</h3>
            <p className="mt-2 text-gray-500">No hay denuncias que coincidan con "{searchTerm}"</p>
            <Button onClick={() => setSearchTerm("")} variant="outline" className="mt-4 rounded-lg">
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          filteredDenuncias.map((denuncia, index) => (
            <motion.div
              key={denuncia.iddenuncia}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              data-testid={`denuncia-card-${denuncia.iddenuncia}`}
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
                      </CardTitle>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatearFecha(denuncia.fecha)}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${obtenerColorEstado(denuncia.estado)} shadow-sm px-3 py-1 rounded-full`}
                    data-testid={`badge-estado-${denuncia.iddenuncia}`}
                  >
                    {denuncia.estado.charAt(0).toUpperCase() + denuncia.estado.slice(1)}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-5">
                  <div className="mb-4 flex items-center p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
                    {getTypeIcon(denuncia.tipo)}
                    <span className="text-sm font-medium text-gray-700">
                      Tipo: {obtenerEtiquetaTipo(denuncia.tipo)}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start mb-2">
                      <MessageSquare className="h-4 w-4 mr-2 text-blue-500 mt-1" />
                      <span className="text-sm font-medium text-gray-700">Mensaje:</span>
                    </div>
                    <p
                      className="text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100 group-hover:border-gray-200 transition-all duration-300"
                      data-testid={`mensaje-${denuncia.iddenuncia}`}
                    >
                      {denuncia.mensaje}
                    </p>
                  </div>

                  {denuncia.respuesta && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mb-2"
                      data-testid={`respuesta-${denuncia.iddenuncia}`}
                    >
                      <div className="flex items-start mb-2">
                        <User className="h-4 w-4 mr-2 text-green-500 mt-1" />
                        <span className="text-sm font-medium text-gray-700">Respuesta:</span>
                      </div>
                      <p className="text-gray-600 bg-green-50 p-4 rounded-lg border border-green-100 group-hover:border-green-200 transition-all duration-300">
                        {denuncia.respuesta}
                      </p>
                    </motion.div>
                  )}
                </CardContent>

                <CardFooter className="border-t border-gray-100 bg-gray-50 flex justify-end py-3 px-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 transition-all duration-300 rounded-lg"
                        disabled={deletingId === denuncia.iddenuncia}
                        data-testid={`delete-button-${denuncia.iddenuncia}`}
                      >
                        {deletingId === denuncia.iddenuncia ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </>
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md bg-white border border-gray-200 shadow-xl rounded-xl">
                      <AlertDialogHeader className="pb-4">
                        <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                          ¿Estás seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600 mt-2">
                          Esta acción no se puede deshacer. Esto eliminará permanentemente tu denuncia y no podrás
                          recuperarla.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                        <AlertDialogCancel
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-0 px-4 py-2 transition-colors duration-300 rounded-lg"
                          data-testid={`cancel-delete-${denuncia.iddenuncia}`}
                        >
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(denuncia.iddenuncia)}
                          className="bg-red-500 text-white hover:bg-red-600 border-0 px-4 py-2 transition-colors duration-300 rounded-lg"
                          data-testid={`confirm-delete-${denuncia.iddenuncia}`}
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  )
}
