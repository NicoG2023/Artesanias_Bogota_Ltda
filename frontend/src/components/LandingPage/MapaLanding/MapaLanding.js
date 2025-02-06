import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import userIcon from "../../../assets/marcador-casa.png";
import locationMarker from "../../../assets/marcador-rojo.png";
import "./MapaLanding.scss";

const LIBRARIES = ["places", "geometry", "marker"];
const DEFAULT_ZOOM = 15;

export function MapaLanding({ puntoVentaHook }) {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [closestDirections, setClosestDirections] = useState(null);
  const [selectedDirections, setSelectedDirections] = useState(null);
  const [storeLocations, setStoreLocations] = useState([]);
  const [storeMarkers, setStoreMarkers] = useState([]);
  const [closestStore, setClosestStore] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);

  const { puntosVenta, getPuntosVenta } = puntoVentaHook;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries: LIBRARIES,
  });

  // 1. Load sales points
  useEffect(() => {
    getPuntosVenta();
  }, [getPuntosVenta]);

  // 2. Get user location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // 3. Geocode addresses and find closest store
  useEffect(() => {
    if (!isLoaded || !userLocation || !puntosVenta.length) return;

    const geocoder = new window.google.maps.Geocoder();
    const validStores = puntosVenta.filter(
      (store) => store.direccion && !store.direccion.match(/online|digital/gi)
    );

    Promise.all(
      validStores.map(
        (store) =>
          new Promise((resolve) => {
            geocoder.geocode(
              { address: store.direccion },
              (results, status) => {
                if (status === "OK" && results[0]) {
                  resolve({
                    ...store,
                    position: results[0].geometry.location.toJSON(),
                  });
                } else resolve(null);
              }
            );
          })
      )
    ).then((stores) => {
      const filteredStores = stores.filter(Boolean);
      setStoreLocations(filteredStores);

      // Asegurar que cada store tenga un ID único
      const storesWithIds = filteredStores.map((store) => ({
        ...store,
        id: store.id || `${store.nombre}-${store.direccion}`, // Crear ID único si no existe
      }));

      setStoreLocations(storesWithIds);

      if (storesWithIds.length) {
        const closest = storesWithIds.reduce((prev, curr) => {
          const prevDist =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(userLocation),
              new window.google.maps.LatLng(prev.position)
            );
          const currDist =
            window.google.maps.geometry.spherical.computeDistanceBetween(
              new window.google.maps.LatLng(userLocation),
              new window.google.maps.LatLng(curr.position)
            );
          return currDist < prevDist ? curr : prev;
        });
        setClosestStore(closest);
      }
    });
  }, [isLoaded, userLocation, puntosVenta]);

  // 4. Calculate closest store route
  useEffect(() => {
    if (!map || !userLocation || !closestStore) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: closestStore.position,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setClosestDirections(result);
      }
    );
  }, [closestStore, map, userLocation]);

  // 5. User marker
  const userMarkerRef = useRef(null);
  useEffect(() => {
    if (
      !map ||
      !userLocation ||
      !window.google?.maps?.marker?.AdvancedMarkerElement
    )
      return;

    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
      userMarkerRef.current = null;
    }

    const { AdvancedMarkerElement } = window.google.maps.marker;
    const wrapper = document.createElement("div");
    wrapper.className = "marker-wrapper";

    const img = document.createElement("img");
    img.src = userIcon;
    img.alt = "Usuario";
    img.width = 45;
    img.height = 45;
    wrapper.appendChild(img);

    const marker = new AdvancedMarkerElement({
      map,
      position: userLocation,
      content: wrapper,
    });

    userMarkerRef.current = marker;

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
    };
  }, [map, userLocation]);

  // 6. Store markers with click handling
  useEffect(() => {
    if (
      !map ||
      !storeLocations.length ||
      !window.google?.maps?.marker?.AdvancedMarkerElement
    )
      return;

    storeMarkers.forEach((m) => (m.map = null));

    const { AdvancedMarkerElement } = window.google.maps.marker;

    const newMarkers = storeLocations.map((store) => {
      const wrapper = document.createElement("div");
      wrapper.className = "marker-wrapper";
      wrapper.style.pointerEvents = "auto";

      const img = document.createElement("img");
      img.src = locationMarker;
      img.alt = store.nombre;
      img.width = 35;
      img.height = 35;
      wrapper.appendChild(img);

      // Add label only if selected
      if (selectedStore?.id === store.id) {
        const labelDiv = document.createElement("div");
        labelDiv.className = "custom-label";
        labelDiv.innerHTML = `
          <strong>${store.nombre}</strong><br/>
          Dirección: ${store.direccion}<br/>
        `;
        wrapper.appendChild(labelDiv);
      }

      const marker = new AdvancedMarkerElement({
        map,
        position: store.position,
        content: wrapper,
      });

      marker.addListener("click", () => {
        setSelectedStore(store);
      });

      return marker;
    });

    setStoreMarkers(newMarkers);

    return () => newMarkers.forEach((m) => (m.map = null));
  }, [map, storeLocations, selectedStore]);

  // 7. Calculate selected store route
  useEffect(() => {
    if (!map || !userLocation || !selectedStore) {
      setSelectedDirections(null);
      return;
    }

    // Skip if selected store is the closest
    if (closestStore?.id === selectedStore.id) {
      setSelectedDirections(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: selectedStore.position,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") setSelectedDirections(result);
        else setSelectedDirections(null);
      }
    );
  }, [selectedStore, closestStore, map, userLocation]);

  if (!isLoaded) return <div>Cargando mapa...</div>;
  if (!userLocation) return <div>Obteniendo ubicación...</div>;

  return (
    <div className="mapa-landing">
      <h2 className="map-title">Encuentra nuestros puntos de venta</h2>

      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={userLocation}
          zoom={DEFAULT_ZOOM}
          options={{
            mapId: "DEMO_MAP_ID",
            disableDefaultUI: false,
            streetViewControl: true,
            zoomControl: true,
            fullscreenControl: true,
            mapTypeControl: true,
          }}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {/* Closest store route (always red) */}
          {closestDirections && (
            <DirectionsRenderer
              directions={closestDirections}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#FF0000",
                  strokeWeight: 4,
                },
              }}
            />
          )}

          {/* Selected store route (blue when not closest) */}
          {selectedDirections && (
            <DirectionsRenderer
              directions={selectedDirections}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: "#00008B",
                  strokeWeight: 4,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>
    </div>
  );
}
