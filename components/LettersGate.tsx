"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LettersGate({ count }: { count: number }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/letters");
    } else {
      setError("That's not quite it — try again.");
    }
  }

  return (
    <>
      <button className="letters-cta hud" onClick={() => setOpen(true)}>
        LETTERS
        <span className="letters-count">{count}</span>
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <form
            className="unlock-card hud"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h1>For you</h1>
            <p>This little corner of the internet is just for you.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the password"
              autoFocus
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Unlock"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
