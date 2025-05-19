"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

type Ruta = {
    idruta: string;
    tipo: string;
    horariolunvier?: string;
    horariofinsem?: string;
    LugarInicio: string;
    LugarFin: string;
    LugaresConcurridos?: string;
};

export default function Rutas() {
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchRutas = async () => {
            try {
                const res = await axios.get("https://tiemporeal.onrender.com/rutas");
                
                // Verifica que la respuesta sea un array
                const data = Array.isArray(res.data) ? res.data : res.data.data;

                setRutas(data);
            } catch (error) {
                console.error("Error al obtener las rutas", error);
            }
        };
        fetchRutas();
    }, []);

    const filteredRutas = rutas.filter((ruta) => {
        const numero = ruta.idruta || "";
        const nombre = `${ruta.LugarInicio} - ${ruta.LugarFin}`;
        return (
            numero.toLowerCase().includes(search.toLowerCase()) ||
            nombre.toLowerCase().includes(search.toLowerCase())
        );
    });

    const getColorByType = (tipo: string) => {
        switch (tipo.toLowerCase()) {
            case "troncal":
                return "bg-red-600";
            case "pretroncal":
                return "bg-blue-600";
            case "expreso":
                return "bg-yellow-500";
            case "alimentador":
                return "bg-green-600";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white">
            {/* Barra de búsqueda */}
            <div className="flex items-center gap-2 mb-4 p-2 border rounded-md">
                <MagnifyingGlassIcon className="h-6 w-6 text-black" />
                <input
                    type="text"
                    placeholder="Buscar ruta..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full outline-none text-black"
                />
            </div>

            {/* Lista de rutas */}
            <div className="space-y-2">
                {filteredRutas.map((ruta) => (
                    <div
                        key={ruta.idruta}
                        className="flex items-center p-3 border rounded-md shadow-md text-black"
                    >
                        {/* Código de la ruta con color por tipo */}
                        <span
                            className={`text-white font-bold px-3 py-1 rounded ${getColorByType(ruta.tipo)}`}
                        >
                            {ruta.idruta}
                        </span>

                        {/* Nombre y horario */}
                        <div className="ml-4">
                            <span className="block text-lg font-semibold">
                                {ruta.LugarInicio} - {ruta.LugarFin}
                            </span>
                            <span className="block text-sm text-gray-600">
                                {ruta.horariolunvier ?? ruta.horariofinsem}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}