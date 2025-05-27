// components/AccionBotones.tsx
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

export default function AccionBotones() {
  return (
    <div className="flex gap-4">
      {/* Botón Crear */}
      <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-md transition">
        <PlusCircle size={20} />
        Crear
      </button>

      {/* Botón Editar */}
      <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-md transition">
        <Pencil size={20} />
        Editar
      </button>

      {/* Botón Eliminar */}
      <button className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md transition">
        <Trash2 size={20} />
        Eliminar
      </button>
    </div>
  );
}
