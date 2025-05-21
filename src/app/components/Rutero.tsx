"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export default function RuteroLED() {
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-black p-6 rounded-lg w-full max-w-lg border-4 border-gray-800 overflow-hidden flex items-center shadow-[0_0_15px_rgba(255,200,0,0.3)]"
    >
      {/* Fondo de puntos para simular LEDs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,200,0,0.5)_1px,transparent_1px)] bg-[size:4px_4px] opacity-30"></div>

      {/* Efecto de reflejo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent h-1/3 opacity-40"></div>

      <div className="relative z-10 flex flex-row w-full items-center">
        {/* Código de ruta */}
        <motion.span
          animate={{ opacity: blink ? 0.8 : 1 }}
          transition={{ duration: 0.2 }}
          className="text-6xl font-mono text-amber-500 tracking-widest font-bold mr-6 leading-none drop-shadow-[0_0_8px_rgba(255,204,0,0.7)]"
        >
          T31
        </motion.span>

        {/* Destino */}
        <div className="text-3xl font-mono text-amber-500 tracking-widest leading-tight drop-shadow-[0_0_6px_rgba(255,204,0,0.7)]">
          <motion.p
            animate={{ x: [0, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              repeatType: "loop",
              ease: "linear",
              repeatDelay: 2,
            }}
          >
            Carrera 1 - Centro
          </motion.p>
          <motion.p
            animate={{ x: [0, -5, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              repeatType: "loop",
              ease: "linear",
              repeatDelay: 2,
              delay: 0.5,
            }}
          >
            Universidades
          </motion.p>
        </div>
      </div>

      {/* Efecto de polvo/suciedad */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxmaWx0ZXIgaWQ9ImEiIHg9IjAiIHk9IjAiPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuNzUiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHJlc3VsdD0ibm9pc2UiLz48ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIi8+PC9maWx0ZXI+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] opacity-20 mix-blend-multiply pointer-events-none"></div>
    </motion.div>
  )
}
