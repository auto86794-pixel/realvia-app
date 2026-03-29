"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

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

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<SelectedListing | null>(null);

  const refs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => setListings(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main style={{ display: "flex", height: "100vh" }}>
      <div
        style={{
          width: "40%",
          overflowY: "auto",
          padding: "20px",
          borderRight: "1px solid #ddd",
        }}
      >
        <h1>Lakások</h1>

        {listings.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) {
                refs.current[item.id] = el;
              }
            }}
            onClick={() =>
              setSelected({
                id: item.id,
                title: item.title,
                price: item.price,
                lat: item.lat,
                lng: item.lng,
              })
            }
            style={{
              border:
                selected?.id === item.id ? "2px solid #0070f3" : "1px solid #ccc",
              borderRadius: "12px",
              overflow: "hidden",
              marginBottom: "15px",
              cursor: "pointer",
              background: selected?.id === item.id ? "#f8fbff" : "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "12px" }}>
              <h3 style={{ margin: "0 0 8px 0" }}>{item.title}</h3>
              <p style={{ margin: "0 0 6px 0" }}>📍 {item.location}</p>
              <p style={{ margin: 0 }}>💰 {item.price.toLocaleString()} Ft</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ width: "60%" }}>
        <Map
          listings={listings}
          selected={selected}
          onSelect={(item) =>
            setSelected({
              id: item.id,
              title: item.title,
              price: item.price,
              lat: item.lat,
              lng: item.lng,
            })
          }
        />
      </div>
    </main>
  );
}