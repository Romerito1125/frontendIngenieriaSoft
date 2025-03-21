import Rutas from "../components/Rutas";


const infoRutas = [
  { numero: "A01", nombre: "Terminal Menga - Flora Industrial" },
  { numero: "A02", nombre: "Terminal Andrés Sanín - Villa del Sur" },
  { numero: "A03", nombre: "Terminal Calipso - Ciudad Córdoba" },
  { numero: "A04", nombre: "Terminal Cañaveralejo - Universidades" },
  { numero: "A05", nombre: "Terminal Menga - Centro" },
  { numero: "A06", nombre: "Terminal Andrés Sanín - San Bosco" },
  { numero: "A07", nombre: "Terminal Calipso - San Pedro" },
  { numero: "A08", nombre: "Terminal Cañaveralejo - Capri" },
  { numero: "A09", nombre: "Terminal Menga - Vipasa" },
  { numero: "A10", nombre: "Terminal Andrés Sanín - El Trébol" }
];
export default function rutasPage() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold justify-self-center">Conoce las rutas del sistema</h1>
        <Rutas infoRutas = {infoRutas} />
      </div>
    );
  }
