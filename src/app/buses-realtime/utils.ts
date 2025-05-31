// utils.ts
import axios from "axios";

export interface Estacion {
  idestacion: number;
  nombre: string;
  lat: number;
  lon: number;
}

export interface Bus {
  idbus: number;
  idruta: string;
  lat: number;
  lon: number;
  enVuelta: boolean;
  destino: string;
}

export interface TiempoEstacionBus {
  idbus: number;
  idruta: string;
  tiempo: string;
  destino: string;
}

export interface Ruta {
  idruta: string;
}

const BASE_URL = "https://www.api.devcorebits.com/tiemporealGateway";

export const iniciarSimulacion = async (idruta: string): Promise<void> => {
  await axios.post(`${BASE_URL}/sim/inicio`, { idruta });
};

export const obtenerEstaciones = async (idruta: string): Promise<Estacion[]> => {
  const { data } = await axios.get(`${BASE_URL}/sim/recorrido/${idruta}`);
  return data;
};

export const obtenerBuses = async (rutaActiva: string): Promise<Bus[]> => {
  const { data } = await axios.get(`${BASE_URL}/sim/buses/${rutaActiva}`);
  return data;
};

export const obtenerTiempoEstacion = async (idestacion: number): Promise<TiempoEstacionBus[]> => {
  const { data } = await axios.get(`${BASE_URL}/sim/tiempo-llegada/${idestacion}`);
  return data;
};

export const obtenerRutasDisponibles = async (): Promise<Ruta[]> => {
  const { data } = await axios.get(`${BASE_URL}/rutas`);
  return data;
};
