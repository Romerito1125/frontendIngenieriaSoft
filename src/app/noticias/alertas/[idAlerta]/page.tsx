// s


'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Alerta {
  tipo: string;
  mensaje: string;
  idruta: string;
  idestacion: string;
  prioridad: string;
  hora: string;
}

export default function AlertaDetalle() {
  const { idAlerta } = useParams();
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerta = async () => {
      try {
        const res = await fetch(`https://www.alertas.devcorebits.com/alertas/alertaEspecifica/${idAlerta}`);
        const data: Alerta = await res.json();
        setAlerta(data);
      } catch (error) {
        console.error('Error cargando la alerta:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerta();
  }, [idAlerta]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!alerta) {
    return <p className="text-center text-red-500 mt-4">No se encontró la alerta.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{alerta.tipo}</h1>
      <p className="text-gray-700">{alerta.mensaje}</p>
      <p className="text-sm text-gray-500">Ruta: {alerta.idruta}</p>
      <p className="text-sm text-gray-500">Estación: {alerta.idestacion}</p>
      <p className="text-sm text-gray-500">Prioridad: {alerta.prioridad}</p>
      <p className="text-sm text-gray-400">
        Hora: {new Date(alerta.hora).toLocaleString()}
      </p>
    </main>
  );
}
