// utils.ts
export type Ruta = {
  idruta: string;
  LugarInicio: string;
  LugarFin: string;
  horariolunvier: string;
  horariofinsem: string;
};

export type Estacion = {
  idestacion: number;
  nombre: string;
  zona: string;
};

const BASE_URL = "https://www.api.devcorebits.com/tiemporealGateway";

export const obtenerRuta = async (idRuta: string): Promise<Ruta> => {
  const res = await fetch(`${BASE_URL}/rutas/${idRuta}`);
  if (!res.ok) throw new Error("Error al obtener ruta");
  return res.json();
};

export const obtenerRecorrido = async (idRuta: string): Promise<{ idestacion: number; nombre: string }[]> => {
  const res = await fetch(`${BASE_URL}/sim/recorrido/${idRuta}`);
  if (!res.ok) throw new Error("Error al obtener recorrido");
  return res.json();
};

export const obtenerZonaEstacion = async (idestacion: number): Promise<string> => {
  const res = await fetch(`${BASE_URL}/estaciones/${idestacion}`);
  if (!res.ok) throw new Error("Error al obtener zona de estación");
  const data = await res.json();
  return data.zona;
};
