"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { obtenerIconoNoticia, formatearFechaCorta } from "../utils"

type NoticiaProps = {
  idnoticia: number
  titulo: string
  descripcion: string
  fecha: string
  autor: string
  tipo: string
}

export default function NoticiaCard({ idnoticia, titulo, descripcion, fecha, autor, tipo }: NoticiaProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
      className="border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">Noticia</div>
          <h2 className="font-bold text-blue-900 line-clamp-1">
            {obtenerIconoNoticia(tipo)} {titulo}
          </h2>
        </div>

        <p className="text-gray-700 line-clamp-2 text-sm">{descripcion}</p>

        <div className="flex justify-between items-end pt-2">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="font-medium">Por:</span> {autor}
            </p>
            <p className="text-xs text-gray-400">{formatearFechaCorta(fecha)}</p>
          </div>

          <Link
            href={`/noticias-alertas/noticias/${idnoticia}`}
            className="text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-1 group"
          >
            Ver más
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transform transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
