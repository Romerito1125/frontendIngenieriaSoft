// Archivo de utilidades para administración de denuncias

export interface Denuncia {
  iddenuncia: number
  idcuenta: number
  mensaje: string
  fecha: string
  estado: string
  tipo: string
  respuesta: string | null
}

export interface RespuestaData {
  respuesta: string
}

const API_BASE_URL = "https://serviciodenuncias.onrender.com/denuncias"

export async function obtenerTodasLasDenuncias(): Promise<Denuncia[]> {
  const apiUrl = `${API_BASE_URL}/listarTodas`
  console.log("Obteniendo todas las denuncias para administrador")

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. Por favor, intenta nuevamente más tarde.`)
  }

  const data = await response.json()
  return data || []
}

export async function responderDenuncia(iddenuncia: number, idcuenta: number, respuesta: string): Promise<void> {
  const apiUrl = `${API_BASE_URL}/contestar/${iddenuncia}/${idcuenta}`
  console.log(`Respondiendo denuncia ID: ${iddenuncia} para cuenta: ${idcuenta}`)

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ respuesta: respuesta.trim() }),
  })

  if (!response.ok) {
    throw new Error("No se pudo enviar la respuesta. Por favor, intenta nuevamente.")
  }
}

export function formatearFechaCompleta(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export function filtrarDenunciasAdmin(
  denuncias: Denuncia[],
  searchTerm: string,
  filterStatus: string,
  filterType: string,
): Denuncia[] {
  return denuncias.filter((denuncia) => {
    const matchesSearch =
      denuncia.mensaje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      denuncia.iddenuncia.toString().includes(searchTerm) ||
      denuncia.idcuenta.toString().includes(searchTerm)

    const matchesStatus = filterStatus === "todas" || denuncia.estado.toLowerCase() === filterStatus
    const matchesType = filterType === "todos" || denuncia.tipo.toLowerCase() === filterType

    return matchesSearch && matchesStatus && matchesType
  })
}

export function calcularEstadisticas(denuncias: Denuncia[]) {
  return {
    total: denuncias.length,
    pendientes: denuncias.filter((d) => d.estado.toLowerCase() === "pendiente").length,
    procesadas: denuncias.filter((d) => d.estado.toLowerCase() === "procesada").length,
    cerradas: denuncias.filter((d) => d.estado.toLowerCase() === "cerrada").length,
  }
}

export function validarRespuesta(respuesta: string): void {
  if (!respuesta || !respuesta.trim()) {
    throw new Error("Por favor, escribe una respuesta")
  }
}
