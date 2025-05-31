// Archivo de utilidades para historial de denuncias

export interface Denuncia {
  iddenuncia: number
  idcuenta: number
  mensaje: string
  fecha: string
  estado: string
  tipo: string
  respuesta: string | null
}

const API_BASE_URL = "https://serviciodenuncias.onrender.com/denuncias"

export async function obtenerDenunciasUsuario(userId: number): Promise<Denuncia[]> {
  const apiUrl = `${API_BASE_URL}/listarDenunciasUsuario/${userId}`
  console.log(`Obteniendo denuncias para el usuario ID: ${userId}`)

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. Por favor, intenta nuevamente más tarde.`)
  }

  const data = await response.json()
  return data || []
}

export async function eliminarDenuncia(id: number): Promise<void> {
  const apiUrl = `${API_BASE_URL}/eliminarDenuncia/${id}`
  console.log(`Eliminando denuncia ID: ${id}`)

  const response = await fetch(apiUrl, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("No se pudo eliminar la denuncia. Por favor, intenta nuevamente.")
  }
}

export function formatearFecha(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}

export function obtenerColorEstado(status: string): string {
  switch (status.toLowerCase()) {
    case "pendiente":
      return "bg-yellow-100 text-yellow-800 border-yellow-300"
    case "procesada":
      return "bg-blue-100 text-blue-800 border-blue-300"
    case "cerrada":
      return "bg-green-100 text-green-800 border-green-300"
    default:
      return "bg-gray-100 text-gray-800 border-gray-300"
  }
}

export function obtenerEtiquetaTipo(type: string): string {
  switch (type.toLowerCase()) {
    case "conductor":
      return "Conductor"
    case "estacion":
      return "Estación"
    case "servicio":
      return "Servicio"
    default:
      return type
  }
}

export function filtrarDenuncias(denuncias: Denuncia[], searchTerm: string): Denuncia[] {
  return denuncias.filter(
    (denuncia) =>
      denuncia.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.estado.toLowerCase().includes(searchTerm.toLowerCase()),
  )
}
