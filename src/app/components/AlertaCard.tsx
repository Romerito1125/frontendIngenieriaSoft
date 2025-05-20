// components/AlertaCard.tsx
import React from 'react';

type AlertaProps = {
  mensaje: string;
  hora: string;
  tipo: string;
  idestacion: string;
  idruta: string;
  prioridad: string;
};

export default function AlertaCard({ mensaje, hora, tipo, idestacion, idruta, prioridad }: AlertaProps) {
  return (
    <div className="border border-red-300 bg-red-50 rounded-xl p-4 shadow-sm space-y-2">
      <div className="flex items-center gap-2">
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Alerta</div>
        <h2 className="font-bold">{tipo} - Prioridad: {prioridad}</h2>
      </div>
      <p className="text-gray-700">{mensaje}</p>
      <p className="text-sm text-gray-500">Ruta: {idruta} | Estación: {idestacion}</p>
      <p className="text-sm text-gray-400">{new Date(hora).toLocaleString()}</p>
    </div>
  );
}
