"use client";

import { useSearchParams } from "next/navigation";

export default function ResultadoPago() {
  const searchParams = useSearchParams();

  const camposMostrar: Record<string, string> = {
    transactionState: "Estado de la Transacción",
    lapTransactionState: "Estado Detallado",
    message: "Mensaje",
    referenceCode: "Código de Referencia",
    transactionId: "ID de Transacción",
    description: "Descripción",
    polPaymentMethod: "Código Método Pago",
    lapPaymentMethod: "Método de Pago",
    TX_VALUE: "Valor",
    currency: "Moneda",
    buyerEmail: "Email Comprador",
    authorizationCode: "Código de Autorización",
    processingDate: "Fecha Procesamiento",
  };

  // Construir params objeto de forma dinámica
  const params: Record<string, string> = {};
  Object.keys(camposMostrar).forEach((key) => {
    const val = searchParams.get(key);
    if (val) params[key] = val;
  });

  const pagoAprobado =
    params.transactionState === "4" || params.lapTransactionState === "APPROVED";

  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "40px auto",
        background: "white",
        padding: "30px 40px",
        borderRadius: "10px",
        boxShadow: "0 8px 24px rgb(0 0 0 / 0.05)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#0033cc",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#0047cc",
          marginBottom: "15px",
        }}
      >
        Resultado de la Transacción
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#1a4dcc",
          fontWeight: "500",
          marginTop: 0,
          marginBottom: "30px",
        }}
      >
        Resumen del pago realizado con PayU
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
          fontSize: "1.4rem",
          fontWeight: "700",
          color: pagoAprobado ? "#28a745" : "#dc3545",
        }}
      >
        {pagoAprobado ? "¡Pago Aprobado!" : "Pago No Aprobado"}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "25px",
        }}
      >
        {Object.entries(camposMostrar).map(([key, label]) => {
          const value = params[key];
          if (!value) return null;
          return (
            <div
              key={key}
              style={{
                background: "#f0f6ff",
                borderRadius: "10px",
                padding: "18px 20px",
                boxShadow: "inset 0 0 5px rgb(0 102 255 / 0.15)",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontWeight: "700",
                  marginBottom: "8px",
                  color: "#0047cc",
                }}
              >
                {label}
              </label>
              <span
                style={{
                  color: "#0033cc",
                  fontSize: "1.1rem",
                  wordBreak: "break-word",
                }}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
    </main>
  );
}
