"use client";

import { useEffect, useState } from "react";

type Letter = { id: string; slug: string; title: string; created_at: string; published: boolean };

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [letters, setLetters] = useState<Letter[]>([]);

  async function loadLetters() {
    const res = await fetch("/api/letters", { cache: "no-store" });
    if (res.ok) setLetters(await res.json());
  }

  useEffect(() => {
    loadLetters();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Publishing...");
    const res = await fetch("/api/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, published: true }),
    });
    if (res.ok) {
      setStatus("Published!");
      setTitle("");
      setContent("");
      loadLetters();
    } else {
      setStatus("Something went wrong.");
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Delete this letter?")) return;
    await fetch(`/api/letters/${slug}`, { method: "DELETE" });
    loadLetters();
  }

  return (
    <main className="container">
      <div className="eyebrow" style={{ marginBottom: 6 }}>// admin</div>
      <h1>Write a letter</h1>
      <form className="admin-form hud" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write it here... (Markdown supported)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Publish</button>
        {status && <span style={{ marginLeft: 12 }}>{status}</span>}
      </form>

      <div className="admin-list hud">
        <h2>Published letters</h2>
        <ul>
          {letters.map((l) => (
            <li key={l.id}>
              {l.title}{" "}
              <button onClick={() => handleDelete(l.slug)} style={{ marginLeft: 8 }}>
                delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
