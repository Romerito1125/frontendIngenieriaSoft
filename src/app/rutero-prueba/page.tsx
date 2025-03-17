"use client";

export default function RuteroLED() {
  return (
    <div className="relative bg-black p-4 rounded-lg w-full max-w-lg border-4 border-gray-800 overflow-hidden flex items-center p-6">
      {/* Fondo de puntos para simular LEDs */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,200,0,0.5)_1px,transparent_1px)] bg-[size:6px_6px] opacity-30"></div>
      
      <div className="relative z-10 flex flex-row w-full items-center">
        {/* Código de ruta */}
        <span className="text-6xl font-mono text-amber-500 tracking-widest font-bold mr-4 leading-none drop-shadow-[0_0_4px_#ffcc00]">
          T31
        </span>
        
        {/* Destino */}
        <div className="text-3xl font-mono text-amber-500 tracking-widest leading-tight drop-shadow-[0_0_4px_#ffcc00]">
          <p>Carrera 1 - Centro</p>
          <p>Universidades</p>
        </div>
      </div>
    </div>
  );
}

