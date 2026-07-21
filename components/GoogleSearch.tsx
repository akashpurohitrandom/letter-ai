"use client";

import { useState } from "react";

export default function GoogleSearch() {
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  }

  return (
    <form className="google-search" onSubmit={handleSubmit}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search Google"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}
