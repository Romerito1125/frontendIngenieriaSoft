import { createClient } from "@supabase/supabase-js"
import Cookies from "js-cookie"

export const supabase = createClient(
  "https://vrhudhgvjtcbebdnpftb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaHVkaGd2anRjYmViZG5wZnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDE5NjMsImV4cCI6MjA1NTc3Nzk2M30.aOBYppQ4VC1w9_uM0wRc1LAuWw8n4qM-e2vLidALmJM",
)
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.api.devcorebits.com/forosGateway"

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
    const data = await res.json()
    return data
  } catch (error) {
    console.error(`Error en obtenerForosUsuario(${idUsuario}):`, error)
    throw error
  }
}

// Nueva función para obtener foros del usuario CON cantidad de respuestas
export async function obtenerForosUsuarioConRespuestas(idUsuario: string) {
  try {
    // Primero obtenemos los foros básicos
    const foros = await obtenerForosUsuario(idUsuario)

    // Luego obtenemos la cantidad de respuestas para cada foro
    const forosConRespuestas = await Promise.all(
      foros.map(async (foro: any) => {
        try {
          const cantidadRespuestas = await obtenerCantidadRespuestas(foro.idforo)
          return {
            ...foro,
            cantidadRespuestas,
            respuestas_foro: Array(cantidadRespuestas).fill({ idrespuesta: "placeholder" }), // Para compatibilidad
          }
        } catch (error) {
          console.warn(`No se pudo obtener respuestas para foro ${foro.idforo}:`, error)
          return {
            ...foro,
            cantidadRespuestas: 0,
            respuestas_foro: [],
          }
        }
      }),
    )

    return forosConRespuestas
  } catch (error) {
    console.error(`Error en obtenerForosUsuarioConRespuestas(${idUsuario}):`, error)
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
      let errorData
      try {
        errorData = await res.json()
        console.error("Error detalle:", errorData)
      } catch (parseError) {
        console.error("No se pudo parsear error del servidor:", parseError)
        errorData = { message: `Error ${res.status}: ${res.statusText}` }
      }
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
      let errorData
      try {
        errorData = await res.json()
        console.error("Error al actualizar foro:", errorData)
      } catch (parseError) {
        console.error("No se pudo parsear error del servidor:", parseError)
        errorData = { message: `Error ${res.status}: ${res.statusText}` }
      }
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
      let errorData
      try {
        errorData = await res.json()
        console.error("Error al eliminar foro:", errorData)
      } catch (parseError) {
        console.error("No se pudo parsear error del servidor:", parseError)
        errorData = { message: `Error ${res.status}: ${res.statusText}` }
      }
      throw new Error("Error al eliminar foro")
    }

    return true
  } catch (error) {
    console.error(`Error en eliminarForo(${id}):`, error)
    throw error
  }
}

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

// Tipos para el árbol de respuestas
export type NodoRespuesta = {
  valor: {
    idrespuesta: string
    idcuenta: string | number
    mensaje: string
    fecha: string
    nombreUsuario?: string
    cuentas?: { nombre?: string }
    idrespuesta_padre?: string
  }
  hijos: NodoRespuesta[]
}

// Función para convertir respuestas planas a estructura de árbol básica
function convertirRespuestasAArbol(respuestas: any[]): NodoRespuesta[] {
  return respuestas.map((respuesta) => ({
    valor: {
      idrespuesta: respuesta.idrespuesta,
      idcuenta: respuesta.idcuenta,
      mensaje: respuesta.mensaje,
      fecha: respuesta.fecha,
      nombreUsuario: respuesta.nombreUsuario || respuesta.cuentas?.nombre,
      cuentas: respuesta.cuentas,
      idrespuesta_padre: respuesta.idrespuesta_padre || null,
    },
    hijos: [],
  }))
}

