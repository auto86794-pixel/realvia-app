"use client";

import { useEffect, useState, useRef } from "react";
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

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);

  const refs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetch("/api/listings")
      .then((res) => res.json())
      .then((data) => setListings(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main style={{ display: "flex", height: "100vh" }}>
      {/* BAL OLDAL */}
      <div style={{ width: "40%", overflowY: "auto", padding: "20px" }}>
        <h1>Lakások</h1>

        {listings.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) {
                refs.current[item.id] = el;
              }
            }}
            onClick={() => setSelected(item)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              cursor: "pointer",
              background:
                selected?.id === item.id ? "#f0f0f0" : "white",
            }}
          >
            <h3>{item.title}</h3>
            <p>📍 {item.location}</p>
            <p>💰 {item.price.toLocaleString()} Ft</p>
          </div>
        ))}
      </div>

      {/* JOBB OLDAL */}
      <div style={{ width: "60%" }}>
        <Map listings={listings} selected={selected} />
      </div>
    </main>
  );
}