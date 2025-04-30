"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "800px",
  border: "3px solid #008bcc",
};

const center = {
  lat: 3.4516,
  lng: -76.531985,
};

const estaciones = [
  { nombre: "Unidad Deportiva", lat: 3.4294, lng: -76.5446 },
  { nombre: "Estadio", lat: 3.4371, lng: -76.5292 },

  
  { nombre: "Menga", lat: 3.489289, lng: -76.508435 },
  { nombre: "Alamos", lat: 3.484499, lng: -76.513305 },
  { nombre: "Vipasa", lat: 3.478601, lng: -76.517001  },
  { nombre: "Prados del Norte", lat: 3.4744873, lng: -76.519584 },
  { nombre: "Las Américas", lat: 3.463576, lng: -76.525274 },
  { nombre: "Versalles", lat: 3.4611281, lng: -76.52684 },
  { nombre: "Torre de Cali", lat: 3.456793, lng: -76.530279 },
  { nombre: "La Ermita", lat: 3.4534367, lng: -76.5316067 },
  { nombre: "Plaza de Cayzedo", lat: 3.452425, lng: -76.531374 },
  { nombre: "Centro", lat: 3.4486624, lng: -76.5301074 },
  { nombre: "Fray Damián", lat: 3.443605, lng: -76.528799 },
  { nombre: "Sucre", lat: 3.443845, lng: -76.526378 },
  { nombre: "Petecuy", lat: 3.449041, lng: -76.527942 },
  { nombre: "San Bosco", lat: 3.442262, lng: -76.5331011 },
  { nombre: "San Pascual", lat: 3.442640, lng: -76.527372 },
  { nombre: "San Pedro", lat: 3.4543975, lng: -76.5299721 },
  { nombre: "Melendez", lat : 3.377102, lng: -76.542792},
  {nombre: "Buitrera", lat:3.372691, lng:-76.540197},
  {nombre: "Univalle", lat: 3.370922, lng: -76.536840},
  {nombre: "Universidades", lat: 3.367070, lng: -76.529170}
  
];

export default function MapaMIO() {
  const [iconSize, setIconSize] = useState<google.maps.Size | null>(null);

  const handleMapLoad = () => {
    setIconSize(new window.google.maps.Size(50, 50));
  };

  return (
    <div className="h-screen w-full px-4 md:px-8 py-4">
      <h2 className="text-xl font-bold text-center text-black mb-4">Mapa rutas tiempo real MIO</h2>
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
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: [
                  {
                    visibility: 'off'
                  }
                ]
              }
            ]

          }}
        >
          {iconSize &&
            estaciones.map((estacion) => (
              <Marker
                key={estacion.nombre}
                position={{ lat: estacion.lat, lng: estacion.lng }}
                title={estacion.nombre}
                icon={{
                  url: "/icono-parada.png",
                  scaledSize: iconSize,
                }}
              />
            ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
