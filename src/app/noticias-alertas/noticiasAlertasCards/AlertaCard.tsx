"use client"
import { motion } from "framer-motion"
import { obtenerEstilosPrioridad, formatearFechaCorta } from "../utils"

type AlertaProps = {
  mensaje: string
  hora: string
  tipo: string
  nombreEstacion: string
  idruta: string
  prioridad: string
  icono: string
}

export default function AlertaCard({ mensaje, hora, tipo, nombreEstacion, idruta, prioridad, icono }: AlertaProps) {
  const estilos = obtenerEstilosPrioridad(prioridad)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`border-l-4 ${estilos.border} bg-gradient-to-br ${estilos.bg} rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`${estilos.icon} text-lg mt-1`}>{icono}</div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`${estilos.badge} text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm`}>
              Alerta
            </div>
            <h2 className="font-bold text-gray-800">{tipo}</h2>
            <div
              className={`${estilos.badge} text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm ml-auto`}
            >
              Prioridad: {prioridad}
            </div>
          </div>

          <p className="text-gray-700">{mensaje}</p>

          <div className="flex flex-wrap justify-between items-center pt-1 text-xs text-gray-500 gap-2">
            <div className="flex items-center gap-1">
              <span className="font-medium">Ruta:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{idruta}</span>
              <span className="font-medium ml-2">Estación:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{nombreEstacion}</span>
            </div>

            <p className="text-gray-400">{formatearFechaCorta(hora)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
