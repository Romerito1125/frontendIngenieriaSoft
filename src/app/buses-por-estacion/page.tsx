"use client";

import { useEffect, useState } from "react";
import {
  obtenerLlegadasGenerales,
  EstacionConBuses,
} from "./utils";

export default function BusesPorEstacion() {
  const [estaciones, setEstaciones] = useState<EstacionConBuses[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLlegadas = async () => {
    try {
      const data = await obtenerLlegadasGenerales();
      setEstaciones(data);
      setIsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-2xl blur-3xl"></div>
          <div className="relative bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-blue-100">
            <h1 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              🚏 Buses por Estación
            </h1>
            <p className="text-blue-600 text-center opacity-80 mb-6">
              Información del tiempo de llegada de los buses
            </p>

            <div className="relative max-w-md mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Buscar estación..."
                className="pl-10 w-full bg-white bg-opacity-80 backdrop-blur-sm border-2 border-blue-200 rounded-full py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {busqueda && (
                  <button
                    onClick={() => setBusqueda("")}
                    className="text-blue-400 hover:text-blue-600 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de estaciones */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="bg-blue-500 p-3 flex items-center justify-center">
                  <div className="h-6 w-3/4 bg-blue-400 animate-pulse rounded-md"></div>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-10 w-full bg-gray-100 animate-pulse rounded-md"></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {estacionesFiltradas.map((estacion) => (
              <div
                key={estacion.idestacion}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 text-white font-semibold text-center flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white opacity-10"
                        style={{
                          width: `${Math.random() * 20 + 5}px`,
                          height: `${Math.random() * 20 + 5}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                        }}
                      ></div>
                    ))}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="relative z-10">{estacion.nombre}</span>
                </div>
                <div className="p-4">
                  {estacion.buses.length > 0 ? (
                    <div className="space-y-3">
                      {estacion.buses.map((bus) => (
                        <div
                          key={bus.idbus}
                          className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center">
                            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full mr-2 shadow-sm">
                              {bus.idbus}
                            </span>
                            <span className="font-medium text-blue-800">
                              Ruta {bus.ruta}
                            </span>
                          </div>
                          <div
                            className={`flex items-center ${
                              bus.tiempo_estimado_min === 0
                                ? "text-green-600"
                                : bus.tiempo_estimado_min <= 5
                                ? "text-orange-500"
                                : "text-blue-600"
                            }`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-semibold">
                              {bus.tiempo_estimado_min === 0
                                ? "Llegó"
                                : `${bus.tiempo_estimado_min} min`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 opacity-50 rounded-full blur-md"></div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-blue-300 relative z-10"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="mt-3 font-medium text-blue-400">
                        Sin buses próximos
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && estacionesFiltradas.length === 0 && (
          <div className="text-center mt-10 p-8 bg-white rounded-xl shadow-lg border border-blue-100">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-100 opacity-50 rounded-full blur-md"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-blue-400 mx-auto mb-3 relative z-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-xl text-gray-600 mb-3">
              No se encontraron coincidencias para "{busqueda}"
            </p>
            <button
              onClick={() => setBusqueda("")}
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Mostrar todas las estaciones
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
          100% {
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
