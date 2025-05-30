const API_URL = "https://www.cuentas.devcorebits.com/cuenta"

type EnviarOtpPayload = {
  correo: string
  tipo: string
}

type VerificarOtpPayload = {
  correo: string
  otp: string
}

type ResetPasswordPayload = {
  correo: string
  nuevaContrasenia: string
}

export async function enviarOtp(data: EnviarOtpPayload) {
  const res = await fetch(`${API_URL}/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Error al enviar OTP")
  }

  return await res.json()
}

export async function verificarOtp(data: VerificarOtpPayload) {
  const res = await fetch(`${API_URL}/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("OTP inválido o expirado")
  }

  return await res.json()
}

export async function resetPassword(data: ResetPasswordPayload) {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const response = await res.json()
  if (!res.ok) {
    throw new Error(response.message || "Error al cambiar contraseña")
  }

  return response
}

export function evaluarFortaleza(password: string) {
  let puntaje = 0
  if (password.length >= 8) puntaje++
  if (/[A-Z]/.test(password)) puntaje++
  if (/[a-z]/.test(password)) puntaje++
  if (/[0-9]/.test(password)) puntaje++
  if (/[^A-Za-z0-9]/.test(password)) puntaje++
  return puntaje
}
