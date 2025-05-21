// s


"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SeccionCuenta from "./SeccionCuenta";
import SeccionPassword from "./SeccionPassword";
import SeccionPrivacidad from "./SeccionPrivacidad";

// HeroIcons
import { HiUserCircle, HiLockClosed, HiCog, HiLogout } from "react-icons/hi";

// Tipado de la cuenta solo con los campos que usas
interface Cuenta {
  nombre: string;
  apellido: string;
}

export default function CuentaPage() {
  const [seccion, setSeccion] = useState("cuenta");
  const [correo, setCorreo] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<{ userId: number; correo: string }>(token);
      setCorreo(decoded.correo);
      setUserId(decoded.userId);
    } catch {
      toast.error("Token inválido");
      router.push("/auth/login");
    }
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    fetch(`https://www.cuentas.devcorebits.com/cuenta/getCuenta/${userId}`)
      .then((res) => res.json())
      .then((data: Cuenta) => {
        if (data.nombre) {
          setCuenta(data);
        } else {
          toast.error("Error cargando cuenta");
        }
      })
      .catch(() => toast.error("Error cargando cuenta"))
      .finally(() => setCargando(false));
  }, [userId]);

  if (cargando) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <aside className="w-72 bg-white shadow-md p-8 flex flex-col items-center">
        <div className="w-24 h-24 bg-blue-700 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
          {cuenta?.nombre?.[0]?.toUpperCase() || "?"}
        </div>
        <h2 className="font-semibold text-center text-lg mb-1">
          {cuenta?.nombre} {cuenta?.apellido}
        </h2>

        <nav className="w-full mt-4">
          <ul className="space-y-3">
            <li
              className={`rounded px-4 py-2 cursor-pointer flex items-center gap-2 ${
                seccion === "cuenta"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSeccion("cuenta")}
            >
              <HiUserCircle className="text-xl" />
              Cuenta
            </li>
            <li
              className={`rounded px-4 py-2 cursor-pointer flex items-center gap-2 ${
                seccion === "password"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSeccion("password")}
            >
              <HiLockClosed className="text-xl" />
              Cambiar contraseña
            </li>
            <li
              className={`rounded px-4 py-2 cursor-pointer flex items-center gap-2 ${
                seccion === "privacidad"
                  ? "bg-blue-100 text-blue-900 font-medium"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setSeccion("privacidad")}
            >
              <HiCog className="text-xl" />
              Privacidad
            </li>
            <li
              className="rounded px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer flex items-center gap-2"
              onClick={() => {
                Cookies.remove("token");
                router.push("/auth/login");
              }}
            >
              <HiLogout className="text-xl" />
              Cerrar sesión
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-12">
        {seccion === "cuenta" && userId !== null && (
          <SeccionCuenta correo={correo} id={userId} />
        )}
        {seccion === "password" && <SeccionPassword correo={correo} />}
        {seccion === "privacidad" && <SeccionPrivacidad correo={correo} />}
      </main>
    </div>
  );
}
