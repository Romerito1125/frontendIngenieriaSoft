//src/app/buses-por-estacion/page.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Bus {
  idbus: number;
  ruta: string;
  tiempo_estimado_min: number;
}

interface EstacionConBuses {
  idestacion: number;
  nombre: string;
  buses: Bus[];
}

export default function BusesPorEstacion() {
  const [estaciones, setEstaciones] = useState<EstacionConBuses[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const fetchLlegadas = async () => {
    try {
      const res = await axios.get("www.tiemporeal.devcorebits.com/info/llegadas");
      setEstaciones(res.data);
    } catch (err) {
      console.error("Error al obtener llegadas generales", err);
    }
  };

  useEffect(() => {
    fetchLlegadas();
    const interval = setInterval(fetchLlegadas, 10000);
    return () => clearInterval(interval);
  }, []);

  const estacionesFiltradas = estaciones.filter((e) =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-800">
        🚏 Buses por Estación
      </h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar estación..."
          className="border border-blue-300 rounded-lg p-2 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {estacionesFiltradas.map((estacion) => (
          <div
            key={estacion.idestacion}
            className="bg-white shadow-md rounded-xl border border-blue-200 p-4 flex flex-col"
          >
            <h2 className="text-lg font-bold text-blue-700 mb-3 text-center">
              {estacion.nombre}
            </h2>
            {estacion.buses.length > 0 ? (
              <ul className="space-y-2">
                {estacion.buses.map((bus) => (
                  <li
                    key={bus.idbus}
                    className="flex justify-between items-center bg-blue-50 p-2 rounded-md text-sm"
                  >
                    <span> Bus {bus.idbus} – Ruta {bus.ruta}</span>
                    <span>
                      {bus.tiempo_estimado_min === 0
                        ? "Llegó"
                        : `${bus.tiempo_estimado_min} min`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center">Sin buses próximos</p>
            )}
          </div>
        ))}
      </div>

      {estacionesFiltradas.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No se encontraron coincidencias.</p>
      )}
    </div>
  );
}
