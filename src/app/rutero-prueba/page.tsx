"use client";

export default function RuteroLED() {
  return (
    <div className="relative bg-black p-4 rounded-lg w-full max-w-lg border-4 border-gray-800 overflow-hidden">
      {/* Fondo de puntos para simular LEDs */}
      <div className="absolute inset-0 bg-dots opacity-30"></div>

      <p className="text-4xl font-mono text-amber-500 tracking-widest font-led relative z-10 text-center">
        T31 - Calle 5 - Carrera 1
        <br />
        Chiminangos
      </p>
    </div>
  );
}
