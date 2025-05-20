"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function RecuperarPasswordPage() {
  const [correo, setCorreo] = useState("");
  const [otp, setOtp] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [fase, setFase] = useState<"inicio" | "verificacion" | "recuperacion">("inicio");

  const handleEnviarOtp = async () => {
    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, tipo: "recuperacion" }),
      });

      if (!res.ok) throw new Error();
      toast.success("Código OTP enviado al correo");
      setFase("verificacion");
    } catch {
      toast.error("Error al enviar OTP");
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
      setFase("recuperacion");
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Error desconocido");
      }
    }
  };

  const handleResetPassword = async () => {
    if (nueva !== confirmar) return toast.error("Las contraseñas no coinciden");

    try {
      const res = await fetch("https://www.cuentas.devcorebits.com/cuenta/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, nuevaContrasenia: nueva }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al cambiar contraseña");

      toast.success("Contraseña restablecida con éxito");
      setTimeout(() => (window.location.href = "/auth/login"), 2000);
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Error desconocido");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Recuperar contraseña</h1>

        {fase === "inicio" && (
          <>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <button
              onClick={handleEnviarOtp}
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            >
              Enviar código OTP
            </button>
          </>
        )}

        {fase === "verificacion" && (
          <>
            <p className="text-sm text-gray-600 mb-2">Revisa tu correo e ingresa el código OTP:</p>
            <input
              type="text"
              placeholder="Código OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <button
              onClick={handleVerificarOtp}
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800"
            >
              Verificar
            </button>
          </>
        )}

        {fase === "recuperacion" && (
          <>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            >
              Cambiar contraseña
            </button>
          </>
        )}
      </div>
    </div>
  );
}
