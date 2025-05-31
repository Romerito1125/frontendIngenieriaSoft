"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type TarjetaData = {
  idTarjeta: string;
  fechaexpedicion: string;
  ultimarecarga: string;
  saldo: number;
  idCuenta: string;
};

export default function ConsultaSaldo() {
  const [numeroTarjeta, setNumeroTarjeta] = useState("19.06.04785062-3");
  const [tarjetaData, setTarjetaData] = useState<TarjetaData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchTarjeta(id: string) {
    setLoading(true);
    setError("");
    setTarjetaData(null);
    try {
      const res = await fetch(
        `https://www.api.devcorebits.com/tarjetasGateway/tarjetas/${encodeURIComponent(
          id
        )}`
      );
      if (!res.ok) {
        throw new Error(`Error al obtener datos: ${res.statusText}`);
      }
      const data = await res.json();
      setTarjetaData(data);
    } catch (e: any) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  // Ejecutar fetch cada vez que cambie el número de tarjeta (con debounce simple)
  useEffect(() => {
    if (numeroTarjeta.trim().length === 0) {
      setTarjetaData(null);
      setError("");
      return;
    }

    const timer = setTimeout(() => {
      fetchTarjeta(numeroTarjeta.trim());
    }, 600);

    return () => clearTimeout(timer);
  }, [numeroTarjeta]);

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-start pt-10 px-4 bg-white text-blue-900">
      <div className="bg-[#4e8aff] rounded-2xl p-6 w-full max-w-sm shadow-lg">
        <label
          htmlFor="numero"
          className="block text-sm font-semibold mb-2 text-white"
        >
          Introduce el número aquí
        </label>

        <input
          type="text"
          id="numero"
          value={numeroTarjeta}
          onChange={(e) => setNumeroTarjeta(e.target.value)}
          placeholder="1906047850623"
          className="w-full bg-white text-blue-600 placeholder-blue-400 rounded-md px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <Image
          src="/FondoTarjeta.png"
          alt="Fondo Tarjeta MIO"
          width={320}
          height={200}
          className="rounded-lg w-full my-4"
        />

        {loading && (
          <p className="text-white font-semibold">Cargando datos...</p>
        )}
        {error && <p className="text-red-300 font-semibold">Error: {error}</p>}

        {tarjetaData && (
          <div className="bg-white text-[#2962ff] font-bold rounded-lg p-4 shadow space-y-2 mb-4">
            <p>
              <span className="font-semibold">ID Tarjeta:</span>{" "}
              {tarjetaData.idTarjeta}
            </p>
            <p>
              <span className="font-semibold">Fecha Expedición:</span>{" "}
              {tarjetaData.fechaexpedicion}
            </p>
            <p>
              <span className="font-semibold">Última Recarga:</span>{" "}
              {tarjetaData.ultimarecarga}
            </p>
            <p>
              <span className="font-semibold">Saldo:</span> $
              {tarjetaData.saldo.toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">ID Cuenta:</span>{" "}
              {tarjetaData.idCuenta}
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="bg-white text-[#2962ff] font-bold rounded-full px-4 py-2 shadow">
            Saldo: ${tarjetaData ? tarjetaData.saldo.toLocaleString() : "---"}
          </div>
          <Link href={`/${numeroTarjeta}/recarga`}>
            <button className="relative overflow-hidden bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out hover:text-white group">
              <span className="absolute left-0 top-0 h-full w-0 bg-green-500 group-hover:w-full transition-all duration-500 ease-out z-0"></span>
              <span className="relative z-10">Recarga con PayU</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
