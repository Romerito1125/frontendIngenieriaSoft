"use client";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  iniciarSimulacion,
  obtenerEstaciones,
  obtenerBuses,
  obtenerTiempoEstacion,
  obtenerRutasDisponibles,
  Estacion,
  Bus,
  TiempoEstacionBus,
  Ruta,
} from "./utils";

const containerStyle = {
  width: "100%",
  height: "800px",
};

const center = {
  lat: 3.4516,
  lng: -76.531985,
};

export default function MapaMIO() {
  const [iconSize, setIconSize] = useState<google.maps.Size | null>(null);
  const [selectedEstacion, setSelectedEstacion] = useState<Estacion | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [idruta, setIdRuta] = useState("");
  const [rutaActiva, setRutaActiva] = useState("");
  const [tiempoEstacion, setTiempoEstacion] = useState<TiempoEstacionBus[]>([]);
  const [rutasDisponibles, setRutasDisponibles] = useState<string[]>([]);
  const [sugerencias, setSugerencias] = useState<string[]>([]);

  const handleMapLoad = () => {
    setIconSize(new window.google.maps.Size(50, 50));
  };

  const iniciarSimulacionHandler = async () => {
    try {
      await iniciarSimulacion(idruta);
      setRutaActiva(idruta);
      const estacionesData = await obtenerEstaciones(idruta);
      setEstaciones(estacionesData);
    } catch (err) {
      console.error("Error al iniciar simulación:", err);
    }
  };

  const obtenerBusesHandler = useCallback(async () => {
    if (!rutaActiva) return;
    try {
      const busesData = await obtenerBuses(rutaActiva);
      setBuses(busesData);
    } catch (err) {
      console.error("Error al obtener buses:", err);
    }
  }, [rutaActiva]);

  const obtenerTiempoEstacionHandler = async (idestacion: number) => {
    try {
      const tiempos = await obtenerTiempoEstacion(idestacion);
      setTiempoEstacion(tiempos);
    } catch (err) {
      console.error("Error al obtener tiempo de llegada:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (rutaActiva) obtenerBusesHandler();
    }, 30000);
    return () => clearInterval(interval);
  }, [rutaActiva, obtenerBusesHandler]);

  useEffect(() => {
    if (!selectedEstacion) return;

    const intervaloTiempo = setInterval(() => {
      obtenerTiempoEstacionHandler(selectedEstacion.idestacion);
    }, 31000);

    return () => clearInterval(intervaloTiempo);
  }, [selectedEstacion]);

  useEffect(() => {
    const fetchRutas = async () => {
      try {
        const rutas = await obtenerRutasDisponibles();
        setRutasDisponibles(rutas.map((ruta) => ruta.idruta));
      } catch (error) {
        console.error("Error al cargar rutas:", error);
      }
    };

    fetchRutas();
  }, []);

  const handleInputRuta = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setIdRuta(valor);
    const filtradas = rutasDisponibles.filter((ruta) =>
      ruta.toLowerCase().includes(valor.toLowerCase())
    );
    setSugerencias(valor.length > 0 ? filtradas : []);
  };

  const seleccionarSugerencia = (ruta: string) => {
    setIdRuta(ruta);
    setSugerencias([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idruta.trim()) iniciarSimulacionHandler();
  };

  return (
    <div className="w-full px-4 md:px-8 py-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-extrabold text-center text-blue-900 mb-4">
        Mapa de rutas en tiempo real del MIO
      </h2>

      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col sm:flex-row items-center justify-center gap-3 bg-blue-700 px-6 py-4 rounded-xl mb-6 shadow-md"
      >
        <div className="relative flex flex-col w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <Image src="/icono-bus.png" alt="Bus" width={24} height={24} className="w-6 h-6" />
            <input
              type="text"
              placeholder="Ingresa ID de ruta o bus"
              value={idruta}
              onChange={handleInputRuta}
              className="w-full sm:w-60 px-4 py-2 bg-white text-gray-800 border border-blue-500 rounded-md placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
            />
          </div>
          {sugerencias.length > 0 && (
            <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-md shadow-lg z-50 w-60 max-h-48 overflow-auto">
              {sugerencias.map((ruta) => (
                <div
                  key={ruta}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => seleccionarSugerencia(ruta)}
                >
                  {ruta}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-md hover:bg-yellow-300 transition"
        >
          Enviar
        </button>
      </form>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onLoad={handleMapLoad}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            disableDefaultUI: true,
            styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
          }}
        >
          {iconSize &&
            buses.map((bus) => (
              <Marker
                key={bus.idbus}
                position={{ lat: bus.lat, lng: bus.lon }}
                title={`Bus ${bus.idbus}`}
                animation={google.maps.Animation.DROP}
                icon={{ url: "/icono-bus.png", scaledSize: iconSize }}
                onClick={() => setSelectedBus(bus)}
              />
            ))}

          {iconSize &&
            estaciones.map((estacion) => (
              <Marker
                key={estacion.idestacion}
                position={{ lat: estacion.lat, lng: estacion.lon }}
                title={estacion.nombre}
                icon={{ url: "/icono-parada.png", scaledSize: iconSize }}
                onClick={() => {
                  setSelectedEstacion(estacion);
                  obtenerTiempoEstacionHandler(estacion.idestacion);
                }}
              />
            ))}

          {selectedEstacion && (
            <InfoWindow
              position={{ lat: selectedEstacion.lat, lng: selectedEstacion.lon }}
              onCloseClick={() => {
                setSelectedEstacion(null);
                setTiempoEstacion([]);
              }}
              options={{ pixelOffset: new window.google.maps.Size(0, -35), disableAutoPan: true }}
            >
              <div className="overflow-hidden rounded-lg">
                <div className="w-80 rounded-md overflow-hidden border border-blue-900 shadow-md">
                  <div className="bg-blue-700 text-yellow-400 font-bold text-center py-2 text-sm">
                    {selectedEstacion.nombre}
                  </div>
                  {tiempoEstacion.length > 0 ? (
                    <div className="text-sm">
                      {tiempoEstacion.map((bus, index) => (
                        <div
                          key={bus.idbus}
                          className={`flex justify-between px-3 py-2 ${
                            index % 2 === 0 ? "bg-blue-100" : "bg-white"
                          }`}
                        >
                          <span className="text-blue-900 font-semibold">{bus.idruta}</span>
                          <span className="text-gray-700 text-center">{bus.destino}</span>
                          <span className="text-gray-800 font-semibold">
                            {bus.tiempo === "0 min" ? "Llegó" : `${bus.tiempo}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="bg-white text-center p-2 text-gray-600 text-sm">
                      No hay buses próximos
                    </p>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}

          {selectedBus && (
            <InfoWindow
              position={{ lat: selectedBus.lat, lng: selectedBus.lon }}
              onCloseClick={() => setSelectedBus(null)}
              options={{ pixelOffset: new window.google.maps.Size(0, -35), disableAutoPan: true }}
            >
              <div className="overflow-hidden rounded-lg">
                <div className="bg-white rounded-md p-3 w-56 shadow-md border border-gray-300">
                  <h3 className="text-blue-800 font-bold text-sm text-center mb-1">
                    🚌 Bus {selectedBus.idbus}
                  </h3>
                  <p className="text-xs text-center text-gray-800">
                    Ruta: <span className="font-semibold">{selectedBus.idruta}</span>
                  </p>
                  <p className="text-xs text-center text-gray-800">
                    Dirección: <span className="font-semibold">{selectedBus.enVuelta ? "Vuelta" : "Ida"}</span>
                  </p>
                  <p className="text-xs text-center text-gray-800">
                    Destino: <span className="font-semibold">{selectedBus.destino}</span>
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
