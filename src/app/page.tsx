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
      path: "/noticias",
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
            ¡Bienvenido a tuyo!
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 p-6 bg-blue-600 text-white rounded-xl shadow-lg max-w-3xl w-full"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0 bg-white p-3 rounded-full">
              <Image src="/Logo.png" alt="Logo" width={60} height={60} className="object-contain" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda?</h3>
              <p className="text-blue-100 mb-4">
                Descarga nuestra aplicación móvil para acceder a todas las funcionalidades incluso sin conexión.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.9 2.318A5.364 5.364 0 0 1 21.593 6.6 48.184 48.184 0 0 1 12 6.6a48.184 48.184 0 0 1-9.593 0A5.364 5.364 0 0 1 6.1 2.318a39.21 39.21 0 0 1 11.8 0ZM12 2.4a38.357 38.357 0 0 0-5.9.462 4.548 4.548 0 0 0-3.253 3.253A47.322 47.322 0 0 0 12 7.384a47.322 47.322 0 0 0 9.153-1.27 4.548 4.548 0 0 0-3.253-3.252A38.357 38.357 0 0 0 12 2.4Z" />
                    <path d="M21.593 7.4c-3.198.328-6.4.492-9.593.492-3.193 0-6.395-.164-9.593-.492v9.2A5.364 5.364 0 0 0 6.1 21.682a39.21 39.21 0 0 0 11.8 0 5.364 5.364 0 0 0 3.693-4.282v-10ZM20.8 16.8a4.548 4.548 0 0 1-3.253 3.253 38.357 38.357 0 0 1-11.094 0A4.548 4.548 0 0 1 3.2 16.8v-8.616a48.322 48.322 0 0 0 8.8.416 48.322 48.322 0 0 0 8.8-.416V16.8Z" />
                  </svg>
                  App Store
                </button>
                <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.9 10.566a2.654 2.654 0 0 0-2.48-1.454 3.797 3.797 0 0 0-1.327.242 3.569 3.569 0 0 0-1.092.69 3.276 3.276 0 0 0-.75 1.03 3.215 3.215 0 0 0-.275 1.332c0 .472.092.91.275 1.314.183.404.434.758.75 1.06.317.303.69.54 1.119.713.428.173.89.26 1.386.26.52 0 .996-.095 1.428-.285a3.403 3.403 0 0 0 1.144-.788l-1.144-1.144a1.558 1.558 0 0 1-.527.397 1.778 1.778 0 0 1-.713.145 1.893 1.893 0 0 1-.713-.139 1.83 1.83 0 0 1-.593-.388 1.83 1.83 0 0 1-.4-.593 1.893 1.893 0 0 1-.145-.713c0-.26.048-.502.145-.726a1.83 1.83 0 0 1 1.005-.994c.224-.97.466-.145.726-.145.26 0 .5.048.726.145.226.097.423.23.593.4l1.156-1.156a3.215 3.215 0 0 0-1.144-.775 3.797 3.797 0 0 0-1.428-.285c-.52 0-.996.095-1.428.285a3.403 3.403 0 0 0-1.144.775 3.569 3.569 0 0 0-.763 1.156 3.797 3.797 0 0 0-.275 1.453c0 .52.092.996.275 1.428.183.432.434.81.75 1.131.317.322.69.573 1.119.751.428.178.89.267 1.386.267.52 0 .996-.095 1.428-.285a3.403 3.403 0 0 0 1.144-.775 3.569 3.569 0 0 0 .763-1.156 3.797 3.797 0 0 0 .275-1.453 3.215 3.215 0 0 0-.275-1.332 3.276 3.276 0 0 0-.75-1.03Z" />
                    <path d="M3.1 3.4v17.2L14.5 12 3.1 3.4Z" />
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
