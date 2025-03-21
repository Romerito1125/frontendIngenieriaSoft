"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

type Ruta = {
    numero: string;
    nombre: string;
    horario?: string;
};

type RutasProps = {
    infoRutas: Ruta[];
};

export default function Rutas({ infoRutas }: RutasProps) {
    const [search, setSearch] = useState("");

    const filteredRutas = infoRutas.filter((ruta) =>
        ruta.numero.toLowerCase().includes(search.toLowerCase()) ||
        ruta.nombre.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Barra de búsqueda */}
            <div className="flex items-center gap-2 mb-4 p-2 border rounded-md">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
                <input
                    type="text"
                    placeholder="Buscar ruta..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none"
                />
            </div>
            
            {/* Lista de rutas */}
            <div className="space-y-2">
                {filteredRutas.map((ruta) => (
                    <div 
                        key={ruta.numero} 
                        className="flex items-center p-3 border rounded-md shadow-md"
                    >
                        <span className="text-white font-bold px-3 py-1 rounded bg-yellow-500">{ruta.numero}</span>
                        <div className="ml-4">
                            <span className="block text-lg font-semibold">{ruta.nombre}</span>
                            {ruta.horario && (
                                <span className="block text-sm text-gray-600">{ruta.horario}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}