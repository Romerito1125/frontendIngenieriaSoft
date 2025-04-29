"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useEffect, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "800px", // angosto pero largo
};

const center = {
  lat: 3.4516,
  lng: -76.531985,
};

const estaciones = [
  { nombre: "Universidades", lat: 3.3411, lng: -76.5309 },
  { nombre: "Unidad Deportiva", lat: 3.4294, lng: -76.5446 },
  { nombre: "Estadio", lat: 3.4371, lng: -76.5292 },
];

export default function MapaMIO() {
  const [iconSize, setIconSize] = useState<google.maps.Size>();

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      setIconSize(new window.google.maps.Size(30, 30));
    }
  }, []);

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <h2 className="text-xl font-bold text-center text-black mb-4">Mapa rutas tiempo real MIO</h2>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            disableDefaultUI: true,
          }}
        >
          {iconSize &&
            estaciones.map((estacion, index) => (
              <Marker
                key={index}
                position={{ lat: estacion.lat, lng: estacion.lng }}
                title={estacion.nombre}
                icon={{
                  url: "/bus-icon.png",
                  scaledSize: iconSize,
                }}
              />
            ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
