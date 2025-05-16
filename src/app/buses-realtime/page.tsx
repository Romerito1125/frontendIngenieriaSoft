// src/app/buses-realtime/page.tsx

"use client";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface Estacion {
  idestacion: number;
  nombre: string;
  lat: number;
  lon: number;
}

interface Bus {
  idbus: number;
  idruta: string;
  lat: number;
  lon: number;
  enVuelta: boolean;
  destino: string;
}

type TiempoEstacionBus = {
  idbus: number;
  idruta: string;
  tiempo: string;
  destino: string;
};

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
  const [tiempoEstacion, setTiempoEstacion] = useState<TiempoEstacionBus[]>([]);

  const handleMapLoad = () => {
    setIconSize(new window.google.maps.Size(50, 50));
  };

  const iniciarSimulacion = async () => {
    try {
      await axios.post("https://www.tiemporeal.devcorebits.com/sim/inicio", { idruta });
      obtenerEstaciones();
    } catch (err) {
      console.error("Error al iniciar simulación:", err);
    }
  };

  const obtenerEstaciones = async () => {
    try {
      const { data } = await axios.get(
        `https://www.tiemporeal.devcorebits.com/sim/recorrido/${idruta}`
      );
      setEstaciones(data);
    } catch (err) {
      console.error("Error al obtener estaciones:", err);
    }
  };

  const obtenerBuses = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `https://www.tiemporeal.devcorebits.com/sim/buses/${idruta}`
      );
      setBuses(data);
    } catch (err) {
      console.error("Error al obtener buses:", err);
    }
  }, [idruta]);

  const obtenerTiempoEstacion = async (idestacion: number) => {
    try {
      const { data } = await axios.get(`https://www.tiemporeal.devcorebits.com/sim/tiempo-llegada/${idestacion}`);
      setTiempoEstacion(data);
    } catch (error) {
      console.error("Error al obtener tiempo de llegada:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (idruta) obtenerBuses();
    }, 100);
    return () => clearInterval(interval);
  }, [idruta, obtenerBuses]);

  useEffect(() => {
    if (!selectedEstacion) return;

    const intervaloTiempo = setInterval(() => {
      obtenerTiempoEstacion(selectedEstacion.idestacion);
    }, 1000);

    return () => clearInterval(intervaloTiempo);
  }, [selectedEstacion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idruta.trim()) iniciarSimulacion();
  };

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <h2 className="text-xl font-bold text-center text-black mb-2">Mapa rutas tiempo real MIO</h2>

      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center bg-blue-700 p-2 rounded-md gap-2 mb-4"
      >
        <img src="/icono-bus.png" alt="Bus" className="w-8 h-8" />
        <input
          type="text"
          placeholder="Ruta o bus"
          value={idruta}
          onChange={(e) => setIdRuta(e.target.value)}
          className="p-1 rounded-sm w-48 text-black"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-black font-bold px-3 py-1 rounded hover:bg-yellow-300"
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
            styles: [
              { featureType: "poi", stylers: [{ visibility: "off" }] },
            ],
          }}
        >
          {iconSize &&
            estaciones.map((estacion) => (
              <Marker
                key={estacion.idestacion}
                position={{ lat: estacion.lat, lng: estacion.lon }}
                title={estacion.nombre}
                icon={{
                  url: "/icono-parada.png",
                  scaledSize: iconSize,
                }}
                onClick={() => {
                  setSelectedEstacion(estacion);
                  obtenerTiempoEstacion(estacion.idestacion);
                }}
              />
            ))}

          {iconSize &&
            buses.map((bus) => (
              <Marker
                key={bus.idbus}
                position={{ lat: bus.lat, lng: bus.lon }}
                title={`Bus ${bus.idbus}`}
                animation={google.maps.Animation.DROP}
                icon={{
                  url: "/icono-bus.png",
                  scaledSize: iconSize,
                }}
                onClick={() => setSelectedBus(bus)}
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
                    Dirección:{" "}
                    <span className="font-semibold">
                      {selectedBus.enVuelta ? "Vuelta" : "Ida"}
                    </span>
                  </p>
                  <p className="text-xs text-center text-gray-800">
                    Destino:{" "}
                    <span className="font-semibold">{selectedBus.destino}</span>
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
