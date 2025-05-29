"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, CreditCard, Trash2, DollarSign, Calendar, Hash, Lock, User, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import RegistrarTarjeta from "./RegistrarTarjeta"
import EliminarTarjeta from "./EliminarTarjeta"
import RecargarTarjeta from "./RecargarTarjeta"
import { isAuthenticated, getCurrentUser } from "./auth-service"

type Tarjeta = {
  idtarjeta: number
  idtarjeta_asignacion?: number
  numero_tarjeta: string
  fechaExpedicion: string
  saldo: number
  ultimarecarga?: string | null
}

export default function TarjetasPage() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [loading, setLoading] = useState(true)
  const [modalRegistro, setModalRegistro] = useState(false)
  const [modalEliminar, setModalEliminar] = useState<{ id: number; numero: string } | null>(null)
  const [modalRecarga, setModalRecarga] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    const authStatus = isAuthenticated()
    const user = getCurrentUser()

    setAuthenticated(authStatus)
    setCurrentUser(user)

    if (authStatus && user) {
      fetchTarjetas(user.idcuenta)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchTarjetas = async (cuentaId: string) => {
    try {
      setLoading(true)
      const res = await fetch(`https://www.api.devcorebits.com/tarjetasGateway/tarjetas/cuenta/${cuentaId}`)
      if (res.ok) {
        const data = await res.json()
        console.log("Tarjetas data:", data)
        setTarjetas(data)
      }
    } catch (error) {
      console.error("Error al cargar tarjetas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTarjetaRegistrada = () => {
    setModalRegistro(false)
    if (currentUser) {
      fetchTarjetas(currentUser.idcuenta)
    }
  }

  const handleTarjetaEliminada = () => {
    setModalEliminar(null)
    if (currentUser) {
      fetchTarjetas(currentUser.idcuenta)
    }
  }

  const handleRecargaExitosa = () => {
    setModalRecarga(null)
    if (currentUser) {
      fetchTarjetas(currentUser.idcuenta)
    }
  }

  const formatearFecha = (fecha: string | null | undefined) => {
    if (!fecha) return "Sin recargas"
    try {
      return new Date(fecha).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    } catch {
      return "Fecha inválida"
    }
  }

  const getGridCols = (count: number) => {
    if (count === 1) return "grid-cols-1 max-w-md mx-auto"
    if (count === 2) return "grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto"
    if (count === 3) return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto"
    // Para 4 o más tarjetas, usar un grid completamente responsivo
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 max-w-none mx-auto"
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 text-red-600 mb-6 shadow-lg">
            <Lock className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Acceso Restringido</h1>
          <p className="text-gray-600 mb-8">Debes iniciar sesión para acceder al sistema de tarjetas TUYO</p>
          <Button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <User className="w-5 h-5 mr-2" />
            Iniciar Sesión
          </Button>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
            Mis Tarjetas TUYO
          </h1>
          <p className="text-blue-600 text-lg">Bienvenido, querido usuario, aquí podrá registrar sus tarjetas físicas</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium">
            <CreditCard className="w-4 h-4" />
            {tarjetas.length} {tarjetas.length === 1 ? "tarjeta registrada" : "tarjetas registradas"}
          </div>
        </motion.div>

        {/* Botón Agregar Tarjeta */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12 flex justify-center"
        >
          <Button
            onClick={() => setModalRegistro(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <Plus className="w-6 h-6" />
            Registrar Nueva Tarjeta
          </Button>
        </motion.div>

        {/* Grid de Tarjetas */}
        <AnimatePresence>
          {tarjetas.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-400 mb-8 shadow-lg">
                <CreditCard className="w-16 h-16" />
              </div>
              <h3 className="text-2xl font-bold text-blue-800 mb-4">No tienes tarjetas registradas</h3>
              <p className="text-blue-600 text-lg">
                Registra tu primera tarjeta TUYO para comenzar a gestionar tu transporte
              </p>
            </motion.div>
          ) : (
            <div className={`grid gap-8 ${getGridCols(tarjetas.length)}`}>
              {tarjetas.map((tarjeta, index) => (
                <motion.div
                  key={tarjeta.numero_tarjeta}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden relative h-full">
                    {/* Efectos de fondo */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-6 right-6 w-40 h-40 rounded-full border-2 border-white/30" />
                      <div className="absolute bottom-6 left-6 w-28 h-28 rounded-full border-2 border-white/20" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-white/10" />
                    </div>

                    {/* Brillo superior */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                    <CardHeader className="relative z-10 pb-4">
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <CreditCard className="w-7 h-7" />
                          </div>
                          <div>
                            <span className="text-xl font-bold">Tarjeta TUYO</span>
                            <div className="text-blue-100 text-sm font-normal">Sistema Integrado</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">${tarjeta.saldo.toLocaleString()}</div>
                          <div className="text-sm opacity-90">Saldo disponible</div>
                        </div>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                          <Hash className="w-5 h-5 text-blue-200" />
                          <div>
                            <span className="opacity-80 block text-xs">Número de tarjeta</span>
                            <span className="font-mono text-lg font-semibold">{tarjeta.numero_tarjeta}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <Calendar className="w-4 h-4 text-blue-200" />
                            <div>
                              <span className="opacity-80 block text-xs">Expedición</span>
                              <span className="font-semibold">
                                {new Date(tarjeta.fechaExpedicion).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <Clock className="w-4 h-4 text-blue-200" />
                            <div>
                              <span className="opacity-80 block text-xs">Última recarga</span>
                              <span className="font-semibold text-xs">{formatearFecha(tarjeta.ultimarecarga)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Estado de la tarjeta */}
                        <div className="flex justify-center">
                          <Badge
                            variant="secondary"
                            className="bg-green-500/20 text-green-100 border-green-400/30 px-3 py-1"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Activa
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => {
                            console.log("Recargar clicked for tarjeta:", tarjeta)
                            setModalRecarga(tarjeta.idtarjeta)
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white border-0 rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <DollarSign className="w-5 h-5 mr-2" />
                          Recargar
                        </Button>
                        <Button
                          onClick={() => {
                            console.log("Eliminar clicked for tarjeta:", tarjeta)
                            const idParaEliminar = tarjeta.idtarjeta_asignacion || tarjeta.idtarjeta
                            setModalEliminar({
                              id: idParaEliminar,
                              numero: tarjeta.numero_tarjeta,
                            })
                          }}
                          variant="outline"
                          className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Modales */}
        {currentUser && (
          <>
            <RegistrarTarjeta
              isOpen={modalRegistro}
              onClose={() => setModalRegistro(false)}
              onSuccess={handleTarjetaRegistrada}
              cuentaId={currentUser.idcuenta}
            />

            {modalEliminar && (
              <EliminarTarjeta
                isOpen={!!modalEliminar}
                onClose={() => setModalEliminar(null)}
                onSuccess={handleTarjetaEliminada}
                tarjetaId={String(modalEliminar.id)}
                numeroTarjeta={modalEliminar.numero}
                userEmail={currentUser.email}
              />
            )}

            {modalRecarga && (
              <RecargarTarjeta
                isOpen={!!modalRecarga}
                onClose={() => setModalRecarga(null)}
                onSuccess={handleRecargaExitosa}
                tarjetaId={String(modalRecarga)}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
