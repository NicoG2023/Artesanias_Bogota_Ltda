import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  DirectionsRenderer,
} from "@react-google-maps/api";
import userIcon from "../../../assets/marcador-casa.png";
import locationMarker from "../../../assets/marcador-rojo.png";
import "./MapaLanding.scss";

const PUNTOS_DE_VENTA = [
  {
    id: 1,
    nombre: "Tienda A",
    direccion: "Carrera 7 #72-41, Bogotá, Colombia",
  },
  {
    id: 2,
    nombre: "Tienda B",
    direccion: "Calle 10 #5-51, Medellín, Colombia",
  },
  {
    id: 3,
    nombre: "Tienda C",
    direccion: "Carrera 5 #17-76, Cartagena, Colombia",
  },
];

export function MapaLanding() {
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [storeLocations, setStoreLocations] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const mapContainerStyle = { width: "100%", height: "400px" };

  // Obtiene la ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación del usuario:", error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Geocodifica las direcciones de las tiendas
  const geocodeStores = (google) => {
    const geocoder = new google.maps.Geocoder();

    Promise.all(
      PUNTOS_DE_VENTA.map(
        (store) =>
          new Promise((resolve) => {
            geocoder.geocode(
              { address: store.direccion },
              (results, status) => {
                if (status === "OK" && results[0]) {
                  resolve({
                    ...store,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                  });
                } else {
                  console.error(
                    `Geocoding error for ${store.nombre}: ${status}`
                  );
                  resolve(null);
                }
              }
            );
          })
      )
    ).then((locs) => setStoreLocations(locs.filter(Boolean)));
  };

  // Calcula la ruta a la tienda más cercana
  const calculateRouteToNearestStore = (google) => {
    if (!userLocation || storeLocations.length === 0) return;

    const nearestStore = storeLocations.reduce(
      (closest, store) => {
        const distance = Math.sqrt(
          Math.pow(userLocation.lat - store.lat, 2) +
            Math.pow(userLocation.lng - store.lng, 2)
        );
        return distance < closest.distance ? { ...store, distance } : closest;
      },
      { distance: Infinity }
    );

    if (!nearestStore) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: nearestStore.lat, lng: nearestStore.lng },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Error calculando la ruta:", status);
        }
      }
    );
  };

  // onLoad del GoogleMap => se llama cuando la librería está lista
  const handleMapLoad = () => {
    if (!window.google) return;
    geocodeStores(window.google);
  };

  // Cuando cambian userLocation o storeLocations, recalcular la ruta
  useEffect(() => {
    if (window.google) {
      calculateRouteToNearestStore(window.google);
    }
  }, [userLocation, storeLocations]);

  return (
    <div className="mapa-landing">
      <h2 className="map-title">Encuentra nuestros puntos de venta</h2>

      {!userLocation ? (
        <p>Cargando mapa...</p>
      ) : (
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API}
          libraries={["places", "geometry"]}
        >
          <GoogleMap
            onLoad={handleMapLoad}
            mapContainerStyle={mapContainerStyle}
            center={userLocation}
            zoom={10}
          >
            {/* Marcador del usuario */}
            <Marker
              position={userLocation}
              icon={{
                url: userIcon,
                scaledSize: { width: 30, height: 30 },
                labelOrigin: { x: 15, y: -5 },
              }}
              label={{
                text: "Tú",
                color: "#000000",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            />

            {/* Marcadores de tiendas */}
            {storeLocations.map((store) => (
              <Marker
                key={store.id}
                position={{ lat: store.lat, lng: store.lng }}
                icon={{
                  url: locationMarker,
                  scaledSize: { width: 30, height: 30 },
                  labelOrigin: { x: 15, y: -5 },
                }}
                label={{
                  text: store.nombre,
                  color: "#000000",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                onClick={() => setSelectedStore(store)}
              />
            ))}

            {/* Renderizar la ruta */}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{ suppressMarkers: true }}
              />
            )}

            {/* InfoWindow al hacer click en una tienda */}
            {selectedStore && (
              <InfoWindow
                position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
                onCloseClick={() => setSelectedStore(null)}
              >
                <div>
                  <h3>{selectedStore.nombre}</h3>
                  <p>{selectedStore.direccion}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}
