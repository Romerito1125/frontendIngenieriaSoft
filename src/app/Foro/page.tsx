"use client"
import { supabase } from "./api-service"
import { useState, useEffect } from "react"
import { listarForos } from "./api-service"
import { isAuthenticated, getCurrentUser } from "./auth-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, MessageSquare, Search, LogIn } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
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
  const [filteredForos, setFilteredForos] = useState<Foro[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<Usuario | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

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

  useEffect(() => {
    const canalForos = supabase
      .channel('foros-realtime')
      .on('broadcast', { event: 'nuevo-foro' }, (payload) => {
        console.log('🟢 Foro realtime recibido:', payload.payload);
        setForos((prev) => [payload.payload, ...prev]);
        setFilteredForos((prev) => [payload.payload, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canalForos);
    };
  }, []);


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
      // Aquí normalmente llamarías a tu API para crear el foro
      // Por ahora, simulamos la respuesta
      const nuevoForo: Foro = {
        idforo: `temp-${Date.now()}`,
        idcuenta: currentUser?.idcuenta || "unknown",
        titulo,
        descripcion,
        fecha: new Date().toISOString(),
        cantidadRespuestas: 0,
      }

      setForos([nuevoForo, ...foros])
      return nuevoForo
    } catch (error) {
      console.error("Error al crear foro:", error)
      throw new Error("No se pudo crear el foro")
    }
  }

  const userName = currentUser?.nombre || currentUser?.email?.split("@")[0] || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-8 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h1 className="text-3xl font-bold text-white mb-2">Foros de Discusión</h1>
            <p className="text-blue-100">
              {isAuth
                ? `Bienvenido${userName ? `, ${userName}` : ""}. Comparte tus ideas y participa en conversaciones.`
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
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
    </div>
  )
}
