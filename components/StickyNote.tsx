"use client";

import { useEffect, useState } from "react";

type Note = { message: string; updated_at: string };

export default function StickyNote() {
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    fetch("/api/note", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setNote(data))
      .catch(() => setNote(null));
  }, []);

  if (!note || !note.message) return null;

  return (
    <div className="sticky-note">
      <p>{note.message}</p>
      <time>
        {new Date(note.updated_at).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </time>
    </div>
  );
}