export async function listarRespuestasArbol(idForo: string): Promise<NodoRespuesta[]> {

  try {
    // Intentar primero el endpoint de árbol
    const res = await fetch(`${BASE_URL}/foro/respuestas/arbol/${idForo}`)

    if (!res.ok) {

      // Fallback: usar respuestas planas y convertirlas
      const respuestasPlanas = await listarRespuestas(idForo)
      return convertirRespuestasAArbol(respuestasPlanas)
    }

    const arbol = await res.json()
    return arbol
  } catch (error: unknown) {
    console.error("Error al listar árbol de respuestas:", error)

    // Fallback final: usar respuestas planas
    try {
      const respuestasPlanas = await listarRespuestas(idForo)
      return convertirRespuestasAArbol(respuestasPlanas)
    } catch (fallbackError) {
      console.error("Error en fallback:", fallbackError)
      throw new Error("No se pudieron cargar las respuestas")
    }
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
      let errorData = { message: `Error ${res.status}: ${res.statusText}` }
      try {
        errorData = await res.json()
        console.log("Error data del servidor (JSON):", errorData)
      } catch (parseError) {
        console.log("No se pudo parsear error del servidor, intentando como texto")
        try {
          const textError = await res.text()
          console.log("Respuesta como texto:", textError)
          errorData = { message: `Error ${res.status}: ${textError}` }
        } catch (textParseError) {
          console.log("No se pudo leer respuesta como texto:", textParseError)
          errorData = { message: `Error ${res.status}: No se pudo leer la respuesta del servidor` }
        }
      }

      console.error("Error al crear respuesta:", errorData)
      throw new Error(errorData.message || "Error al crear respuesta")
    }

    const result = await res.json()
    console.log("Resultado completo:", result)
    return result
  } catch (error: unknown) {
    console.error("Error completo en crearRespuesta(" + idForo + "):", error)
    if (error instanceof Error) {
      console.log("Stack trace:", error.stack)
    }
    throw error
  }
}

export async function crearReplica(
  idForo: string,
  data: { mensaje: string; idcuenta: string; idrespuesta_padre: string },
) {

  try {
    const res = await fetch(`${BASE_URL}/foro/replicar/${idForo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      let errorData = { message: `Error ${res.status}: ${res.statusText}` }
      try {
        errorData = await res.json()
        console.log("Error data del servidor (JSON):", errorData)
      } catch (parseError) {
        console.log("No se pudo parsear error del servidor, intentando como texto")
        try {
          const textError = await res.text()
          console.log("Respuesta como texto:", textError)
          errorData = { message: `Error ${res.status}: ${textError}` }
        } catch (textParseError) {
          console.log("No se pudo leer respuesta como texto:", textParseError)
          errorData = { message: `Error ${res.status}: No se pudo leer la respuesta del servidor` }
        }
      }

      // Si el endpoint no existe (404), usar el endpoint de respuesta normal
      if (res.status === 404) {
        console.log("Endpoint de réplica no disponible, usando respuesta normal como fallback")
        return await crearRespuesta(idForo, {
          mensaje: data.mensaje,
          idcuenta: data.idcuenta,
        })
      }

      console.error("Error al crear réplica:", errorData)
      throw new Error(errorData.message || "Error al crear réplica")
    }

    const result = await res.json()
    console.log("Resultado completo:", result)
    return result
  } catch (error: unknown) {
    console.error("Error completo en crearReplica(" + idForo + "):", error)
    if (error instanceof Error) {
      console.log("Stack trace:", error.stack)
    }
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

    console.log("Response status:", res.status)
    console.log("Response ok:", res.ok)

    if (!res.ok) {
      let errorData = { message: `Error ${res.status}: ${res.statusText}` }
      try {
        errorData = await res.json()
        console.error("Error data del servidor:", errorData)
      } catch (parseError) {
        console.error("No se pudo parsear error del servidor:", parseError)
        try {
          const textError = await res.text()
          console.error("Respuesta como texto:", textError)
          errorData = { message: `Error ${res.status}: ${textError}` }
        } catch (textParseError) {
          console.error("No se pudo leer respuesta como texto:", textParseError)
          errorData = { message: `Error ${res.status}: No se pudo leer la respuesta del servidor` }
        }
      }
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
    console.log("=== ELIMINAR RESPUESTA DEBUG ===")
    console.log("Eliminando respuesta:", id)

    // Obtener el ID del usuario actual
    const idUsuario = getCurrentUserId()
    if (!idUsuario) {
      throw new Error("Usuario no autenticado")
    }

    console.log("Usuario autenticado:", idUsuario)

    // El backend espera idcuenta en el body según el controller
    const requestData = {
      idcuenta: idUsuario,
    }

    console.log("URL:", `${BASE_URL}/foro/respuesta/eliminar/${id}`)
    console.log("Data enviada:", requestData)

    const res = await fetch(`${BASE_URL}/foro/respuesta/eliminar/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestData),
    })

    console.log("Response status:", res.status)
    console.log("Response ok:", res.ok)

    if (!res.ok) {
      let errorData = { message: `Error ${res.status}: ${res.statusText}` }
      try {
        errorData = await res.json()
        console.error("Error data del servidor:", errorData)
      } catch (parseError) {
        console.error("No se pudo parsear error del servidor:", parseError)
        try {
          const textError = await res.text()
          console.error("Respuesta como texto:", textError)
          errorData = { message: `Error ${res.status}: ${textError}` }
        } catch (textParseError) {
          console.error("No se pudo leer respuesta como texto:", textParseError)
          errorData = { message: `Error ${res.status}: No se pudo leer la respuesta del servidor` }
        }
      }

      console.error("Error al eliminar respuesta:", errorData)
      throw new Error(errorData.message || "Error al eliminar respuesta y sus réplicas")
    }

    const result = await res.json()
    console.log("Resultado completo:", result)
    return true
  } catch (error: unknown) {
    console.error(`Error en eliminarRespuesta(${id}):`, error)
    if (error instanceof Error) {
      console.log("Stack trace:", error.stack)
    }
    throw error
  }
}

