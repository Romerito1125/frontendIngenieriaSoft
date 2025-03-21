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
                    <span  className="text-lg tracking-widest font-bold">Número ruta: {ruta.numero}</span>
                    <div>Destino ruta: {ruta.nombre}</div>
                </div>
            ))}
            <div className="cursor-pointer">
            </div>
        </>
    );
}
