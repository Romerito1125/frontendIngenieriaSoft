"use client";

import { useState } from "react";
import md5 from "crypto-js/md5";


export default function RecargaPayU() {
  const [valor, setValor] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "4Vj8eK4rloUd272L48hsrarnUA";
  const merchantId = "508029";
  const currency = "COP";

  // Limpiar idTarjeta (quitar puntos y guiones)
  const tarjetaLimpia = tarjeta.replace(/[.-]/g, "");
  // Generar referencia única
  const referenceCode = `Recarga-${tarjetaLimpia}-${Date.now()}`;

  // Calcular firma
  const signature =
    valor && !isNaN(Number(valor))
      ? md5(`${apiKey}~${merchantId}~${referenceCode}~${valor}~${currency}`).toString()
      : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!valor || parseInt(valor) <= 0) {
      setError("Ingresa un valor válido.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      // Cambia aquí la URL para llamar a tu API externa
      const res = await fetch("https://serviciotarjetas.onrender.com/tarjetas/actualizarSaldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idTarjeta: tarjetaLimpia,
          monto: Number(valor),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al actualizar saldo");
      }

      // Si OK, continuar enviando formulario a PayU
      const form = e.currentTarget;
      form.submit();
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-white px-4">
      <div className="bg-[#4e8aff] text-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Recarga tu tarjeta</h2>

        <form
          method="post"
          action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
          onSubmit={handleSubmit}
        >
          <input name="merchantId" type="hidden" value={merchantId} />
          <input name="accountId" type="hidden" value="512321" />
          <input name="description" type="hidden" value="Recarga MIO" />
          <input name="referenceCode" type="hidden" value={referenceCode} />
          <input name="tax" type="hidden" value="0" />
          <input name="taxReturnBase" type="hidden" value="0" />
          <input name="currency" type="hidden" value={currency} />
          <input name="signature" type="hidden" value={signature} />
          <input name="test" type="hidden" value="0" />
          <input name="buyerEmail" type="hidden" value="test@test.com" />
          <input
            name="responseUrl"
            type="hidden"
            value="http://localhost:3000/confirmacion"
          />
          <input
            name="confirmationUrl"
            type="hidden"
            value="http://localhost:3000/confirmacion"
          />

          <label className="block mb-2 text-sm font-medium">Número de tarjeta</label>
          <input
            type="text"
            value={tarjeta}
            onChange={(e) => setTarjeta(e.target.value)}
            className="w-full bg-white text-blue-600 placeholder-blue-400 rounded-md px-4 py-2 mb-3"
          />

          <label className="block mb-2 text-sm font-medium">Valor a recargar (COP)</label>
          <input
            type="number"
            name="amount"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ej: 20000"
            className="w-full bg-white text-blue-600 placeholder-blue-400 rounded-md px-4 py-2 mb-3"
          />

          {error && <p className="text-red-200 text-sm mb-2">{error}</p>}
          {loading && <p className="text-yellow-200 text-sm mb-2">Actualizando saldo...</p>}

          <button
            type="submit"
            disabled={loading}
            className="relative w-full overflow-hidden bg-green-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 ease-in-out hover:text-white group disabled:opacity-50"
          >
            <span className="absolute left-0 top-0 h-full w-0 bg-green-500 group-hover:w-full transition-all duration-500 ease-out z-0"></span>
            <span className="relative z-10">Pagar con PayU</span>
          </button>
        </form>
      </div>
    </div>
  );
}
