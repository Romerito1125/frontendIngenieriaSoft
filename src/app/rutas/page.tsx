import Rutas from "../components/Rutas";

const infoRutas = [
  { numero: "T31", nombre: "Terminal Paso del Comercio - Universidades", horario: "L-D | 05:00 AM - 10:00 PM", tipo: "troncal" },
  { numero: "E21", nombre: "Terminal Menga - Universidades", horario: "L-V | 05:00 AM - 09:30 PM", tipo: "expreso" },
  { numero: "E37", nombre: "Terminal Menga - Universidades Express", horario: "L-V | 04:30 AM - 09:30 PM", tipo: "expreso" },
  { numero: "T51", nombre: "Terminal Menga - Terminal Cañaveralejo", horario: "L-D | 05:00 AM - 11:00 PM", tipo: "troncal" },
  { numero: "A01A", nombre: "Torre de Cali - Prados del Sur", horario: "L-D | 05:00 AM - 10:30 PM", tipo: "alimentador" }
];

export default function rutasPage() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Conoce las rutas del MIO</h1>
        <Rutas infoRutas={infoRutas} />
      </div>
    );
}
