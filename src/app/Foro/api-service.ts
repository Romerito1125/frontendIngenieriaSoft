import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://vrhudhgvjtcbebdnpftb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaHVkaGd2anRjYmViZG5wZnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMDE5NjMsImV4cCI6MjA1NTc3Nzk2M30.aOBYppQ4VC1w9_uM0wRc1LAuWw8n4qM-e2vLidALmJM'
);
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://servicioforo.onrender.com"

//#region -- FOROS --

export async function listarForos() {
  const res = await fetch(`${BASE_URL}/foro/listarForos`)
  if (!res.ok) throw new Error("Error al listar foros")
  return res.json()
}

export async function obtenerForo(id: string) {
  const res = await fetch(`${BASE_URL}/foro/listarForo/${id}`)
  if (!res.ok) throw new Error("Foro no encontrado")
  return res.json()
}

export async function crearForo(data: {
  titulo: string
  descripcion: string
  idcuenta: string
}) {
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
}

export async function actualizarForo(id: string, data: { titulo: string; descripcion: string }) {
  const res = await fetch(`${BASE_URL}/foro/actualizarForo/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al actualizar foro")
  return res.json()
}

export async function eliminarForo(id: string) {
  const res = await fetch(`${BASE_URL}/foro/eliminarForo/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al eliminar foro")
}

//#endregion

//#region -- RESPUESTAS --

export async function listarRespuestas(idForo: string) {
  const res = await fetch(`${BASE_URL}/foro/respuestas/${idForo}`)
  if (!res.ok) throw new Error("Error al listar respuestas")
  return res.json()
}

export async function crearRespuesta(idForo: string, data: { mensaje: string; idcuenta: string }) {
  const res = await fetch(`${BASE_URL}/foro/responder/${idForo}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al crear respuesta")
  return res.json()
}

export async function actualizarRespuesta(id: string, data: { mensaje: string }) {
  const res = await fetch(`${BASE_URL}/foro/respuesta/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al actualizar respuesta")
  return res.json()
}

export async function eliminarRespuesta(id: string) {
  const res = await fetch(`${BASE_URL}/foro/respuesta/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al eliminar respuesta")
}

export async function obtenerCantidadRespuestas(idForo: string) {
  const res = await fetch(`${BASE_URL}/foro/cantidadRespuestas/${idForo}`);
  if (!res.ok) throw new Error("Error al contar respuestas");

  const data = await res.json();

  if (!data || typeof data.count !== "number") {
    console.warn("⚠️ La respuesta no tiene 'count':", data);
    return 0;
  }

  return data.count;
}


//#endregion
