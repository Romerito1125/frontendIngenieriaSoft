"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  obtenerRuta,
  obtenerRecorrido,
  obtenerZonaEstacion,
  Ruta,
  Estacion,
} from "./utils";

export default function RutaDetallePage() {
  const { idRuta } = useParams();
  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rutaData = await obtenerRuta(idRuta as string);
        setRuta(rutaData);

        const estacionesData = await obtenerRecorrido(idRuta as string);

        const estacionesConZona: Estacion[] = await Promise.all(
          estacionesData.map(async (estacion) => {
            const zona = await obtenerZonaEstacion(estacion.idestacion);
            return { ...estacion, zona };
          })
        );

        setEstaciones(estacionesConZona);
      } catch (err) {
        console.error("Error cargando ruta:", err);
        setError(true);
      }
    };

    fetchData();
  }, [idRuta]);

  const getColorByZona = (zona: string) => {
    switch (zona) {
      case "0":
        return "bg-orange-500";
      case "1":
        return "bg-blue-500";
      case "2":
        return "bg-fuchsia-400";
      case "3":
        return "bg-amber-400";
      case "4":
        return "bg-purple-500";
      case "5":
        return "bg-sky-600";
      case "6":
        return "bg-cyan-500";
      case "7":
        return "bg-lime-400";
      default:
        return "bg-gray-400";
    }
  };

  if (error)
    return (
      <div className="text-center text-red-500 mt-10">
        Error al cargar la ruta
      </div>
    );
  if (!ruta)
    return (
      <div className="text-center mt-10 text-gray-600">Cargando ruta...</div>
    );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Rutero LED */}
      <div className="relative bg-black p-4 rounded-lg w-full border-4 border-gray-800 overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,200,0,0.5)_1px,transparent_1px)] bg-[size:6px_6px] opacity-30"></div>
        <div className="relative z-10 flex flex-row w-full items-center">
          <span className="text-6xl font-mono text-amber-500 tracking-widest font-bold mr-4 leading-none drop-shadow-[0_0_4px_#ffcc00]">
            {ruta.idruta}
          </span>
          <div className="text-3xl font-mono text-amber-500 tracking-widest leading-tight drop-shadow-[0_0_4px_#ffcc00]">
            <p>{ruta.LugarInicio}</p>
            <p>{ruta.LugarFin}</p>
          </div>
        </div>
      </div>

      {/* Horarios + botón */}
      <div className="bg-white p-4 rounded-lg border shadow">
        <h2 className="text-xl font-bold mb-2 text-blue-700">Horarios</h2>
        <p className="text-sm text-gray-600">
          Lunes a viernes: <strong>{ruta.horariolunvier}</strong>
        </p>
        <p className="text-sm text-gray-600">
          Fines de semana: <strong>{ruta.horariofinsem}</strong>
        </p>
        <Link href={`/buses-realtime/`}>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition cursor-pointer">
            Rutas en tiempo real
          </button>
        </Link>
      </div>

      {/* Estaciones */}
      <div className="bg-white p-4 border rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Estaciones</h2>
        <div className="relative pl-6">
          <div className="flex flex-col relative z-10">
            {estaciones.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600">
                  Cargando estaciones...
                </span>
              </div>
            ) : (
              estaciones.map((estacion, index) => {
                const color = getColorByZona(estacion.zona);
                const isFirst = index === 0;
                const isLast = index === estaciones.length - 1;

                const borderRadius = `${isFirst ? "rounded-t-full" : ""} ${
                  isLast ? "rounded-b-full" : ""
                }`;

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-6 ${color} ${borderRadius}`}
                      style={{
                        marginTop: "-1px",
                        marginBottom: "-1px",
                      }}
                      title={`Zona ${estacion.zona}`}
                    ></div>
                    <span className="text-gray-800">
                      {index + 1}. {estacion.nombre}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
