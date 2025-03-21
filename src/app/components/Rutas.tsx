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
                    <span className="text-2xl font-bold">{ruta.numero}</span>
                    <span className="text-lg flex-1 text-right">{ruta.nombre}</span>
                </div>
            ))}
        </div>
    );
}
