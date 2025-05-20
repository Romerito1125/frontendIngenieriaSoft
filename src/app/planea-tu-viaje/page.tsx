"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";

type Estacion = {
  idestacion: number;
  nombre: string;
  ubicacion: string;
  Zona: string;
};

type AgrupadasPorZona = {
  [zona: string]: Estacion[];
};

const getColorByType = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "troncal":
      return "bg-red-600";
    case "pretroncal":
      return "bg-blue-600";
    case "expreso":
      return "bg-yellow-500 text-black";
    case "alimentador":
      return "bg-green-600";
    default:
      return "bg-gray-500";
  }
};

export default function EstacionesPage() {
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [agrupadas, setAgrupadas] = useState<AgrupadasPorZona>({});
  const [origen, setOrigen] = useState<number | null>(null);
  const [destino, setDestino] = useState<number | null>(null);
  const [rutaResultado, setRutaResultado] = useState<string[] | null>(null);
  const [rutasConTipo, setRutasConTipo] = useState<{ id: string; tipo: string }[]>([]);
  const resultadoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const obtenerEstaciones = async () => {
      const res = await fetch("http://localhost:3001/estaciones");
      const data = await res.json();
      setEstaciones(data);

      const agrupado: AgrupadasPorZona = {};
      data.forEach((estacion: Estacion) => {
        if (!agrupado[estacion.Zona]) agrupado[estacion.Zona] = [];
        agrupado[estacion.Zona].push(estacion);
      });
      setAgrupadas(agrupado);
    };

    obtenerEstaciones();
  }, []);

  const calcularRuta = async () => {
    if (!origen || !destino) return alert("Selecciona origen y destino");

    const res = await fetch("http://localhost:3001/viajes/planear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: "viaje_normal",
        origen,
        destino
      })
    });

    const data = await res.json();

    if (data.rutas) {
      setRutaResultado(data.rutas);

      const tipos = await Promise.all(
        data.rutas.map(async (idruta: string) => {
          const resRuta = await fetch(`http://localhost:3001/rutas/${idruta}`);
          const dataRuta = await resRuta.json();
          return { id: idruta, tipo: dataRuta?.tipo || "desconocido" };
        })
      );

      setRutasConTipo(tipos);

      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      alert("No se pudo calcular la ruta.");
    }
  };

  const handleSeleccion = (idestacion: number) => {
    if (origen === null) {
      setOrigen(idestacion);
    } else if (destino === null && idestacion !== origen) {
      setDestino(idestacion);
    } else {
      setOrigen(idestacion);
      setDestino(null);
      setRutaResultado(null);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Selecciona origen y destino
      </h1>

      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-700">Origen:</p>
            <p className="text-base font-medium text-blue-700">
              {origen
                ? estaciones.find((e) => e.idestacion === origen)?.nombre
                : "No seleccionado"}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-700">Destino:</p>
            <p className="text-base font-medium text-red-600">
              {destino
                ? estaciones.find((e) => e.idestacion === destino)?.nombre
                : "No seleccionado"}
            </p>
          </div>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-blue-700 disabled:opacity-50 transition"
          onClick={calcularRuta}
          disabled={!origen || !destino}
        >
          Calcular ruta
        </button>
      </div>

      {Object.entries(agrupadas).map(([zona, estacionesZona]) => (
        <div key={zona} className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-blue-700">
            Zona {zona}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {estacionesZona.map((estacion) => {
              const isOrigen = estacion.idestacion === origen;
              const isDestino = estacion.idestacion === destino;

              return (
                <div
                  key={estacion.idestacion}
                  className={`border rounded-lg p-4 cursor-pointer transition hover:shadow
                    ${
                      isOrigen
                        ? "bg-green-100 border-green-500 ring-2 ring-green-300"
                        : isDestino
                        ? "bg-red-100 border-red-500 ring-2 ring-red-300"
                        : "bg-white border-gray-300"
                    }`}
                  onClick={() => handleSeleccion(estacion.idestacion)}
                >
                  <h3 className="text-lg font-semibold text-blue-700">
                    {estacion.nombre}
                  </h3>
                  <p className="text-sm text-gray-500">{estacion.ubicacion}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {rutaResultado && (
        <div
          ref={resultadoRef}
          className="mt-10 p-6 bg-green-100 border border-green-400 rounded text-center shadow"
        >
          <h3 className="text-xl font-bold mb-4">Ruta sugerida:</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 text-white text-sm font-semibold">
            {rutasConTipo.map((ruta, index) => (
              <div key={index} className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-md shadow text-sm ${getColorByType(
                    ruta.tipo
                  )}`}
                  style={{ minWidth: "45px", textAlign: "center" }}
                >
                  {ruta.id}
                </span>
                {index < rutasConTipo.length - 1 && (
                  <ChevronDoubleRightIcon className="w-5 h-5 text-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
