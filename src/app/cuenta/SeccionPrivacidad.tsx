"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  correo: string;
}

export default function SeccionPrivacidad({ correo }: Props) {
  const [otp, setOtp] = useState("");
  const [validado, setValidado] = useState(false);
  const [confirmacion, setConfirmacion] = useState(false);

  const handleEnviarOtp = async () => {
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "eliminacion" }),
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

  const handleEliminarCuenta = async () => {
    try {
      const res = await fetch(`https://www.cuentas.devcorebits.com/cuenta/eliminar-con-otp`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Ocurrió un error inesperado");
      toast.success("Cuenta eliminada exitosamente");
      setTimeout(() => window.location.href = "/auth/login", 2000);
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
      <h2 className="text-xl font-bold text-red-700 mb-4">Privacidad y Seguridad</h2>

      {!validado && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Para eliminar tu cuenta, primero debes verificar tu identidad ingresando el código enviado a tu correo.
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
        <div className="mt-6 text-center">
          {!confirmacion ? (
            <>
              <p className="text-red-600 font-medium mb-4">
                Esta acción es irreversible. Se eliminará tu cuenta y todos los datos asociados.
              </p>
              <button
                onClick={() => setConfirmacion(true)}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
              >
                Confirmar eliminación
              </button>
            </>
          ) : (
            <button
              onClick={handleEliminarCuenta}
              className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900"
            >
              Eliminar cuenta permanentemente
            </button>
          )}
        </div>
      )}
    </div>
  );
}
