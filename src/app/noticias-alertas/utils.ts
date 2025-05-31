export interface Alerta {
  idalerta?: number
  tipo: string
  mensaje: string
  idruta: string
  idestacion: string
  prioridad: string
  hora: string
  icono?: string
  hace?: string
  color?: string
  nombreEstacion?: string
}

export interface Noticia {
  idnoticia: number
  titulo: string
  descripcion: string
  link?: string
  autor: string
  fecha: string
  tipo?: string
}

export interface Ruta {
  idruta: string
}

export interface Estacion {
  idestacion: string
  nombre: string
}

export interface FormDataAlerta {
  tipo: string
  mensaje: string
  idruta: string
  idestacion: string
  prioridad: string
}

export interface FormDataNoticia {
  titulo: string
  descripcion: string
  link: string
  autor: string
}


const API_BASE_URLS = {
  alertas: "https://www.api.devcorebits.com/alertasGateway/alertas",
  noticias: "https://www.api.devcorebits.com/noticiasGateway/noticias",
  tiempoReal: "https://www.api.devcorebits.com/tiemporealGateway",
} as const


/**
 * Obtiene una alerta específica por su ID
 * @param idAlerta - ID de la alerta a obtener
 * @returns Promise con los datos de la alerta
 */
export async function obtenerAlertaEspecifica(idAlerta: string): Promise<Alerta> {
  const apiUrl = `${API_BASE_URLS.alertas}/alertaEspecifica/${idAlerta}`
  console.log(`Obteniendo alerta ID: ${idAlerta}`)

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudo cargar la alerta.`)
  }

  const data: Alerta = await response.json()
  return data
}

/**
 * Obtiene todas las alertas del sistema
 * @returns Promise con array de alertas
 */
export async function obtenerTodasLasAlertas(): Promise<Alerta[]> {
  const apiUrl = `${API_BASE_URLS.alertas}/listarAlertas`
  console.log("Obteniendo todas las alertas")

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudieron cargar las alertas.`)
  }

  const data: Alerta[] = await response.json()
  return data || []
}

/**
 * Crea una nueva alerta en el sistema
 * @param alertaData - Datos de la alerta a crear
 * @returns Promise con la respuesta del servidor
 */
export async function crearAlerta(alertaData: FormDataAlerta): Promise<Response> {
  const apiUrl = `${API_BASE_URLS.alertas}/crearAlerta`
  console.log("Creando nueva alerta:", alertaData)

  const filteredData = {
    tipo: alertaData.tipo,
    mensaje: alertaData.mensaje,
    idruta: alertaData.idruta || null,
    idestacion: alertaData.idestacion || null,
    prioridad: alertaData.prioridad,
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(filteredData),
  })

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudo crear la alerta.`)
  }

  return response
}


/**
 * Obtiene una noticia específica por su ID
 * @param idNoticia - ID de la noticia a obtener
 * @returns Promise con los datos de la noticia
 */
export async function obtenerNoticiaEspecifica(idNoticia: string): Promise<Noticia> {
  const apiUrl = `${API_BASE_URLS.noticias}/getNoticiaId/${idNoticia}`
  console.log(`Obteniendo noticia ID: ${idNoticia}`)

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}`)
  }

  const text = await response.text()
  if (!text) {
    throw new Error("Respuesta vacía del servidor")
  }

  const data: Noticia = JSON.parse(text)
  return data
}

/**
 * Obtiene todas las noticias del sistema
 * @returns Promise con array de noticias
 */
export async function obtenerTodasLasNoticias(): Promise<Noticia[]> {
  const apiUrl = `${API_BASE_URLS.noticias}/listarNoticias`
  console.log("Obteniendo todas las noticias")

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudieron cargar las noticias.`)
  }

  const data: Noticia[] = await response.json()
  return data || []
}

/**
 * Crea una nueva noticia en el sistema
 * @param noticiaData - Datos de la noticia a crear
 * @returns Promise con la respuesta del servidor
 */
export async function crearNoticia(noticiaData: FormDataNoticia): Promise<Response> {
  const apiUrl = `${API_BASE_URLS.noticias}/crearNoticia`
  console.log("Creando nueva noticia:", noticiaData)

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticiaData),
  })

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudo crear la noticia.`)
  }

  return response
}

/**
 * Actualiza una noticia existente
 * @param idNoticia - ID de la noticia a actualizar
 * @param noticiaData - Nuevos datos de la noticia
 * @returns Promise con la noticia actualizada
 */
