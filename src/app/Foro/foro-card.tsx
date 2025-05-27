"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"
import { MessageSquare, Calendar, User, TrendingUp } from "lucide-react"
import { isOwner } from "./auth-service"

type Foro = {
  idforo: string
  idcuenta: string | number
  titulo: string
  descripcion: string
  fecha: string
  cuentas?: {
    nombre?: string
  }
  respuestas_foro?: { idrespuesta: string }[]
}

export default function ForoCard({ foro }: { foro: Foro }) {
  let tiempoTranscurrido = "Fecha inválida"
  try {
    const fechaCreacion = new Date(foro.fecha)
    if (!isNaN(fechaCreacion.getTime())) {
      tiempoTranscurrido = formatDistanceToNow(fechaCreacion, {
        addSuffix: true,
        locale: es,
      })
    }
  } catch (e) {
    console.error("Fecha inválida en foro:", foro.fecha)
  }

  const esAutor = isOwner(String(foro.idcuenta))
  const cantidad = foro.respuestas_foro?.length || 0
  const nombreUsuario = foro.cuentas?.nombre || "Usuario desconocido"

  // Determinar si es un foro "popular" basado en respuestas
  const esPopular = cantidad >= 5

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-t-4 border-t-blue-600 h-full flex flex-col group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="flex gap-2 flex-wrap">
            {esAutor && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">Tu foro</Badge>}
            {esPopular && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-xl text-blue-700 line-clamp-2 group-hover:text-blue-800 transition-colors">
          <Link href={`/Foro/${foro.idforo}`} className="hover:underline">
            {foro.titulo}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">{foro.descripcion}</p>
        <div className="flex items-center text-sm text-gray-500">
          <User className="h-4 w-4 mr-1" />
          <span className="font-medium">{nombreUsuario}</span>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gradient-to-r from-gray-50 to-blue-50 flex justify-between pt-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{tiempoTranscurrido}</span>
          </div>

          <div className={`flex items-center text-sm font-medium ${cantidad > 0 ? "text-blue-600" : "text-gray-500"}`}>
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>
              {cantidad} {cantidad === 1 ? "respuesta" : "respuestas"}
            </span>
          </div>
        </div>

        <Link
          href={`Foro/${foro.idforo}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors group-hover:underline"
        >
          Ver discusión
        </Link>
      </CardFooter>
    </Card>
  )
}
