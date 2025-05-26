"use client"
import { crearForo, supabase, obtenerForosUsuario } from "./api-service"
import { useState, useEffect } from "react"
import { listarForos } from "./api-service"
import { isAuthenticated, getCurrentUser } from "./auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MessageSquare, Search, LogIn, User, Calendar, Eye, Sparkles, BookOpen, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import ForoCard from "./foro-card"
import { CrearForoDialog } from "./crear-foro-dialog"

// Tipado de foro
type Foro = {
  idforo: string
  idcuenta: string | number
  titulo: string
  descripcion: string
  fecha: string
  cantidadRespuestas?: number
  cuentas?: { nombre: string }
  respuestas_foro?: Array<{ idrespuesta: string }>
}

// Tipado de usuario
type Usuario = {
  idcuenta: string
  nombre: string
  apellido: string
  correo: string
  email?: string
}

export default function ForoPage() {
  const [foros, setForos] = useState<Foro[]>([])
  const [forosUsuario, setForosUsuario] = useState<Foro[]>([])
  const [filteredForos, setFilteredForos] = useState<Foro[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isLoadingHistorial, setIsLoadingHistorial] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [errorHistorial, setErrorHistorial] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("todos")

  useEffect(() => {
    setIsAuth(isAuthenticated())

    const usuario = getCurrentUser()
    if (usuario) {
      setCurrentUser(usuario as Usuario)
    }

    const fetchForos = async () => {
      try {
        setIsLoading(true)
        const data = await listarForos()
        setForos(data)
        setFilteredForos(data)
      } catch (err) {
        console.error("Error al cargar foros:", err)
        setError("No se pudieron cargar los foros. Por favor, intenta de nuevo más tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchForos()
  }, [])

  // Cargar historial cuando se cambia a la tab de historial
  useEffect(() => {
    if (activeTab === "historial" && isAuth && currentUser && forosUsuario.length === 0) {
      const fetchHistorial = async () => {
        try {
          setIsLoadingHistorial(true)
          setErrorHistorial(null)
          const data = await obtenerForosUsuario(currentUser.idcuenta)
          console.log("Datos del historial:", data) // Para debuggear
          console.log("Primer foro:", data?.[0]) // Para ver la estructura
          setForosUsuario(data || [])
        } catch (err) {
          console.error("Error al cargar historial:", err)
          setErrorHistorial("No se pudo cargar tu historial de foros")
        } finally {
          setIsLoadingHistorial(false)
        }
      }

      fetchHistorial()
    }
  }, [activeTab, isAuth, currentUser, forosUsuario.length])

  useEffect(() => {
    const canalForos = supabase
      .channel("foros-realtime")
      .on("broadcast", { event: "evento-foro" }, (payload) => {
        const { tipo, foro } = payload.payload

        if (tipo === "nuevo-foro") {
          setForos((prev) => [foro, ...prev])
          setFilteredForos((prev) => [foro, ...prev])

          // Si el foro es del usuario actual, agregarlo al historial
          if (currentUser && String(foro.idcuenta) === String(currentUser.idcuenta)) {
            setForosUsuario((prev) => [foro, ...prev])
          }
        }

        if (tipo === "foro-actualizado") {
          setForos((prev) => prev.map((f) => (f.idforo === foro.idforo ? { ...f, ...foro } : f)))
          setFilteredForos((prev) => prev.map((f) => (f.idforo === foro.idforo ? { ...f, ...foro } : f)))

          // Actualizar en historial si es del usuario
          if (currentUser && String(foro.idcuenta) === String(currentUser.idcuenta)) {
            setForosUsuario((prev) => prev.map((f) => (f.idforo === foro.idforo ? { ...f, ...foro } : f)))
          }
        }

        if (tipo === "foro-eliminado") {
          setForos((prev) => prev.filter((f) => f.idforo !== foro.idforo))
          setFilteredForos((prev) => prev.filter((f) => f.idforo !== foro.idforo))
          setForosUsuario((prev) => prev.filter((f) => f.idforo !== foro.idforo))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(canalForos)
    }
  }, [currentUser])

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

  const handleForoCreado = async (titulo: string, descripcion: string) => {
    try {
      const nuevoForo = await crearForo({
        titulo,
        descripcion,
        idcuenta: currentUser?.idcuenta || "unknown",
      })

      setForos([nuevoForo, ...foros])
      setForosUsuario([nuevoForo, ...forosUsuario])

      return nuevoForo
    } catch (error) {
      console.error("Error al crear foro:", error)
      throw new Error("No se pudo crear el foro")
    }
  }

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
    // Usar la misma lógica que en foro-card.tsx
    return foro.respuestas_foro?.length || 0
  }

  const renderHistorialContent = () => {
    if (!isAuth) {
      return (
        <div className="text-center py-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
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
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar sesión
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    if (isLoadingHistorial) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando tu historial...</p>
          </div>
        </div>
      )
    }

    if (errorHistorial) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <MessageSquare className="h-4 w-4 text-red-600" />
            </div>
            {errorHistorial}
          </div>
        </div>
      )
    }

    if (forosUsuario.length === 0) {
      return (
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

            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => {
                setActiveTab("todos")
                setDialogOpen(true)
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear mi primer foro
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-8">
        {/* Estadística simplificada */}
        <div className="grid grid-cols-1 max-w-sm mx-auto">
          <Card className="border-t-4 border-t-blue-600 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Mis Foros Creados</CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-800">{forosUsuario.length}</div>
              <p className="text-xs text-blue-600 mt-1">
                {forosUsuario.length === 1 ? "foro creado" : "foros creados"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de foros del usuario */}
        <motion.div className="grid gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {forosUsuario.map((foro, index) => (
            <motion.div
              key={foro.idforo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 border-t-blue-600">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Tu foro</Badge>
                        <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {obtenerCantidadRespuestas(foro)}{" "}
                          {obtenerCantidadRespuestas(foro) === 1 ? "respuesta" : "respuestas"}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-blue-800 line-clamp-2 mb-2">{foro.titulo}</CardTitle>
                      <CardDescription className="line-clamp-3 text-gray-600">{foro.descripcion}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Creado {formatearFecha(foro.fecha)}
                    </div>

                    <Link href={`/Foro/${foro.idforo}`}>
                      <Button variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver discusión
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2">Foros de Discusión</h1>
            <p className="text-blue-100">
              {isAuth
                ? `Bienvenido ${currentUser?.nombre || currentUser?.correo?.split("@")[0] || ""}. Comparte tus ideas y participa en conversaciones.`
                : "Inicia sesión para participar en las conversaciones."}
            </p>
          </div>

          {isAuth ? (
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50" onClick={() => setDialogOpen(true)}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear nuevo foro
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                <LogIn className="mr-2 h-5 w-5" />
                Iniciar sesión
              </Button>
            </Link>
          )}
        </div>
      </div>

      <CrearForoDialog open={dialogOpen} setOpen={setDialogOpen} onCreate={handleForoCreado} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50 border border-blue-200">
          <TabsTrigger
            value="todos"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            <MessageSquare className="h-4 w-4" />
            Todos los Foros
          </TabsTrigger>
          <TabsTrigger
            value="historial"
            className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            disabled={!isAuth}
          >
            <User className="h-4 w-4" />
            Mi Historial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Buscar foros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center text-sm">
              <div className="flex items-center text-gray-500">
                <MessageSquare className="h-5 w-5 mr-1" />
                <span>{foros.length} foros</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando foros...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <MessageSquare className="h-4 w-4 text-red-600" />
                </div>
                {error}
              </div>
            </div>
          ) : filteredForos.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No hay foros disponibles</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? "No se encontraron resultados para tu búsqueda" : "Sé el primero en crear un foro"}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpiar búsqueda
                </Button>
              )}
            </div>
          ) : (
            <motion.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {filteredForos.map((foro, index) => (
                <motion.div
                  key={foro.idforo ?? `foro-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ForoCard foro={foro} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="historial" className="mt-6">
          {renderHistorialContent()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
