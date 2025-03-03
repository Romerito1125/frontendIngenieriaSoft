import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const sections = [
    { name: 'Rutas', path: '/rutas', icon: '/icons/rutas.png' },
    { name: 'Buses por Estación', path: '/buses-por-estacion', icon: '/icons/buses.jpg' },
    { name: 'Saldo y Recargas Tullave', path: '/saldo-y-recargas', icon: '/icons/saldo.png' },
    { name: 'Planea tu Viaje', path: '/planea-tu-viaje', icon: '/icons/planea.png' },
    { name: 'Mapa TM', path: '/mapa', icon: '/icons/mapa.png' },
    { name: 'Noticias', path: '/noticias', icon: '/icons/noticias.png' },
    { name: 'Denuncias', path: '/denuncias', icon: '/icons/denuncias.png' },
    { name: 'Canal WhatsApp Seguridad - Emergencias', path: '/canal-de-whatsapp', icon: '/icons/whatsapp.png' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      {/* HEADER */}
      <header className="w-full flex justify-between items-center p-4 border-b border-gray-200 bg-white">
        <div className="cursor-pointer">
          <Image src="/icons/3 PUNTOS.png" alt="Opciones" width={40} height={40} />
        </div>
        <div className="cursor-pointer">
          <Image src="/icons/3Lineas.png" alt="Menú" width={40} height={40} />
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center">Hola, ¿Qué quieres consultar?</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl place-items-center">
          {sections.map((section, index) => (
            <Link href={section.path} key={index} className="flex flex-col items-center p-6 border border-gray-300 rounded-xl transition-transform hover:-translate-y-1 hover:shadow-lg w-48 h-48 justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 flex justify-center items-center">
                <Image src={section.icon} alt={section.name} width={80} height={80} className="object-cover" />
              </div>
              <h2 className="mt-4 text-sm md:text-base font-medium text-center">{section.name}</h2>
            </Link>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full p-4 text-center border-t border-gray-200 bg-white text-sm">
        <p>Recárgame desde plataformas digitales</p>
      </footer>
    </div>
  );
}
