"use client";

import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";
import axios from "axios";

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
  const [selectedEstacion, setSelectedEstacion] = useState<any>(null);
  const [estaciones, setEstaciones] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);

  const handleMapLoad = () => {
    setIconSize(new window.google.maps.Size(50, 50));
  };

  const iniciarSimulacion = async () => {
    try {
      await axios.post("http://localhost:3001/sim/inicio", {
        idruta: "E21"
      });
    } catch (err) {
      console.error("Error al iniciar simulación:", err);
    }
  };

  const obtenerEstaciones = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/sim/recorrido/E21");
      setEstaciones(data);
    } catch (err) {
      console.error("Error al obtener estaciones:", err);
    }
  };

  const obtenerBuses = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/sim/buses/E21");
      setBuses(data);
    } catch (err) {
      console.error("Error al obtener buses:", err);
    }
  };

  useEffect(() => {
    iniciarSimulacion();
    obtenerEstaciones();
    obtenerBuses();

    const interval = setInterval(() => {
      obtenerBuses();
    }, 15000); // actualiza cada 15s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <h2 className="text-xl font-bold text-center text-black mb-4">
        Mapa rutas tiempo real MIO
      </h2>
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
          }}
        >
          {/* Estaciones */}
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
                onClick={() => setSelectedEstacion(estacion)}
              />
            ))}

          {/* Buses */}
          {iconSize &&
            buses.map((bus) => (
              <Marker
                key={bus.idbus}
                position={{ lat: bus.lat, lng: bus.lon }}
                title={`Bus ${bus.idbus}`}
                icon={{
                  url: "/icono-bus.png",
                  scaledSize: iconSize,
                }}
              />
            ))}

          {/* InfoWindow para estación seleccionada */}
          {selectedEstacion && (
            <InfoWindow
              position={{
                lat: selectedEstacion.lat,
                lng: selectedEstacion.lon,
              }}
              onCloseClick={() => setSelectedEstacion(null)}
              options={{
                pixelOffset: new window.google.maps.Size(0, -35),
                disableAutoPan: true,
              }}
            >
              <div className="overflow-hidden rounded-lg">
                <div className="bg-blue-700 text-white rounded-md p-2 w-64">
                  <h3 className="text-yellow-400 font-bold text-sm mb-2 text-center">
                    {selectedEstacion.nombre}
                  </h3>
                  <p className="text-center text-xs">Estación activa</p>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
