"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Calendar, User, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { isOwner } from "./auth-service"
import EditarForoDialog from "./editar-foro-dialog"

type Foro = {
  idforo: string
  idcuenta: string | number
  titulo: string
  descripcion: string
  fecha: string
  cantidadRespuestas?: number
}

type Props = {
  foro: Foro
  onForoActualizado: (foroActualizado: Foro) => void
}

export default function ForoDetail({ foro, onForoActualizado }: Props) {
  const fechaCreacion = new Date(foro.fecha)
  const tiempoTranscurrido = formatDistanceToNow(fechaCreacion, {
    addSuffix: true,
    locale: es,
  })

  const esAutor = isOwner(String(foro.idcuenta))
  const cantidad = foro.cantidadRespuestas || 0

  // Convertir idcuenta a string antes de usar substring
  const idCuentaStr = String(foro.idcuenta)
  const idCortado = idCuentaStr.substring(0, 5) // Mostrar solo los primeros 5 caracteres del ID

  return (
    <Card className="overflow-hidden border-t-4 border-t-blue-600">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-white pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Tema de discusión
              </Badge>
              {esAutor && <Badge className="bg-blue-100 text-blue-700">Tu foro</Badge>}
              <Badge
                className={`flex items-center gap-1 ${
                  cantidad > 0
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                {cantidad} {cantidad === 1 ? "respuesta" : "respuestas"}
              </Badge>
            </div>
            <CardTitle className="text-2xl text-blue-800">{foro.titulo}</CardTitle>
          </div>

          {esAutor && (
            <EditarForoDialog foro={foro} onForoActualizado={onForoActualizado}>
              <Button variant="outline" size="sm" className="text-blue-700 border-blue-200">
                <Edit className="mr-2 h-4 w-4" />
                Editar foro
              </Button>
            </EditarForoDialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>Usuario {idCortado}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{tiempoTranscurrido}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{foro.descripcion}</p>
        </div>
      </CardContent>
    </Card>
  )
}
