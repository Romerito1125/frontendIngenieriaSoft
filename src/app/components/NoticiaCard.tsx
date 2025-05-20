'use client';

import Link from 'next/link';

type NoticiaProps = {
  idnoticia: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  autor: string;
  link?: string;
  tipo: string;
};

export default function NoticiaCard({ idnoticia, titulo, descripcion, fecha, autor, link, tipo }: NoticiaProps) {
  return (
    <div className="border border-blue-300 bg-blue-50 rounded-xl p-4 shadow-sm space-y-2">
      <div className="flex items-center gap-2">
        <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Noticia</div>
        <h2 className="font-bold">{titulo}</h2>
      </div>
      <p className="text-gray-700">{descripcion}</p>
      <Link href={`/noticias/${idnoticia}`} className="text-sm text-blue-600 underline">
        Ver más
      </Link>
      <p className="text-sm text-gray-500">Autor: {autor}</p>
      <p className="text-sm text-gray-400">{new Date(fecha).toLocaleDateString()}</p>
    </div>
  );
}
