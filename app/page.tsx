"use client";

import { useEffect, useRef, useState } from "react";
import Map from "../components/Map";

type Listing = {
  id: number;
  title: string;
  price: number;
  location: string;
  lat: number;
  lng: number;
  imageUrl: string;
};

export default function Page() {
  const [data, setData] = useState<Listing[]>([]);
  const [filtered, setFiltered] = useState<Listing[]>([]);
  const [selected, setSelected] = useState<Listing | null>(null);

  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  const refs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    fetch("http://localhost:3000/api/listings")
      .then((res) => res.json())
      .then((json) => {
        let list: Listing[] = [];

        if (Array.isArray(json)) list = json;
        else if (Array.isArray(json.data)) list = json.data;

        setData(list);
        setFiltered(list);
      })
      .catch(() => {
        setData([]);
        setFiltered([]);
      });
  }, []);

  useEffect(() => {
    let result = data;

    if (city) result = result.filter((i) => i.location === city);
    result = result.filter((i) => i.price <= maxPrice);

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.title.toLowerCase().includes(s) ||
          i.location.toLowerCase().includes(s)
      );
    }

    setFiltered(result);
  }, [city, maxPrice, search, data]);

  useEffect(() => {
    if (selected && refs.current[selected.id]) {
      refs.current[selected.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selected]);

  const cities = [...new Set(data.map((i) => i.location))];

  const bg = dark ? "#111" : "#fff";
  const text = dark ? "#fff" : "#000";
  const card = dark ? "#1a1a1a" : "#fff";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, color: text }}>
      {/* BAL */}
      <div style={{ width: "40%", padding: "20px", borderRight: "1px solid #444", overflowY: "auto" }}>
        
        {/* 🌙 TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          style={{
            marginBottom: "10px",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        <h2>Lakások</h2>

        {/* SEARCH */}
        <input
          placeholder="🔍 Keresés..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        {/* CITY */}
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="">Összes város</option>
          {cities.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* PRICE */}
        <input
          type="range"
          min="1000000"
          max="50000000"
          step="500000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: "100%" }}
        />

        <p>Max ár: {maxPrice.toLocaleString()} Ft</p>

        {filtered.map((item) => (
          <div
            key={item.id}
            ref={(el) => (refs.current[item.id] = el)}
            onClick={() => setSelected(item)}
            style={{
              background: card,
              border:
                selected?.id === item.id
                  ? "2px solid #0070f3"
                  : "1px solid #333",
              borderRadius: "12px",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            <img src={item.imageUrl} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
            <div style={{ padding: "10px" }}>
              <h3>{item.title}</h3>
              <p>{item.location}</p>
              <p>{item.price.toLocaleString()} Ft</p>
            </div>
          </div>
        ))}
      </div>

      {/* JOBB */}
      <div style={{ width: "60%", height: "100vh" }}>
        <Map listings={filtered} selected={selected} onSelect={setSelected} />
      </div>
    </div>
  );
}