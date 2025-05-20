"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { registerUsuario } from "./utils";

export default function RegisterPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [loading, setLoading] = useState(false);
  const [correoRepetido, setCorreoRepetido] = useState(false);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValid =
    nombre.trim().length >= 2 &&
    apellido.trim().length >= 2 &&
    isValidEmail(correo) &&
    contrasenia.trim().length >= 6;

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setCorreoRepetido(false);
    try {
      const { token } = await registerUsuario({
        nombre,
        apellido,
        correo,
        contrasenia,
      });

      Cookies.set("token", token, {
        expires: 1,
        sameSite: "strict",
      });

      toast.success("¡Registro exitoso!");
      window.location.href = "/";
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al registrar";
      if (
        message.toLowerCase().includes("correo") &&
        message.toLowerCase().includes("registrado")
      ) {
        setCorreoRepetido(true);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Crear Cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-1/2 border rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-1/2 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => {
                setCorreo(e.target.value);
                setCorreoRepetido(false);
              }}
              className="w-full border rounded px-3 py-2"
              required
            />
            {correo && !isValidEmail(correo) && (
              <p className="text-sm text-red-600 mt-1">Correo no válido</p>
            )}
            {correoRepetido && (
              <p className="text-sm text-red-600 mt-1">Este correo ya está registrado</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña (mín. 6)"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            {contrasenia && contrasenia.length < 6 && (
              <p className="text-sm text-red-600 mt-1">Mínimo 6 caracteres</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className={`w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-700 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
