// Archivo de utilidades para la planificación de viajes

export type Estacion = {
  idestacion: number
  nombre: string
  ubicacion: string
  Zona: string
}

export type RutaResultado = {
  rutas: string[]
  transbordo: boolean
  estacionTransbordo?: number
  nombreEstacionTransbordo?: string
}

export type PlanearViajePayload = {
  tipo: string
  origen: number
  destino: number
}

export type RutaConTipo = {
  id: string
  tipo: string
}

const API_BASE_URL = "https://www.api.devcorebits.com/tiemporealGateway"

// Función para obtener todas las estaciones
export async function obtenerEstaciones(): Promise<Estacion[]> {
  const res = await fetch(`${API_BASE_URL}/estaciones`)

  if (!res.ok) {
    throw new Error("Error al cargar las estaciones")
  }

  return await res.json()
}

// Función para planear un viaje entre dos estaciones
export async function planearViaje(data: PlanearViajePayload): Promise<RutaResultado> {
  const res = await fetch(`${API_BASE_URL}/viajes/planear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Error al calcular la ruta")
  }

  const responseData = await res.json()

  if (!responseData.rutas || responseData.rutas.length === 0) {
    throw new Error("No se pudo calcular la ruta. Intenta con otras estaciones.")
  }

  return responseData
}

// Función para obtener el nombre de una estación por ID
export async function obtenerNombreEstacion(idEstacion: number): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/estaciones/${idEstacion}`)

  if (!res.ok) {
    throw new Error("Error al obtener información de la estación")
  }

  const data = await res.json()
  return data?.nombre || "Estación desconocida"
}

// Función para obtener el tipo de una ruta por ID
export async function obtenerTipoRuta(idRuta: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/rutas/${idRuta}`)

  if (!res.ok) {
    throw new Error("Error al obtener información de la ruta")
  }

  const data = await res.json()
  return data?.tipo || "desconocido"
}

// Función para obtener el color según el tipo de ruta
export function getColorByType(tipo: string): string {
  switch (tipo.toLowerCase()) {
    case "troncal":
      return "bg-gradient-to-r from-red-600 to-red-500 border-red-700"
    case "pretroncal":
      return "bg-gradient-to-r from-blue-600 to-blue-500 border-blue-700"
    case "expreso":
      return "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black border-yellow-600"
    case "alimentador":
      return "bg-gradient-to-r from-green-600 to-green-500 border-green-700"
    default:
      return "bg-gradient-to-r from-gray-600 to-gray-500 border-gray-700"
  }
}

// Función para obtener el nombre de la zona
export function getNombreZona(zona: string): string {
  switch (zona) {
    case "0":
      return "Zona 0 - Centro"
    case "1":
      return "Zona 1 - Universidades"
    case "2":
      return "Zona 2 - Menga"
    case "3":
      return "Zona 3 - Paso del Comercio"
    case "4":
      return "Zona 4 - Andrés Sanín"
    case "5":
      return "Zona 5 - Aguablanca"
    case "6":
      return "Zona 6 - Simón Bolívar"
    case "7":
      return "Zona 7 - Cañaveralejo"
    case "8":
      return "Zona 8 - Calipso"
    default:
      return `Zona ${zona}`
  }
}

// Función para obtener el color de la zona
export function getZonaColor(zona: string): string {
  const colors = [
    "from-blue-600 to-blue-400",
    "from-purple-600 to-purple-400",
    "from-green-600 to-green-400",
    "from-yellow-600 to-yellow-400",
    "from-red-600 to-red-400",
    "from-pink-600 to-pink-400",
    "from-indigo-600 to-indigo-400",
    "from-teal-600 to-teal-400",
    "from-orange-600 to-orange-400",
  ]

  const index = Number.parseInt(zona) % colors.length
  return colors[index] || colors[0]
}

// Función para agrupar estaciones por zona
export function agruparEstacionesPorZona(estaciones: Estacion[]): { [zona: string]: Estacion[] } {
  const agrupado: { [zona: string]: Estacion[] } = {}

  estaciones.forEach((estacion) => {
    if (!agrupado[estacion.Zona]) {
      agrupado[estacion.Zona] = []
    }
    agrupado[estacion.Zona].push(estacion)
  })

  return agrupado
}

// Función para filtrar estaciones por término de búsqueda
export function filtrarEstaciones(estaciones: Estacion[], searchTerm: string): Estacion[] {
  if (!searchTerm.trim()) {
    return []
  }

  return estaciones.filter(
    (estacion) =>
      estacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      estacion.ubicacion.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}

// Función para validar selección de origen y destino
export function validarSeleccion(origen: number | null, destino: number | null): string | null {
  if (!origen || !destino) {
    return "Selecciona origen y destino"
  }

  if (origen === destino) {
    return "El origen y destino no pueden ser la misma estación"
  }

  return null
}

// Función para calcular tiempo estimado de viaje
export function calcularTiempoEstimado(cantidadRutas: number): number {
  return cantidadRutas * 10 - 5
}
