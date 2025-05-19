"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { loginUsuario } from "./utils";

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { token } = await loginUsuario({ correo, contrasenia });

      Cookies.set("token", token, {
        expires: 1,
        sameSite: "strict",
      });

      toast.success("Bienvenido 👋");
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.message || "Error de autenticación");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = correo.trim() !== "" && contrasenia.trim() !== "";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Contraseña</label>
            <input
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className="w-full border rounded px-3 py-2 mt-1"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        {/* 🔗 Recuperación de contraseña */}
        <p className="mt-3 text-center text-sm">
          <a href="/auth/recuperar" className="text-blue-700 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </p>

        <p className="mt-4 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <a href="/auth/register" className="text-blue-700 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
}