export async function obtenerCantidadRespuestas(idForo: string) {
  try {
    const res = await fetch(`${BASE_URL}/foro/cantidadRespuestas/${idForo}`)
    if (!res.ok) {
      // Si el endpoint no existe, intentar contar manualmente
      if (res.status === 404) {
        try {
          const respuestas = await listarRespuestas(idForo)
          return Array.isArray(respuestas) ? respuestas.length : 0
        } catch (fallbackError) {
          console.warn(`No se pudo contar respuestas para foro ${idForo}:`, fallbackError)
          return 0
        }
      }
      throw new Error("Error al contar respuestas")
    }

    const data = await res.json()

    // Manejar diferentes estructuras de respuesta del API
    if (data === null || data === undefined) {
      console.warn(`API devolvió null para foro ${idForo}, usando fallback`)
      try {
        const respuestas = await listarRespuestas(idForo)
        return Array.isArray(respuestas) ? respuestas.length : 0
      } catch (fallbackError) {
        console.warn(`Fallback falló para foro ${idForo}:`, fallbackError)
        return 0
      }
    }

    // Si es un array, devolver su longitud
    if (Array.isArray(data)) {
      return data.length
    }

    // Si tiene propiedad count
    if (data && typeof data.count === "number") {
      return data.count
    }

    // Si tiene propiedad cantidad
    if (data && typeof data.cantidad === "number") {
      return data.cantidad
    }

    // Si es un número directamente
    if (typeof data === "number") {
      return data
    }

    // Si es un objeto, intentar contar sus propiedades
    if (data && typeof data === "object") {
      const keys = Object.keys(data)
      if (keys.length > 0) {
        return keys.length
      }
    }

    // Si llegamos aquí, usar fallback manual
    console.warn(`Estructura de datos inesperada para foro ${idForo}:`, data)
    try {
      const respuestas = await listarRespuestas(idForo)
      return Array.isArray(respuestas) ? respuestas.length : 0
    } catch (fallbackError) {
      console.warn(`Fallback final falló para foro ${idForo}:`, fallbackError)
      return 0
    }
  } catch (error) {
    console.warn(`Error al obtener cantidad de respuestas para foro ${idForo}:`, error)

    // Último intento: usar listarRespuestas como fallback
    try {
      const respuestas = await listarRespuestas(idForo)
      return Array.isArray(respuestas) ? respuestas.length : 0
    } catch (fallbackError) {
      console.warn(`Fallback de emergencia falló para foro ${idForo}:`, fallbackError)
      return 0
    }
  }
}

//#endregion
