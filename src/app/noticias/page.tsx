'use client';

import { useEffect, useState } from 'react';
import AlertaCard from '../components/AlertaCard';
import NoticiaCard from '../components/NoticiaCard';

export default function Page() {
  const [noticias, setNoticias] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loadingNoticias, setLoadingNoticias] = useState(true);
  const [loadingAlertas, setLoadingAlertas] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const res = await fetch('https://servicionoticias.onrender.com/noticias/listarNoticias');
        const data = await res.json();
        setNoticias(data);
      } catch (error) {
        console.error('Error al cargar noticias:', error);
      } finally {
        setLoadingNoticias(false);
      }
    };

    const fetchAlertas = async () => {
      try {
        const res = await fetch('https://www.alertas.devcorebits.com/alertas/listarAlertas');
        const data = await res.json();
        setAlertas(data);
      } catch (error) {
        console.error('Error al cargar alertas:', error);
      } finally {
        setLoadingAlertas(false);
      }
    };

    fetchNoticias();
    fetchAlertas();
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10">
      <section>
        <h1 className="text-2xl font-bold mb-4">🚨 Alertas</h1>
        <div className="space-y-4">
          {loadingAlertas ? (
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : alertas.length === 0 ? (
            <p className="text-red-500">No hay alertas disponibles.</p>
          ) : (
            alertas.map((alerta: any) => (
              <AlertaCard key={alerta.idalerta} {...alerta} />
            ))
          )}
        </div>
      </section>

      <section>
        <h1 className="text-2xl font-bold mb-4">📰 Noticias</h1>
        <div className="space-y-4">
          {loadingNoticias ? (
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : noticias.length === 0 ? (
            <p className="text-red-500">No hay noticias disponibles.</p>
          ) : (
            noticias.map((noticia: any) => (
              <NoticiaCard key={noticia.idnoticia} {...noticia} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
