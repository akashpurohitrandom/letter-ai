"use client";

import { useEffect, useState } from "react";
import HomeLink from "@/components/HomeLink";

type Cell = "X" | "O" | null;
type Status = "in_progress" | "X" | "O" | "draw";

type GameState = {
  board: Cell[];
  next_player: "X" | "O";
  status: Status;
  player1_wins: number;
  player2_wins: number;
  draws: number;
};

const POLL_MS = 4000;

export default function TicTacToePage() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await fetch("/api/tic-tac-toe", { cache: "no-store" });
    if (res.ok) setGame(await res.json());
  }

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, []);

  async function handleMove(index: number) {
    if (!game || game.board[index] || game.status !== "in_progress" || busy) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/tic-tac-toe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "move", index }),
    });
    setBusy(false);
    if (res.ok) {
      setGame(await res.json());
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      load();
    }
  }

  async function handleReset() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/tic-tac-toe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reset" }),
    });
    setBusy(false);
    if (res.ok) setGame(await res.json());
  }

  if (!game) {
    return (
      <main className="container">
        <HomeLink />
        <header className="site-header">
          <div className="eyebrow">// a little game</div>
          <h1>Tic Tac Toe</h1>
        </header>
      </main>
    );
  }

  let status: string;
  if (game.status === "X") status = "Player 1 (X) wins!";
  else if (game.status === "O") status = "Player 2 (O) wins!";
  else if (game.status === "draw") status = "It's a draw.";
  else status = `${game.next_player === "X" ? "Player 1 (X)" : "Player 2 (O)"}'s turn`;

  return (
    <main className="container">
      <HomeLink />
      <header className="site-header">
        <div className="eyebrow">// a little game</div>
        <h1>Tic Tac Toe</h1>
      </header>

      <div className="ttt-wrap hud">
        <p className="ttt-status">{status}</p>

        <div className="ttt-board">
          {game.board.map((val, i) => (
            <button
              key={i}
              className="ttt-cell"
              onClick={() => handleMove(i)}
              disabled={!!val || game.status !== "in_progress" || busy}
            >
              {val}
            </button>
          ))}
        </div>

        {error && <p className="error">{error}</p>}

        {game.status !== "in_progress" && (
          <button className="ttt-reset" onClick={handleReset} disabled={busy}>
            New game
          </button>
        )}

        <p className="ttt-record">
          Player 1 wins: {game.player1_wins} &nbsp;·&nbsp; Player 2 wins: {game.player2_wins}
          &nbsp;·&nbsp; Draws: {game.draws}
        </p>
      </div>
    </main>
  );
}
