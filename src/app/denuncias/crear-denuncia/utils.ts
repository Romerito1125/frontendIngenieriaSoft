// Archivo de utilidades para crear denuncias

export interface CrearDenunciaData {
  idcuenta: number
  mensaje: string
  tipo: string
}

const API_BASE_URL = "https://serviciodenuncias.onrender.com/denuncias"

export async function crearDenuncia(data: CrearDenunciaData) {
  const apiUrl = `${API_BASE_URL}/crearDenuncia`
  console.log(`Creando denuncia para el usuario ID: ${data.idcuenta}`)

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. Por favor, intenta nuevamente más tarde.`)
  }

  return response.json()
}

export function validarFormulario(mensaje: string, userId: number | null) {
  if (!mensaje.trim()) {
    throw new Error("Por favor, describe el problema o incidente")
  }

  if (!userId) {
    throw new Error("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.")
  }
}
