//Zuluaga


"use client"

import RespuestaItem from "./respuesta-item"

type Props = {
  respuestas: any[]
  onRespuestaActualizada: (r: any) => void
  onRespuestaEliminada: (id: string) => void
}

export default function RespuestasList({ respuestas, onRespuestaActualizada, onRespuestaEliminada }: Props) {
  if (respuestas.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No hay respuestas aún</h3>
        <p className="text-gray-500">Sé el primero en responder a este tema</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {respuestas.map((respuesta, index) => (
        <RespuestaItem
           key={respuesta.idrespuesta || `respuesta-${index}`}
          respuesta={respuesta}
          onRespuestaActualizada={onRespuestaActualizada}
          onRespuestaEliminada={onRespuestaEliminada}
        />
      ))}
    </div>
  )
}
