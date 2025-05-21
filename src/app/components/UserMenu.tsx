"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

type TokenPayload = {
  userId: number;
  correo: string;
};

type CuentaData = {
  nombre: string;
  apellido: string;
  correo: string;
};

export default function UserMenu() {
  const [user, setUser] = useState<CuentaData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      fetch(`https://www.cuentas.devcorebits.com/cuenta/getCuenta/${decoded.userId}`)
        .then((res) => res.json())
        .then((data) => setUser(data));
    } catch {
      setUser(null);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Link href="/auth/login" className="text-blue-700 hover:underline text-xl font-normal text-blue-900"
          style={{ fontFamily: "Lobster, cursive" }}>
          Iniciar sesión
        </Link>
        <Link href="/auth/register" className="text-blue-700 hover:underline text-xl font-normal text-blue-900"
          style={{ fontFamily: "Lobster, cursive" }}>
          Registrarse
        </Link>
      </div>
    );
  }

  const letra = user.nombre?.charAt(0)?.toUpperCase() || "U";

  return (
    <div
      onClick={() => router.push("/cuenta")}
      className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold cursor-pointer"
    >
      {letra}
    </div>
  );
}
