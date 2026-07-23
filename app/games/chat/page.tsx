"use client";

import { useEffect, useRef, useState } from "react";
import HomeLink from "@/components/HomeLink";

type Message = { text: string; sent_at: string };
type ChatState = { messages: Message[]; total_count: number };

const POLL_MS = 4000;
const LAST_SENT_KEY = "chat_last_sent_count";

export default function ChatPage() {
  const [chat, setChat] = useState<ChatState | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastSentCount, setLastSentCount] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_SENT_KEY);
    if (stored) setLastSentCount(Number(stored));
  }, []);

  async function load() {
    const res = await fetch("/api/chat", { cache: "no-store" });
    if (res.ok) setChat(await res.json());
  }

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setBusy(false);
    if (res.ok) {
      const data = await res.json();
      setChat(data);
      setText("");
      setLastSentCount(data.total_count);
      localStorage.setItem(LAST_SENT_KEY, String(data.total_count));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
    }
  }

  if (!chat) {
    return (
      <main className="container">
        <HomeLink />
        <header className="site-header">
          <div className="eyebrow">// a little game</div>
          <h1>Chat</h1>
        </header>
      </main>
    );
  }

  const waitingForReply = lastSentCount !== null && lastSentCount === chat.total_count;
  const oldestOrdinal = chat.total_count - chat.messages.length + 1;

  return (
    <main className="container">
      <HomeLink />
      <header className="site-header">
        <div className="eyebrow">// a little game</div>
        <h1>Chat</h1>
      </header>

      <div className="chat-wrap hud">
        <div className="chat-messages">
          {chat.messages.length === 0 && (
            <p className="chat-empty">No messages yet — say something.</p>
          )}
          {chat.messages.map((m, i) => {
            const ordinal = oldestOrdinal + i;
            const side = ordinal % 2 === 1 ? "left" : "right";
            return (
              <div key={ordinal} className={`chat-bubble chat-bubble-${side}`}>
                <p>{m.text}</p>
                <time>
                  {new Date(m.sent_at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form className="chat-form" onSubmit={handleSend}>
          <input
            type="text"
            placeholder={waitingForReply ? "Waiting for a reply..." : "Type a message"}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={waitingForReply || busy}
          />
          <button type="submit" disabled={waitingForReply || busy || !text.trim()}>
            Send
          </button>
        </form>
        {error && <p className="error">{error}</p>}
        {waitingForReply && (
          <p className="chat-hint">You sent the last message — waiting for a reply.</p>
        )}
      </div>
    </main>
  );
}
