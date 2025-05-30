import { useEffect, useState } from "react";

interface DecodedToken {
  isAdmin: boolean;
  userId: string;
  correo: string;
  exp: number;
  iat: number;
}

function decodeToken<T>(token: string): T {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (err) {
    throw new Error("Token inválido");
  }
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        const decoded = decodeToken<DecodedToken>(token);
        setIsAdmin(decoded.isAdmin);
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        setIsAdmin(false);
      }
    } else {
      console.log("No token encontrado en las cookies.");
      setIsAdmin(false);
    }
  }, []);

  return isAdmin;
}
