//Zuluaga

import { createClient } from "@supabase/supabase-js"
import Cookies from "js-cookie"

export const supabase = createClient(
  "https://vrhudhgvjtcbebdnpftb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaHVkaGd2anRjYmViZG5wZnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDE5NjMsImV4cCI6MjA1NTc3Nzk2M30.aOBYppQ4VC1w9_uM0wRc1LAuWw8n4qM-e2vLidALmJM",
)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://servicioforo.onrender.com"

// Función para obtener el ID del usuario actual desde el token
function getCurrentUserId() {
  const token = Cookies.get("token")
  if (!token) return null

  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    const decoded = JSON.parse(jsonPayload)
    return decoded.userId
  } catch (error) {
    console.error("Error decodificando token:", error)
    return null
  }
}

//#region -- FOROS --

export async function listarForos() {
  try {
    const res = await fetch(`${BASE_URL}/foro/listarForos`)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al listar foros:", errorData)
      throw new Error("Error al listar foros")
    }
    return res.json()
  } catch (error) {
    console.error("Error en listarForos:", error)
    throw error
  }
}

export async function obtenerForo(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/foro/listarForo/${id}`)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al obtener foro:", errorData)
      throw new Error("Foro no encontrado")
    }
    return res.json()
  } catch (error) {
    console.error(`Error en obtenerForo(${id}):`, error)
    throw error
  }
}

export async function obtenerForosUsuario(idUsuario: string) {
  try {
    const res = await fetch(`${BASE_URL}/foro/listarForoCuenta/${idUsuario}`)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al obtener foros del usuario:", errorData)
      throw new Error("Error al obtener foros del usuario")
    }
    return res.json()
  } catch (error) {
    console.error(`Error en obtenerForosUsuario(${idUsuario}):`, error)
    throw error
  }
}

export async function crearForo(data: {
  titulo: string
  descripcion: string
  idcuenta: string
}) {
  try {
    const res = await fetch(`${BASE_URL}/foro/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error detalle:", errorData)
      throw new Error("Error al crear foro")
    }

    const result = await res.json()
    if (!result?.data?.[0]) {
      console.error("Resultado inesperado en crearForo:", result)
      throw new Error("Foro creado sin datos válidos")
    }

    return result.data[0]
  } catch (error) {
    console.error("Error en crearForo:", error)
    throw error
  }
}

export async function actualizarForo(id: string, data: { titulo: string; descripcion: string }) {
  try {
    const res = await fetch(`${BASE_URL}/foro/actualizarForo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al actualizar foro:", errorData)
      throw new Error("Error al actualizar foro")
    }

    return res.json()
  } catch (error) {
    console.error(`Error en actualizarForo(${id}):`, error)
    throw error
  }
}

export async function eliminarForo(id: string) {
  try {
    const res = await fetch(`${BASE_URL}/foro/eliminarForo/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al eliminar foro:", errorData)
      throw new Error("Error al eliminar foro")
    }

    return true
  } catch (error) {
    console.error(`Error en eliminarForo(${id}):`, error)
    throw error
  }
}

//#endregion

//#region -- RESPUESTAS --

export async function listarRespuestas(idForo: string) {
  try {
    const res = await fetch(`${BASE_URL}/foro/respuestas/traerRespuestas/${idForo}`)
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al listar respuestas:", errorData)
      throw new Error("Error al listar respuestas")
    }
    return res.json()
  } catch (error) {
    console.error(`Error en listarRespuestas(${idForo}):`, error)
    throw error
  }
}

export async function crearRespuesta(idForo: string, data: { mensaje: string; idcuenta: string }) {
  try {
    const res = await fetch(`${BASE_URL}/foro/responder/${idForo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al crear respuesta:", errorData)
      throw new Error("Error al crear respuesta")
    }

    return res.json()
  } catch (error) {
    console.error(`Error en crearRespuesta(${idForo}):`, error)
    throw error
  }
}

export async function actualizarRespuesta(id: string, data: { mensaje: string }) {
  try {
    console.log("Actualizando respuesta:", id, data)

    // Obtener el ID del usuario actual
    const idUsuario = getCurrentUserId()
    if (!idUsuario) {
      throw new Error("Usuario no autenticado")
    }

    // El backend espera idcuenta en el body según el controller
    const requestData = {
      mensaje: data.mensaje,
      idcuenta: idUsuario,
    }

    const res = await fetch(`${BASE_URL}/foro/respuesta/actualizar/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al actualizar respuesta:", errorData)
      throw new Error(errorData.message || "Error al actualizar respuesta")
    }

    return res.json()
  } catch (error) {
    console.error(`Error en actualizarRespuesta(${id}):`, error)
    throw error
  }
}

export async function eliminarRespuesta(id: string) {
  try {
    console.log("Eliminando respuesta:", id)

    // Obtener el ID del usuario actual
    const idUsuario = getCurrentUserId()
    if (!idUsuario) {
      throw new Error("Usuario no autenticado")
    }

    // El backend espera idcuenta en el body según el controller
    const requestData = {
      idcuenta: idUsuario,
    }

    const res = await fetch(`${BASE_URL}/foro/respuesta/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      console.error("Error al eliminar respuesta:", errorData)
      throw new Error(errorData.message || "Error al eliminar respuesta")
    }

    return true
  } catch (error) {
    console.error(`Error en eliminarRespuesta(${id}):`, error)
    throw error
  }
}

export async function obtenerCantidadRespuestas(idForo: string) {
  const res = await fetch(`${BASE_URL}/foro/cantidadRespuestas/${idForo}`)
  if (!res.ok) throw new Error("Error al contar respuestas")
  const data = await res.json()

  // Si data es array, devuelve su longitud
  if (Array.isArray(data)) {
    return data.length
  }

  // Si data tiene 'count', úsalo
  if (typeof data.count === "number") {
    return data.count
  }

  // Si data es un objeto con keys, cuenta las keys
  if (data && typeof data === "object") {
    return Object.keys(data).length
  }

  // Si nada coincide, retorna 0 por defecto
  return 0
}

//#endregion
