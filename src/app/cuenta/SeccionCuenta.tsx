"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  correo: string;
  id: number;
}

type CuentaData = {
  nombre: string;
  apellido: string;
  correo: string;
};

export default function SeccionCuenta({ correo, id }: Props) {
  const [cuenta, setCuenta] = useState<CuentaData>({
    nombre: "",
    apellido: "",
    correo: correo,
  });
  const [otp, setOtp] = useState("");
  const [verificado, setVerificado] = useState(false);
  const [mostrarOtp, setMostrarOtp] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3008/cuenta/getCuenta/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.nombre) {
          setCuenta(data);
        } else {
          toast.error("Error cargando cuenta");
        }
      })
      .catch(() => toast.error("Error cargando cuenta"))
      .finally(() => setCargando(false));
  }, [id]);

  const handleEnviarOtp = async () => {
    try {
      const res = await fetch("http://localhost:3008/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "actualizacion" }),
      });

      if (!res.ok) throw new Error();
      toast.success("OTP enviado correctamente al correo");
      setMostrarOtp(true);
    } catch {
      toast.error("Error al enviar OTP");
    }
  };

  const handleConfirmarOtp = async () => {
    try {
      const res = await fetch("http://localhost:3008/cuenta/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Identidad verificada");
      setVerificado(true);
      setMostrarOtp(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "OTP inválido");
      } else {
        toast.error("Error desconocido");
      }
    }
  };

  const handleActualizar = async () => {
    if (!cuenta.nombre || !cuenta.apellido || !cuenta.correo) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:3008/cuenta/actualizar-con-otp", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo,
          otp,
          nombre: cuenta.nombre,
          apellido: cuenta.apellido,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Información actualizada correctamente");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Error al actualizar");
      } else {
        toast.error("Error desconocido");
      }
    }
  };

  if (cargando) return <div className="p-10">Cargando datos...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded shadow-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Cuenta</h1>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            value={cuenta.nombre}
            onChange={(e) => setCuenta({ ...cuenta, nombre: e.target.value })}
            disabled={!verificado}
            className="w-full border border-gray-300 rounded px-4 py-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Apellido</label>
          <input
            type="text"
            value={cuenta.apellido}
            onChange={(e) => setCuenta({ ...cuenta, apellido: e.target.value })}
            disabled={!verificado}
            className="w-full border border-gray-300 rounded px-4 py-2 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Correo</label>
          <input
            type="email"
            value={cuenta.correo}
            disabled
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
          />
        </div>

        {!verificado && (
          <button
            onClick={handleEnviarOtp}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Verificar identidad para actualizar
          </button>
        )}

        {mostrarOtp && (
          <div className="mt-4 p-4 bg-gray-100 rounded shadow-sm">
            <label className="block text-sm font-medium mb-1">Código OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
              placeholder="Ingresa el código enviado a tu correo"
            />
            <button
              onClick={handleConfirmarOtp}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Confirmar OTP
            </button>
          </div>
        )}

        {verificado && (
          <button
            onClick={handleActualizar}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Actualizar la cuenta
          </button>
        )}
      </div>
    </div>
  );
}
