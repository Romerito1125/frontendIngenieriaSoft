//Zuluaga

"use client"

import RespuestaItem from "./respuesta-item"
import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type NodoRespuesta = {
  valor: {
    idrespuesta: string
    idcuenta: string | number
    mensaje: string
    fecha: string
    nombreUsuario?: string
    cuentas?: {
      nombre?: string
    }
    idrespuesta_padre?: string
    idforo?: string
  }
  hijos: NodoRespuesta[]
}

type Props = {
  respuestas: NodoRespuesta[]
  onRespuestaActualizada: (r: any) => void
  onRespuestaEliminada: (id: string) => void
  onReplicaCreada?: (replica: any) => void
  idForo: string
}

// Función para contar todas las respuestas en el árbol
function contarRespuestasEnArbol(nodos: NodoRespuesta[]): number {
  let total = 0
  for (const nodo of nodos) {
    total += 1 // Contar el nodo actual
    total += contarRespuestasEnArbol(nodo.hijos) // Contar recursivamente los hijos
  }
  return total
}

export default function RespuestasList({
  respuestas,
  onRespuestaActualizada,
  onRespuestaEliminada,
  onReplicaCreada,
  idForo,
}: Props) {
  // Estado para controlar qué nodos están expandidos
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const totalRespuestas = contarRespuestasEnArbol(respuestas)

  // Función para alternar el estado expandido de un nodo
  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  if (totalRespuestas === 0) {
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

  // Función recursiva para renderizar el árbol de respuestas
  const renderNodoRespuesta = (nodo: NodoRespuesta, profundidad = 0) => {
    const puedeReplicar = profundidad < 2 // Solo hasta 2 niveles de profundidad (0, 1, 2)
    const tieneHijos = nodo.hijos.length > 0
    const estaExpandido = expandedNodes.has(nodo.valor.idrespuesta)

    return (
      <div key={nodo.valor.idrespuesta} className={profundidad > 0 ? "ml-8 mt-4" : ""}>
        <RespuestaItem
          respuesta={nodo.valor}
          onRespuestaActualizada={onRespuestaActualizada}
          onRespuestaEliminada={onRespuestaEliminada}
          onReplicaCreada={onReplicaCreada}
          puedeReplicar={puedeReplicar}
          profundidad={profundidad}
          idForo={idForo}
        />

        {/* Botón para expandir/colapsar réplicas */}
        {tieneHijos && (
          <div className="ml-8 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(nodo.valor.idrespuesta)}
              className={`text-xs ${
                profundidad === 0
                  ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  : profundidad === 1
                    ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                    : "text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              }`}
            >
              {estaExpandido ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
              {estaExpandido ? "Ocultar" : "Ver"} {nodo.hijos.length}{" "}
              {nodo.hijos.length === 1 ? "respuesta" : "respuestas"}
            </Button>
          </div>
        )}

        {/* Renderizar hijos solo si está expandido */}
        {tieneHijos && estaExpandido && (
          <div className="space-y-4 mt-2">{nodo.hijos.map((hijo) => renderNodoRespuesta(hijo, profundidad + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Botón para expandir/colapsar todas las respuestas */}
      {respuestas.some((nodo) => nodo.hijos.length > 0) && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allNodeIds = new Set<string>()
              const collectNodeIds = (nodos: NodoRespuesta[]) => {
                nodos.forEach((nodo) => {
                  if (nodo.hijos.length > 0) {
                    allNodeIds.add(nodo.valor.idrespuesta)
                    collectNodeIds(nodo.hijos)
                  }
                })
              }
              collectNodeIds(respuestas)

              if (expandedNodes.size === allNodeIds.size) {
                // Si todos están expandidos, colapsar todos
                setExpandedNodes(new Set())
              } else {
                // Si no todos están expandidos, expandir todos
                setExpandedNodes(allNodeIds)
              }
            }}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {expandedNodes.size > 0 ? (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Colapsar todas
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-2" />
                Expandir todas
              </>
            )}
          </Button>
        </div>
      )}

      {respuestas.map((nodo) => renderNodoRespuesta(nodo, 0))}
    </div>
  )
}
