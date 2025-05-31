export interface EnviarOtpParams {
  correo: string
  tipo: "cambio" | "eliminacion" | "actualizacion" | "recuperacion"
}

export interface VerificarOtpParams {
  correo: string
  otp: string
}

export interface CambiarPasswordParams {
  correo: string
  nuevaContrasenia: string
}

export interface ActualizarCuentaParams {
  correo: string
  otp: string
  nombre: string
  apellido: string
}

export interface EliminarCuentaParams {
  correo: string
  cuentaId?: number
}

// Función para enviar OTP
export const enviarOtp = async ({ correo, tipo }: EnviarOtpParams): Promise<any> => {
  console.log(`🚀 Iniciando envío de OTP para ${tipo}...`)
  console.log("Correo:", correo)

  if (!correo || correo.trim() === "") {
    throw new Error("Error: Correo no disponible")
  }

  const response = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: correo.trim(), tipo }),
  })

  const data = await response.json()
  console.log("📥 Respuesta del servidor:", data)

  if (!response.ok) {
    throw new Error(data.message || "Error al enviar OTP")
  }

  return data
}

// Función para verificar OTP
export const verificarOtp = async ({ correo, otp }: VerificarOtpParams): Promise<any> => {
  console.log("🔐 Verificando OTP...")
  console.log("OTP ingresado:", otp)
  console.log("Correo:", correo)

  if (!correo || correo.trim() === "") {
    throw new Error("Error: Correo no disponible")
  }

  if (!otp || otp.length !== 6) {
    throw new Error("Ingresa el código OTP completo")
  }

  const response = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: correo.trim(), otp }),
  })

  const data = await response.json()
  console.log("📥 Respuesta verificación OTP:", data)

  if (!response.ok) {
    throw new Error(data.message || "OTP inválido o expirado")
  }

  return data
}

// Función para cambiar contraseña
export const cambiarPassword = async ({ correo, nuevaContrasenia }: CambiarPasswordParams): Promise<any> => {
  console.log("🔄 Iniciando cambio de contraseña...")
  console.log("Correo:", correo)

  if (!correo || typeof correo !== "string" || correo.trim() === "") {
    throw new Error("Error: Correo no válido")
  }

  if (!nuevaContrasenia || typeof nuevaContrasenia !== "string" || nuevaContrasenia.trim() === "") {
    throw new Error("La nueva contraseña es requerida")
  }

  const payload = {
    correo: correo.trim(),
    nuevaContrasenia: nuevaContrasenia.trim(),
  }

  const response = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/cambiar-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  console.log("📥 Respuesta cambio contraseña:", data)

  if (!response.ok) {
    throw new Error(data.message || "Error al cambiar la contraseña")
  }

  return data
}

// Función para actualizar cuenta con OTP
export const actualizarCuentaConOtp = async ({
  correo,
  otp,
  nombre,
  apellido,
}: ActualizarCuentaParams): Promise<any> => {
  console.log("🔄 Iniciando actualización de cuenta...")

  if (!correo || typeof correo !== "string" || correo.trim() === "") {
    throw new Error("Error: Correo no válido")
  }

  if (!nombre || !apellido) {
    throw new Error("Todos los campos son obligatorios")
  }

  const payload = {
    correo: correo.trim(),
    otp,
    nombre: nombre.trim(),
    apellido: apellido.trim(),
  }

  const response = await fetch("https://www.api.devcorebits.com/cuentasGateway/cuenta/actualizar-con-otp", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  console.log("📥 Respuesta actualización:", data)

  if (!response.ok) {
    if (data.message && data.message.includes("OTP")) {
      throw new Error("El código OTP ha expirado. Solicita uno nuevo.")
    }
    throw new Error(data.message || "Error al actualizar la información")
  }

  return data
}

// Función para eliminar cuenta
export const eliminarCuenta = async ({ correo, cuentaId }: EliminarCuentaParams): Promise<any> => {
  console.log("🗑️ Iniciando eliminación de cuenta...")
  console.log("Correo:", correo)

  let idCuenta = cuentaId

  if (!idCuenta) {
    // Intentar obtener el ID desde el JWT
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        idCuenta = payload.userId
        console.log("📥 ID obtenido del token:", idCuenta)
      } catch (e) {
        console.error("Error decodificando token:", e)
      }
    }

    if (!idCuenta) {
      throw new Error("No se pudo identificar la cuenta para eliminar")
    }
  }

  const response = await fetch(`https://www.api.devcorebits.com/cuentasGateway/cuenta/eliminar/${idCuenta}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })

  const data = await response.json()
  console.log("📥 Respuesta eliminación:", data)

  if (!response.ok) {
    throw new Error(data?.message || "Ocurrió un error inesperado")
  }

  return data
}

// Función para evaluar fortaleza de contraseña
export const evaluarFortaleza = (password: string): number => {
  let puntaje = 0

  if (password.length >= 8) puntaje++
  if (/[A-Z]/.test(password)) puntaje++
  if (/[a-z]/.test(password)) puntaje++
  if (/[0-9]/.test(password)) puntaje++
  if (/[^A-Za-z0-9]/.test(password)) puntaje++

  return puntaje
}

// Función para obtener texto de fortaleza
export const obtenerTextoFortaleza = (fortaleza: number): string => {
  switch (fortaleza) {
    case 0:
      return "Muy débil"
    case 1:
      return "Débil"
    case 2:
      return "Moderada"
    case 3:
      return "Buena"
    case 4:
      return "Fuerte"
    case 5:
      return "Muy fuerte"
    default:
      return "Muy débil"
  }
}

// Función para obtener color de fortaleza
export const obtenerColorFortaleza = (fortaleza: number): string => {
  if (fortaleza <= 1) return "bg-red-500"
  if (fortaleza <= 2) return "bg-orange-500"
  if (fortaleza <= 3) return "bg-yellow-500"
  if (fortaleza <= 4) return "bg-green-500"
  return "bg-emerald-500"
}

// Función para validar contraseñas
export const validarPasswords = (nueva: string, confirmar: string, fortaleza: number): string | null => {
  if (!nueva || typeof nueva !== "string" || nueva.trim() === "") {
    return "La nueva contraseña es requerida"
  }

  if (!confirmar || typeof confirmar !== "string" || confirmar.trim() === "") {
    return "Confirmar contraseña es requerido"
  }

  if (nueva !== confirmar) {
    return "Las contraseñas no coinciden"
  }

  if (fortaleza < 3) {
    return "La contraseña debe ser más fuerte"
  }

  return null
}

// Función para cargar datos de cuenta
export const cargarCuenta = async (userId: number): Promise<any> => {
  const response = await fetch(`https://www.api.devcorebits.com/cuentasGateway/cuenta/getCuenta/${userId}`)

  if (!response.ok) {
    throw new Error("Error al cargar la cuenta")
  }

  const data = await response.json()

  if (!data.nombre) {
    throw new Error("Error cargando información de la cuenta")
  }

  return data
}

// Función para manejar errores de forma consistente
export const manejarError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return "Error desconocido"
}

// Función para limpiar cookies y redirigir
export const cerrarSesionYRedirigir = (ruta = "/auth/login"): void => {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
  setTimeout(() => (window.location.href = ruta), 2000)
}
