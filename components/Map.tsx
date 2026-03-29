"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { useEffect } from "react";

type Listing = {
  id: number;
  title: string;
  price: number;
  location: string;
  lat: number;
  lng: number;
  imageUrl: string;
};

type SelectedListing = {
  id: number;
  title: string;
  price: number;
  lat: number;
  lng: number;
};

type MapProps = {
  listings: Listing[];
  selected: SelectedListing | null;
  onSelect: (item: SelectedListing) => void;
};

function FlyToSelected({ selected }: { selected: SelectedListing | null }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 15, {
        duration: 1.2,
      });
    }
  }, [selected, map]);

  return null;
}

export default function Map({ listings, selected, onSelect }: MapProps) {
  const center: LatLngExpression = [47.4979, 19.0402];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FlyToSelected selected={selected} />

      {listings.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          eventHandlers={{
            click: () =>
              onSelect({
                id: item.id,
                title: item.title,
                price: item.price,
                lat: item.lat,
                lng: item.lng,
              }),
          }}
        >
          <Popup>
            <div>
              <h3 style={{ margin: 0 }}>{item.title}</h3>
              <p style={{ margin: "8px 0" }}>
                {item.price.toLocaleString()} Ft
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}