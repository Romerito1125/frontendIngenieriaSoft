"use client";

import React, { Suspense } from "react";
import ResultadoPago from "./ResultadoPago";

export default function ConfirmacionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResultadoPago />
    </Suspense>
  );
}
