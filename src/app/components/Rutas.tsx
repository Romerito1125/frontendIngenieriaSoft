import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type Ruta = {
    numero: string;
    nombre: string;
};

type RutasProps = {
    infoRutas: Ruta[];
};

export default function Rutas({ infoRutas }: RutasProps) {
    return (
        <div className="w-full">
            {infoRutas.map((ruta) => (
                <div 
                    key={ruta.numero} 
                    className="p-2 border-b border-gray-300 flex items-center justify-between"
                >
                    <span className="text-2xl font-bold w-1/4">{ruta.numero}</span>
                    
                    <span className="text-lg w-2/4 text-center">{ruta.nombre}</span>
                    
                    <button 
                        className="w-1/4 flex justify-end items-center gap-2"
                        aria-label="Buscar ruta"
                    >
                        <span className="text-sm px-2 py-1 rounded hover:bg-gray-200">Buscar</span>
                        <MagnifyingGlassIcon className="h-8 w-8 text-black hover:bg-gray-200 rounded-full p-1" />
                    </button>
                </div>
            ))}
        </div>
    );
}

