"use client"
import { motion } from "framer-motion"
import { useIsAdmin } from "../../hooks/isAdmin"

type AlertaProps = {
  mensaje: string
  hora: string
  tipo: string
  idestacion: string
  idruta: string
  prioridad: string
}

export default function AlertaCard({ mensaje, hora, tipo, idestacion, idruta, prioridad }: AlertaProps) {
  // Determinar el color de fondo y borde según la prioridad
  const getPriorityStyles = () => {
    switch (prioridad.toLowerCase()) {
      case "alta":
        return {
          border: "border-red-500",
          bg: "from-red-50 to-white",
          badge: "bg-red-600",
          icon: "text-red-600",
        }
      case "media":
        return {
          border: "border-orange-500",
          bg: "from-orange-50 to-white",
          badge: "bg-orange-500",
          icon: "text-orange-500",
        }
      default:
        return {
          border: "border-yellow-500",
          bg: "from-yellow-50 to-white",
          badge: "bg-yellow-500",
          icon: "text-yellow-600",
        }
    }
  }

  const styles = getPriorityStyles()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`border-l-4 ${styles.border} bg-gradient-to-br ${styles.bg} rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300`}
    >
      <div className="flex items-start gap-3">
        <div className={`${styles.icon} mt-1`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={`${styles.badge} text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm`}>
              Alerta
            </div>
            <h2 className="font-bold text-gray-800">{tipo}</h2>
            <div
              className={`${styles.badge} text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm ml-auto`}
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
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{idestacion}</span>
            </div>

            <p className="text-gray-400">
              {new Date(hora).toLocaleString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
