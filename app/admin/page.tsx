"use client";

import { useEffect, useState } from "react";

type Letter = { id: string; slug: string; title: string; created_at: string; published: boolean };

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [letters, setLetters] = useState<Letter[]>([]);

  const [note, setNote] = useState("");
  const [currentNote, setCurrentNote] = useState<{ message: string; updated_at: string } | null>(null);
  const [noteStatus, setNoteStatus] = useState("");

  async function loadLetters() {
    const res = await fetch("/api/letters", { cache: "no-store" });
    if (res.ok) setLetters(await res.json());
  }

  async function loadNote() {
    const res = await fetch("/api/note", { cache: "no-store" });
    if (res.ok) setCurrentNote(await res.json());
  }

  useEffect(() => {
    loadLetters();
    loadNote();
  }, []);

  async function handleNoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNoteStatus("Sending...");
    const res = await fetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: note }),
    });
    if (res.ok) {
      setNoteStatus("Sent!");
      setNote("");
      loadNote();
    } else {
      setNoteStatus("Something went wrong.");
    }
  }

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
          placeholder="Subject"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write the body here... (Markdown supported)"
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

      <div className="eyebrow" style={{ marginTop: 40, marginBottom: 6 }}>// sticky note</div>
      <h1>Push a message</h1>
      <p style={{ color: "var(--text-muted)", marginTop: -12, marginBottom: 20 }}>
        Only one message is shown at a time — sending a new one replaces it.
      </p>
      <form className="admin-form hud" onSubmit={handleNoteSubmit}>
        <input
          type="text"
          placeholder="A short message for the sticky note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required
        />
        <button type="submit">Send</button>
        {noteStatus && <span style={{ marginLeft: 12 }}>{noteStatus}</span>}
      </form>

      {currentNote && (
        <div className="admin-list hud">
          <h2>Currently showing</h2>
          <p style={{ margin: "8px 0 4px" }}>{currentNote.message}</p>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {new Date(currentNote.updated_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      )}
    </main>
  );
}
