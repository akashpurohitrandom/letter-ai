"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CHAT_LAST_SENT_KEY = "chat_last_sent_count";
const TTT_LAST_MOVE_KEY = "ttt_last_move_total";
const POLL_MS = 5000;

export default function SideNav({ letterCount }: { letterCount: number }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatPending, setChatPending] = useState(false);
  const [tttPending, setTttPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkChat() {
      try {
        const res = await fetch("/api/chat", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const stored = localStorage.getItem(CHAT_LAST_SENT_KEY);
        const lastSent = stored ? Number(stored) : null;
        setChatPending(data.total_count > 0 && lastSent !== data.total_count);
      } catch {
        // ignore — badge just stays hidden
      }
    }

    async function checkTicTacToe() {
      try {
        const res = await fetch("/api/tic-tac-toe", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const stored = localStorage.getItem(TTT_LAST_MOVE_KEY);
        const lastMove = stored ? Number(stored) : null;
        setTttPending(data.total_moves > 0 && lastMove !== data.total_moves);
      } catch {
        // ignore — badge just stays hidden
      }
    }

    checkChat();
    checkTicTacToe();
    const id = setInterval(() => {
      checkChat();
      checkTicTacToe();
    }, POLL_MS);
    return () => clearInterval(id);
  }, []);

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
      <nav className="side-nav">
        <button className="side-link" onClick={() => setOpen(true)}>
          <span className="side-link-count">{letterCount}</span>
          Letters
        </button>
        <Link href="/games/tic-tac-toe" className="side-link">
          {tttPending && <span className="side-link-badge">*</span>}
          Tic Tac Toe
        </Link>
        <Link href="/games/chat" className="side-link">
          {chatPending && <span className="side-link-badge">*</span>}
          Chat
        </Link>
      </nav>

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
