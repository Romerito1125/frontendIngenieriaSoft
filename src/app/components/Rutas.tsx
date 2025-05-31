"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Ruta = {
  idruta: string;
  tipo: string;
  horariolunvier?: string;
  horariofinsem?: string;
  LugarInicio: string;
  LugarFin: string;
  LugaresConcurridos?: string;
};

export default function Rutas() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredTipo, setFilteredTipo] = useState<string | null>(null);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://www.api.devcorebits.com/tiemporealGateway/rutas"
        );
        const data = Array.isArray(res.data) ? res.data : res.data.data;
        setRutas(data);
      } catch (error) {
        console.error("Error al obtener las rutas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRutas();
  }, []);

  const filteredRutas = rutas.filter((ruta) => {
    const numero = ruta.idruta || "";
    const nombre = `${ruta.LugarInicio} - ${ruta.LugarFin}`;
    const matchesSearch =
      numero.toLowerCase().includes(search.toLowerCase()) ||
      nombre.toLowerCase().includes(search.toLowerCase());

    if (filteredTipo) {
      return (
        matchesSearch && ruta.tipo.toLowerCase() === filteredTipo.toLowerCase()
      );
    }

    return matchesSearch;
  });

  const getColorByType = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "troncal":
        return {
          bg: "bg-red-600",
          hover: "hover:bg-red-700",
          border: "border-red-200",
          text: "text-red-800",
          light: "bg-red-50",
        };
      case "pretroncal":
        return {
          bg: "bg-blue-600",
          hover: "hover:bg-blue-700",
          border: "border-blue-200",
          text: "text-blue-800",
          light: "bg-blue-50",
        };
      case "expreso":
        return {
          bg: "bg-yellow-500",
          hover: "hover:bg-yellow-600",
          border: "border-yellow-200",
          text: "text-yellow-800",
          light: "bg-yellow-50",
        };
      case "alimentador":
        return {
          bg: "bg-green-600",
          hover: "hover:bg-green-700",
          border: "border-green-200",
          text: "text-green-800",
          light: "bg-green-50",
        };
      default:
        return {
          bg: "bg-gray-500",
          hover: "hover:bg-gray-600",
          border: "border-gray-200",
          text: "text-gray-800",
          light: "bg-gray-50",
        };
    }
  };

  // Obtener tipos únicos para los filtros
  const tiposUnicos = [...new Set(rutas.map((ruta) => ruta.tipo))];

  return (
    <div className="w-full bg-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-8">
          Conoce las rutas del MIO
        </h1>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="flex items-center gap-2 p-3 border border-blue-200 rounded-lg bg-blue-50 shadow-sm focus-within:ring-2 focus-within:ring-blue-300 focus-within:border-blue-300 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar ruta por número o destino..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none bg-transparent text-blue-900 placeholder-blue-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Filtros por tipo */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setFilteredTipo(null)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                filteredTipo === null
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>

            {tiposUnicos.map((tipo) => {
              const colors = getColorByType(tipo);
              return (
                <button
                  key={tipo}
                  onClick={() =>
                    setFilteredTipo(filteredTipo === tipo ? null : tipo)
                  }
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    filteredTipo === tipo
                      ? `${colors.bg} text-white`
                      : `${colors.light} ${colors.text} ${colors.hover}`
                  }`}
                >
                  {tipo}
                </button>
              );
            })}
          </div>
        </div>

        {/* Estado de carga */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-blue-800">Cargando rutas...</p>
          </div>
        ) : (
          <>
            {/* Contador de resultados */}
            <p className="text-sm text-gray-500 mb-4">
              {filteredRutas.length}{" "}
              {filteredRutas.length === 1
                ? "ruta encontrada"
                : "rutas encontradas"}
              {filteredTipo && ` para el tipo "${filteredTipo}"`}
              {search && ` con "${search}"`}
            </p>

            {/* Lista de rutas */}
            <div className="space-y-3">
              <AnimatePresence>
                {filteredRutas.length > 0 ? (
                  filteredRutas.map((ruta, index) => {
                    const colors = getColorByType(ruta.tipo);
                    return (
                      <motion.div
                        key={ruta.idruta}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        <Link href={`/rutas/${ruta.idruta}`}>
                          <div
                            className={`flex items-start p-4 border ${colors.border} rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${colors.light} group`}
                          >
                            <div className="flex-shrink-0 mr-4">
                              <span
                                className={`${colors.bg} text-white font-bold px-3 py-2 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300 inline-block min-w-[3rem] text-center`}
                              >
                                {ruta.idruta}
                              </span>
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-800 transition-colors">
                                  {ruta.LugarInicio} - {ruta.LugarFin}
                                </h3>
                                <span
                                  className={`text-xs ${colors.text} font-medium px-2 py-1 rounded-full ${colors.light} border ${colors.border} inline-flex items-center`}
                                >
                                  {ruta.tipo}
                                </span>
                              </div>

                              {(ruta.horariolunvier || ruta.horariofinsem) && (
                                <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                                  {ruta.horariolunvier && (
                                    <div className="flex items-center gap-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                      </svg>
                                      <span>
                                        Lun-Vie: {ruta.horariolunvier}
                                      </span>
                                    </div>
                                  )}

                                  {ruta.horariofinsem && (
                                    <div className="flex items-center gap-1">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                      </svg>
                                      <span>
                                        Fin de semana: {ruta.horariofinsem}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {ruta.LugaresConcurridos && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Lugares: {ruta.LugaresConcurridos}
                                </p>
                              )}
                            </div>

                            <div className="flex-shrink-0 self-center ml-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-blue-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No se encontraron rutas
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Intenta con otra búsqueda o elimina los filtros
                    </p>
                    {(search || filteredTipo) && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setFilteredTipo(null);
                        }}
                        className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Limpiar filtros
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
