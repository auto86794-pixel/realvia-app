"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

type Listing = {
  id: number;
  title: string;
  price: number;
  lat: number;
  lng: number;
};

function FlyTo({ selected }: { selected: Listing | null }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      map.flyTo([selected.lat, selected.lng], 13);
    }
  }, [selected]);

  return null;
}

export default function Map({
  listings,
  selected,
  onSelect,
}: {
  listings: Listing[];
  selected: Listing | null;
  onSelect: (item: Listing) => void;
}) {
  return (
    <MapContainer
      center={[47.4979, 19.0402]}
      zoom={7}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 🔥 AUTO ZOOM */}
      <FlyTo selected={selected} />

      {listings.map((item) => (
        <Marker
          key={item.id}
          position={[item.lat, item.lng]}
          eventHandlers={{
            click: () => onSelect(item),
          }}
        >
          <Popup>
            <strong>{item.title}</strong>
            <br />
            💰 {item.price.toLocaleString()} Ft
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}