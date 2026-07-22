"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LETTER_TEXT = `If you're reading this, you've successfully reached a place that was never meant to exist on the open internet. Think of it as a hidden node tucked away somewhere between timelines—a world where we are forever wrapped in midnight rain, the music never stops playing, and time only moves when you arrive. I built this place for one purpose: to leave behind pieces of my thoughts, my days, and my heart for you to discover whenever you choose to visit. Every letter you'll find here is another chapter, another memory, another conversation waiting patiently for you. You'll notice familiar things around you and countless little details that only you would appreciate. None of them are here by accident. This world belongs to us. And like every secret base, hidden archive, or Jedi temple worth finding, it has a gate. To enter, you'll need a password. I have a feeling you already know it. Welcome back. — BB`;

export default function DoorForm() {
  const [typed, setTyped] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(LETTER_TEXT.slice(0, i));
      if (i >= LETTER_TEXT.length) clearInterval(id);
    }, 15);
    return () => clearInterval(id);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/door-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/main");
    } else {
      setError("That's not quite it — try again.");
    }
  }

  const done = typed.length >= LETTER_TEXT.length;

  return (
    <div className="door-card hud">
      <p className="door-text">
        {typed}
        {!done && <span className="door-cursor">▍</span>}
      </p>

      <form className="door-form" onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter the password"
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
