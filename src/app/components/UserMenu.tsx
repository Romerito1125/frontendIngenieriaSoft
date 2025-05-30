"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown } from "lucide-react";

type TokenPayload = {
  userId: number;
  correo: string;
};

type TokenPayloadGoogle = {
  sub: string;
  email: string;
};

type CuentaData = {
  nombre?: string;
  apellido?: string;
  correo: string;
};

export default function UserMenu() {
  const [user, setUser] = useState<CuentaData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage =
    pathname?.includes("/auth/login") || pathname?.includes("/auth/register");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decodedNormal = jwtDecode<TokenPayload>(token);
      if (typeof decodedNormal.userId === "number") {
        // Token normal → consulta backend
        fetch(
          `https://www.api.devcorebits.com/cuentasGateway/cuenta/getCuenta/${decodedNormal.userId}`
        )
          .then((res) => res.json())
          .then((data) => {
            setUser(data);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
        return;
      }
    } catch {
      // No pasa nada, probamos token de Google
    }

    try {
      const decodedGoogle = jwtDecode<TokenPayloadGoogle>(token);
      if (decodedGoogle.sub) {
        // Token de Google → usamos directamente el email
        setUser({
          correo: decodedGoogle.email
        });
      }
    } catch (error) {
      console.error("Error al decodificar token:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleLogout = () => {
    Cookies.remove("token");
    setUser(null);
    setIsOpen(false);
    router.push("/");
  };

  if (isAuthPage) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <span className="sr-only">Cargando</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/auth/login"
          className="group relative px-4 py-2 text-blue-600 font-medium text-sm md:text-base overflow-hidden rounded-full transition-all duration-300"
        >
          <span className="relative z-10">Iniciar sesión</span>
          <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-100 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left rounded-full"></span>
        </Link>

        <Link
          href="/auth/register"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-sm md:text-base rounded-full shadow-sm hover:shadow-md transition-all duration-300"
        >
          Registrarse
        </Link>
      </div>
    );
  }

  // Si es Google → usamos primera letra del correo
  const letraGoogle = user.correo?.charAt(0)?.toUpperCase() || "";

  // Si es cuenta normal → usamos nombre/apellido
  const letra = user.nombre?.charAt(0)?.toUpperCase() || letraGoogle;
  const apellidoLetra = user.apellido?.charAt(0)?.toUpperCase() || "";

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pr-3 pl-1.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
          {letra}
          {apellidoLetra}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-100"
          >
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold border-2 border-white/50">
                  {letra}
                  {apellidoLetra}
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium truncate">
                    {user.nombre
                      ? `${user.nombre} ${user.apellido}`
                      : user.correo}
                  </p>
                  <p className="text-xs text-blue-100 truncate">{user.correo}</p>
                </div>
              </div>
            </div>

            <div className="py-2 px-1">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => {
                  router.push("/cuenta");
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors mx-1"
              >
                <User className="w-4 h-4" />
                <span>Mi cuenta</span>
              </motion.button>

              <div className="my-1 border-t border-gray-100 mx-3"></div>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mx-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
