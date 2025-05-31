"use client"

import UserMenu from "./UserMenu"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const urls = [
      "https://tiemporeal.devcorebits.com",
      "https://www.cuentas.devcorebits.com",
      "https://serviciotarjetas.onrender.com",
      "https://servicioforo.onrender.com",
      "https://servicionoticias.onrender.com",
      "https://www.alertas.devcorebits.com",
      "https://serviciodenuncias.onrender.com"
    ]

    urls.forEach(url => {
      fetch(url).catch(() => {})
    })
  }, [])

  const headerBgClass = scrolled ? "bg-white shadow-sm" : "bg-white"

  return (
    <header
      className={`w-full px-6 py-3 flex justify-between items-center z-50 transition-all duration-300 ${headerBgClass} border-b border-gray-200`}
    >
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center group">
          <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105">
            <Image src="/Logo.png" alt="Logo" width={60} height={60} className="object-contain" />
          </div>
        </Link>
      </div>

      {/* Menú a la derecha */}
      <UserMenu />
    </header>
  )
}
