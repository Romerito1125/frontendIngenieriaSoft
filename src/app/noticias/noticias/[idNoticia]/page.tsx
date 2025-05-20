'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function NoticiaDetalle() {
  const { idNoticia } = useParams();
  const [noticia, setNoticia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const res = await fetch(`https://servicionoticias.onrender.com/noticias/getNoticiaId/${idNoticia}`);
        const data = await res.json();
        setNoticia(data);
      } catch (error) {
        console.error('Error cargando la noticia:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [idNoticia]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!noticia) {
    return <p className="text-center text-red-500 mt-4">No se encontró la noticia.</p>;
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">{noticia.titulo}</h1>
      <p className="text-gray-700">{noticia.descripcion}</p>
      {noticia.link && (
        <a href={noticia.link} target="_blank" className="text-blue-600 underline">
          Ver fuente original
        </a>
      )}
      <p className="text-sm text-gray-500">Autor: {noticia.autor}</p>
      <p className="text-sm text-gray-400">
        Publicado el: {new Date(noticia.fecha).toLocaleDateString()}
      </p>
    </main>
  );
}
