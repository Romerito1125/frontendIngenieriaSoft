// src/app/auth/login/utils.ts

type LoginPayload = {
  correo: string;
  contrasenia: string;
};

const API_URL = "https://www.cuentas.devcorebits.com/cuenta";

export async function loginUsuario(data: LoginPayload) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const responseText = await res.text();

  if (!res.ok) {
    try {
      const json = JSON.parse(responseText);
      throw new Error(json.message || "Credenciales inválidas");
    } catch {
      throw new Error("Respuesta inesperada del servidor");
    }
  }

  return JSON.parse(responseText); // { token }
}
