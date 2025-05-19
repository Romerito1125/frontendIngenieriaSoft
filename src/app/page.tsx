import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const sections = [
    { name: "Rutas", path: "/rutas", icon: "/svg/Rutas1.svg" },
    { name: "Buses por Estación", path: "/buses-por-estacion", icon: "/svg/BusesPorEstacion1.svg" },
    { name: "Saldo y Recargas", path: "/saldo-y-recargas", icon: "/svg/Saldo1.svg" },
    { name: "Planea tu Viaje", path: "/planea-tu-viaje", icon: "/svg/PlaneaTuViaje1.svg" },
    { name: "Mapa MIO", path: "/mapa", icon: "/svg/MapaMIO1.svg" },
    { name: "Noticias", path: "/noticias", icon: "/svg/Noticias1.svg" },
    { name: "Denuncias", path: "/denuncias", icon: "/svg/Denuncias1.svg" },
    { name: "Foro", path: "/Foro", icon: "/svg/GrupoWhatsapp1.svg" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center text-blue-800">
          Hola, ¿Qué quieres consultar?
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full max-w-xl place-items-center">
          {sections.map((section, index) => (
            <Link
              href={section.path}
              key={index}
              className="flex flex-col items-center p-6 border border-gray-300 rounded-xl transition-transform hover:-translate-y-1 hover:shadow-lg w-48 h-48 justify-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 flex justify-center items-center">
                <Image src={section.icon} alt={section.name} width={60} height={60} className="object-cover" />
              </div>
              <h2 className="mt-4 text-sm md:text-base font-medium text-center text-blue-800">
                {section.name}
              </h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
