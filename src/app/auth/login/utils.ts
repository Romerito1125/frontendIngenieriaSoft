// Archivo de utilidades para la autenticación

type LoginPayload = {
  correo: string
  contrasenia: string
}

const API_URL = "https://www.api.devcorebits.com/cuentasGateway/cuenta"

export async function loginUsuario(data: LoginPayload) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const responseText = await res.text()

  if (!res.ok) {
      throw new Error("Credenciales inválidas")
  }

  return JSON.parse(responseText) // { token }
}
