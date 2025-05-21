"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  correo: string;
}

export default function SeccionPassword({ correo }: Props) {
  const [otp, setOtp] = useState("");
  const [validado, setValidado] = useState(false);
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const handleEnviarOtp = async () => {
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "cambio" }),
      });
      if (!res.ok) throw new Error();
      toast.success("OTP enviado al correo");
    } catch {
      toast.error("No se pudo enviar OTP");
    }
  };

  const handleVerificarOtp = async () => {
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, otp }),
      });
      if (!res.ok) throw new Error("OTP inválido o expirado");
      toast.success("OTP verificado");
      setValidado(true);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Error desconocido");
      }
    }
  };

  const handleCambiarPassword = async () => {
    if (!nueva || !confirmar) return toast.error("Todos los campos son requeridos");
    if (nueva !== confirmar) return toast.error("Las contraseñas no coinciden");

    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/cambiar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasenia: nueva }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Ocurrió un error inesperado");

      toast.success("Contraseña actualizada exitosamente");
      setOtp("");
      setNueva("");
      setConfirmar("");
      setValidado(false);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Error desconocido");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-10 rounded shadow-md">
      <h2 className="text-xl font-bold text-blue-700 mb-4">Cambiar contraseña</h2>

      {!validado && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Para cambiar tu contraseña, primero verifica tu identidad con el código OTP que será enviado a tu correo.
          </p>

          <button
            onClick={handleEnviarOtp}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Enviar OTP al correo
          </button>

          <input
            type="text"
            placeholder="Código OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />

          <button
            onClick={handleVerificarOtp}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Verificar OTP
          </button>
        </div>
      )}

      {validado && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600">
            OTP verificado correctamente. Ahora puedes establecer una nueva contraseña.
          </p>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <button
            onClick={handleCambiarPassword}
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            Cambiar contraseña
          </button>
        </div>
      )}
    </div>
  );
}
