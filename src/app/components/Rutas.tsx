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
                        className="p-1 rounded-full hover:bg-gray-200 w-1/4 flex justify-end items-center gap-2"
                        aria-label="Buscar ruta"
                    >
                        <span className="text-sm">Buscar</span>
                        <MagnifyingGlassIcon className="h-8 w-8 text-black" />
                    </button>
                </div>
            ))}
        </div>
    );
}

