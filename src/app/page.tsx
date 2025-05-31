"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const sections = [
    { name: "Rutas", path: "/rutas", icon: "/svg/Rutas1.svg", description: "Consulta todas las rutas disponibles" },
    {
      name: "Buses por Estación",
      path: "/buses-por-estacion",
      icon: "/svg/BusesPorEstacion1.svg",
      description: "Verifica los buses que pasan por cada estación",
    },
    {
      name: "Saldo y Recargas",
      path: "/saldo-y-recargas",
      icon: "/svg/Saldo1.svg",
      description: "Consulta y recarga el saldo de tu tarjeta",
    },
    {
      name: "Planea tu Viaje",
      path: "/planea-tu-viaje",
      icon: "/svg/PlaneaTuViaje1.svg",
      description: "Encuentra la mejor ruta para tu destino",
    },
    {
      name: "Rutas en tiempo real",
      path: "/buses-realtime",
      icon: "/svg/MapaMIO1.svg",
      description: "Visualiza la ubicación de los buses en tiempo real",
    },
    {
      name: "Noticias y alertas",
      path: "/noticias-alertas",
      icon: "/svg/Noticias1.svg",
      description: "Mantente informado sobre novedades y alertas",
    },
    {
      name: "Denuncias",
      path: "/denuncias",
      icon: "/svg/Denuncias1.svg",
      description: "Reporta incidentes o problemas en el servicio",
    },
    {
      name: "Foro",
      path: "/Foro",
      icon: "/svg/GrupoWhatsapp1.svg",
      description: "Participa en la comunidad de usuarios",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 py-10">
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-800 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            ¡Bienvenido a TUYO!
          </h1>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Tu asistente para moverte por la ciudad de manera eficiente
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full"
        >
          {sections.map((section, index) => (
            <motion.div
              key={index}
              variants={item}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative"
            >
              <Link
                href={section.path}
                className="flex flex-col items-center h-full p-5 bg-white border border-blue-100 rounded-xl transition-all duration-300 hover:shadow-lg hover:border-blue-300 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-blue-50 flex justify-center items-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={section.icon || "/placeholder.svg"}
                    alt={section.name}
                    width={50}
                    height={50}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <h2 className="text-base md:text-lg font-semibold text-center text-blue-800 mb-2">{section.name}</h2>

                <p className="text-xs text-gray-500 text-center mt-auto">{section.description}</p>

                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: hoveredIndex === index ? "80%" : "0%" }}
                  transition={{ duration: 0.3 }}
                  className="h-0.5 bg-blue-500 mt-3 rounded-full"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
