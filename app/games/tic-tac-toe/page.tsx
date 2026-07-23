"use client";

import { useState } from "react";
import HomeLink from "@/components/HomeLink";

type Cell = "X" | "O" | null;

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(squares: Cell[]): Cell | null {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function TicTacToePage() {
  const [squares, setSquares] = useState<Cell[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winner = getWinner(squares);
  const isDraw = !winner && squares.every(Boolean);

  function handleClick(i: number) {
    if (squares[i] || winner) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  let status: string;
  if (winner) status = `${winner} wins!`;
  else if (isDraw) status = "It's a draw.";
  else status = `${xIsNext ? "X" : "O"}'s turn`;

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
          {squares.map((val, i) => (
            <button key={i} className="ttt-cell" onClick={() => handleClick(i)}>
              {val}
            </button>
          ))}
        </div>
        <button className="ttt-reset" onClick={handleReset}>
          Play again
        </button>
      </div>
    </main>
  );
}