export async function actualizarNoticia(idNoticia: number, noticiaData: Partial<FormDataNoticia>): Promise<Noticia> {
  const apiUrl = `${API_BASE_URLS.noticias}/editarNoticia/${idNoticia}`
  console.log(`Actualizando noticia ID: ${idNoticia}`, noticiaData)

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noticiaData),
  })

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudo actualizar la noticia.`)
  }

  const data: Noticia = await response.json()
  return data
}

/**
 * Elimina una noticia del sistema
 * @param idNoticia - ID de la noticia a eliminar
 * @returns Promise con la respuesta del servidor
 */
export async function eliminarNoticia(idNoticia: number): Promise<Response> {
  const apiUrl = `${API_BASE_URLS.noticias}/eliminarNoticia/${idNoticia}`
  console.log(`Eliminando noticia ID: ${idNoticia}`)

  const response = await fetch(apiUrl, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudo eliminar la noticia.`)
  }

  return response
}


/**
 * Obtiene todas las rutas disponibles
 * @returns Promise con array de rutas
 */
export async function obtenerRutas(): Promise<Ruta[]> {
  const apiUrl = `${API_BASE_URLS.tiempoReal}/rutas`
  console.log("Obteniendo rutas")

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudieron cargar las rutas.`)
  }

  const data: Ruta[] = await response.json()
  return data || []
}

/**
 * Obtiene todas las estaciones disponibles
 * @returns Promise con array de estaciones
 */
export async function obtenerEstaciones(): Promise<Estacion[]> {
  const apiUrl = `${API_BASE_URLS.tiempoReal}/estaciones`
  console.log("Obteniendo estaciones")

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudieron cargar las estaciones.`)
  }

  const data: Estacion[] = await response.json()
  return data || []
}

/**
 * Obtiene una estación específica por su ID
 * @param idEstacion - ID de la estación a obtener
 * @returns Promise con los datos de la estación
 */
export async function obtenerEstacionPorId(idEstacion: string): Promise<Estacion> {
  const apiUrl = `${API_BASE_URLS.tiempoReal}/estaciones/${idEstacion}`
  console.log(`Obteniendo estación ID: ${idEstacion}`)

  const response = await fetch(apiUrl)

  if (!response.ok) {
    throw new Error(`Error del servidor: ${response.status}. No se pudo cargar la estación.`)
  }

  const data: Estacion = await response.json()
  return data
}


/**
 * Formatea la fecha y hora para mostrar en la UI
 * @param fecha - String de fecha/hora
 * @returns Fecha formateada en formato local español
 */
export function formatearFechaHora(fecha: string): string {
  try {
    return new Date(fecha).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return "Fecha no válida"
  }
}

/**
 * Formatea solo la fecha para mostrar en la UI
 * @param fecha - String de fecha
 * @returns Fecha formateada en formato local español
 */
export function formatearFecha(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return "Fecha no válida"
  }
}

/**
 * Formatea fecha en formato corto para tarjetas
 * @param fecha - String de fecha
 * @returns Fecha formateada en formato corto
 */
export function formatearFechaCorta(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error al formatear fecha:", error)
    return "Fecha no válida"
  }
}

/**
 * Obtiene los estilos CSS según la prioridad de la alerta
 * @param prioridad - Nivel de prioridad de la alerta
 * @returns Objeto con clases CSS para diferentes elementos
 */
export function obtenerEstilosPrioridad(prioridad: string) {
  switch (prioridad.toLowerCase()) {
    case "alta":
      return {
        border: "border-red-500",
        bg: "from-red-50 to-white",
        badge: "bg-red-600",
        icon: "text-red-600",
      }
    case "media":
      return {
        border: "border-orange-500",
        bg: "from-orange-50 to-white",
        badge: "bg-orange-500",
        icon: "text-orange-500",
      }
    default:
      return {
        border: "border-green-500",
        bg: "from-green-50 to-white",
        badge: "bg-green-500",
        icon: "text-green-600",
      }
  }
}

/**
 * Obtiene el icono correspondiente al tipo de noticia
 * @param tipo - Tipo de noticia
 * @returns Emoji del icono correspondiente
 */
export function obtenerIconoNoticia(tipo: string): string {
  switch (tipo.toLowerCase()) {
    case "urgente":
      return "🔥"
    case "evento":
      return "📅"
    default:
      return "📰"
  }
}

/**
 * Formatea el texto de prioridad para mostrar en español
 * @param prioridad - Prioridad en inglés o español
 * @returns Prioridad formateada en español
 */
