type RegisterPayload = {
  nombre: string
  apellido: string
  correo: string
  contrasenia: string
}

const API_URL = "https://www.api.devcorebits.com/cuentasGateway/cuenta"

export async function registerUsuario(data: RegisterPayload) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseText = await res.text()

  if (!res.ok) {
    try {
      const json = JSON.parse(responseText)
      throw new Error(json.message || "Error al registrar usuario")
    } catch {
      throw new Error("Respuesta inesperada del servidor")
    }
  }

  return JSON.parse(responseText) // { token }
}
