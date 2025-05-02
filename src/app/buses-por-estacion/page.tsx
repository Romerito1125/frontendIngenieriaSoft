import Link from "next/link";


export default function BusesPorEstacion() {
  return (
    <div className="p-4">

      <Link
        href="/buses-realtime"
        className="flex flex-col items-center p-6 border border-gray-300 rounded-xl transition-transform hover:-translate-y-1 hover:shadow-lg w-48 h-48 justify-center"
      >
        <div>hola</div>
        </Link>
        <h1 className="text-2xl font-bold">Buses por Estación</h1>
        <p>Esta es la página de Buses por Estación.</p>
    </div>
  );
}
