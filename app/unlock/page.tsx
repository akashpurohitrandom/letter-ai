"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function UnlockForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

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
      router.push(params.get("next") || "/");
      router.refresh();
    } else {
      setError("That's not quite it — try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="unlock-card hud">
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
  );
}

export default function UnlockPage() {
  return (
    <main className="unlock-page">
      <Suspense fallback={null}>
        <UnlockForm />
      </Suspense>
    </main>
  );
}