export function formatearPrioridad(prioridad: string): string {
  switch (prioridad.toLowerCase()) {
    case "high":
    case "alta":
      return "Alta"
    case "medium":
    case "media":
      return "Media"
    case "low":
    case "baja":
      return "Baja"
    default:
      return prioridad.charAt(0).toUpperCase() + prioridad.slice(1).toLowerCase()
  }
}


/**
 * Valida los datos de una alerta antes de enviarlos
 * @param alertaData - Datos de la alerta a validar
 * @throws Error si los datos no son válidos
 */
export function validarDatosAlerta(alertaData: FormDataAlerta): void {
  if (!alertaData.tipo.trim()) {
    throw new Error("El tipo de alerta es requerido")
  }

  if (!alertaData.mensaje.trim()) {
    throw new Error("El mensaje de la alerta es requerido")
  }

  if (!alertaData.idestacion.trim()) {
    throw new Error("La estación es requerida")
  }

  if (!["alta", "media", "baja"].includes(alertaData.prioridad.toLowerCase())) {
    throw new Error("La prioridad debe ser alta, media o baja")
  }
}

/**
 * Valida los datos de una noticia antes de enviarlos
 * @param noticiaData - Datos de la noticia a validar
 * @throws Error si los datos no son válidos
 */
export function validarDatosNoticia(noticiaData: FormDataNoticia): void {
  if (!noticiaData.titulo.trim()) {
    throw new Error("El título de la noticia es requerido")
  }

  if (!noticiaData.descripcion.trim()) {
    throw new Error("La descripción de la noticia es requerida")
  }

  if (!noticiaData.autor.trim()) {
    throw new Error("El autor de la noticia es requerido")
  }

  if (noticiaData.link && noticiaData.link.trim() && !isValidUrl(noticiaData.link)) {
    throw new Error("El link debe ser una URL válida")
  }
}

/**
 * Valida si una cadena es una URL válida
 * @param url - URL a validar
 * @returns true si es válida, false en caso contrario
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Valida si una alerta tiene todos los campos requeridos
 * @param alerta - Objeto alerta a validar
 * @returns true si la alerta es válida, false en caso contrario
 */
export function validarAlerta(alerta: Alerta | null): boolean {
  if (!alerta) return false

  return !!(alerta.tipo && alerta.mensaje && alerta.idruta && alerta.idestacion && alerta.prioridad && alerta.hora)
}

/**
 * Valida si una noticia tiene todos los campos requeridos
 * @param noticia - Objeto noticia a validar
 * @returns true si la noticia es válida, false en caso contrario
 */
export function validarNoticia(noticia: Noticia | null): boolean {
  if (!noticia) return false

  return !!(noticia.titulo && noticia.descripcion && noticia.autor && noticia.fecha)
}


/**
 * Función de fetch con reintentos automáticos
 * @param url - URL a la que hacer fetch
 * @param options - Opciones de fetch
 * @param retries - Número de reintentos
 * @returns Promise con los datos obtenidos
 */
export async function fetchWithRetry(url: string, options?: RequestInit, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.warn(`Intento ${i + 1} fallido para ${url}:`, error)

      if (i === retries - 1) {
        throw error
      }

      // Esperar antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
}

/**
 * Trunca un texto a una longitud específica
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado con "..." si es necesario
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Capitaliza la primera letra de una cadena
 * @param str - Cadena a capitalizar
 * @returns Cadena con la primera letra en mayúscula
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Obtiene el nombre de estación con manejo de errores
 * @param idEstacion - ID de la estación
 * @returns Promise con el nombre de la estación o valor por defecto
 */
export async function obtenerNombreEstacionSeguro(idEstacion: string): Promise<string> {
  try {
    if (!idEstacion) return "Sin estación"

    const estacion = await obtenerEstacionPorId(idEstacion)
    return estacion?.nombre || "Sin estación"
  } catch (error) {
    console.warn(`No se pudo obtener estación ${idEstacion}:`, error)
    return "Sin estación"
  }
}

/**
 * Procesa alertas agregando información de estaciones
 * @param alertas - Array de alertas sin procesar
 * @returns Promise con alertas procesadas con nombres de estaciones
 */
export async function procesarAlertasConEstaciones(alertas: Alerta[]): Promise<Alerta[]> {
  return Promise.all(
    alertas.map(async (alerta) => {
      const nombreEstacion = await obtenerNombreEstacionSeguro(alerta.idestacion)
      return {
        ...alerta,
        nombreEstacion,
      }
    }),
  )
}
