type Ruta = {
    numero: string;
    nombre: string;
};

type RutasProps = {
    infoRutas: Ruta[];
};

export default function Rutas({ infoRutas } : RutasProps) {
    return (
        <>
            <div className="cursor-pointer">
            </div>
            {infoRutas.map((ruta) => (
                <div key={ruta.numero} className="p-2 border-b border-gray-300 flex-row w-full items-center">
                    <span  className="text-lg tracking-widest font-bold mr-4 leading-none">Número ruta: {ruta.numero}</span>
                    <div className="text-sm font-mono text-amber-500 tracking-widest leading-tight">Destino ruta: {ruta.nombre}</div>
                </div>
            ))}
            <div className="cursor-pointer">
            </div>
        </>
    );
}
