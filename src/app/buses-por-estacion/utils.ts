// utils.ts
import axios from "axios";

export interface Bus {
  idbus: number;
  ruta: string;
  tiempo_estimado_min: number;
}

export interface EstacionConBuses {
  idestacion: number;
  nombre: string;
  buses: Bus[];
}

const BASE_URL = "https://www.api.devcorebits.com/tiemporealGateway";

export const obtenerLlegadasGenerales = async (): Promise<EstacionConBuses[]> => {
  const { data } = await axios.get(`${BASE_URL}/info/llegadas`);
  return data;
};
