//Zuluaga


// auth-service.ts - Compatible con tu sistema JWT actual
import Cookies from "js-cookie"

// Interfaces para tipado
interface DecodedToken {
  userId: string
  correo: string
  iat?: number
  exp?: number
}

type Usuario = {
  idcuenta: string
  email: string
  nombre: string
}

// Función para decodificar el JWT sin dependencias externas
function decodeToken(token: string): DecodedToken | null {
  try {
    // Extraer el payload del JWT
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    return JSON.parse(jsonPayload) as DecodedToken
  } catch (error) {
    console.error("Error decodificando token:", error)
    return null
  }
}

export function isAuthenticated(): boolean {
  return !!Cookies.get("token")
}

export function getCurrentUser(): Usuario | null {
  const token = Cookies.get("token")
  if (!token) return null

  const decoded = decodeToken(token)
  if (!decoded) return null

  return {
    idcuenta: decoded.userId,
    email: decoded.correo,
    nombre: decoded.correo.split("@")[0], // Como fallback usamos parte del correo como nombre
  }
}

export function getCurrentUserId(): string | null {
  const user = getCurrentUser()
  return user?.idcuenta || null
}

export function isOwner(recursoIdCuenta: string): boolean {
  const userId = getCurrentUserId()
  if (!userId || !recursoIdCuenta) return false
  return String(userId) === String(recursoIdCuenta)
}
