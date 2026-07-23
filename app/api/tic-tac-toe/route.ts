import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

type Cell = "X" | "O" | null;
type Status = "in_progress" | "X" | "O" | "draw";

type GameRow = {
  id: number;
  board: Cell[];
  next_player: "X" | "O";
  status: Status;
  player1_wins: number;
  player2_wins: number;
  draws: number;
};

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

function getWinner(board: Cell[]): Cell | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

const DEFAULT_ROW = {
  id: 1,
  board: Array(9).fill(null) as Cell[],
  next_player: "X" as const,
  status: "in_progress" as const,
  player1_wins: 0,
  player2_wins: 0,
  draws: 0,
};

async function getOrCreateRow(db: ReturnType<typeof supabaseAdmin>): Promise<GameRow> {
  const { data } = await db.from("tic_tac_toe").select("*").eq("id", 1).maybeSingle();
  if (data) return data as GameRow;

  const { data: created, error } = await db
    .from("tic_tac_toe")
    .insert(DEFAULT_ROW)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return created as GameRow;
}

export async function GET() {
  const db = supabaseAdmin();
  try {
    const row = await getOrCreateRow(db);
    return NextResponse.json(row);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  const body = await req.json();

  try {
    const row = await getOrCreateRow(db);

    if (body.type === "reset") {
      const { data, error } = await db
        .from("tic_tac_toe")
        .update({
          board: Array(9).fill(null),
          next_player: "X",
          status: "in_progress",
          updated_at: new Date().toISOString(),
        })
        .eq("id", 1)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return NextResponse.json(data);
    }

    if (body.type === "move") {
      const index = body.index as number;

      if (row.status !== "in_progress") {
        return NextResponse.json({ error: "This game is over — start a new game." }, { status: 409 });
      }
      if (typeof index !== "number" || index < 0 || index > 8 || row.board[index]) {
        return NextResponse.json({ error: "That cell isn't available." }, { status: 400 });
      }

      const board = row.board.slice();
      board[index] = row.next_player;

      const winner = getWinner(board);
      const isDraw = !winner && board.every(Boolean);

      const update: Partial<GameRow> & { updated_at: string } = {
        board,
        updated_at: new Date().toISOString(),
        next_player: row.next_player === "X" ? "O" : "X",
        status: "in_progress",
      };

      if (winner) {
        update.status = winner;
        update.player1_wins = winner === "X" ? row.player1_wins + 1 : row.player1_wins;
        update.player2_wins = winner === "O" ? row.player2_wins + 1 : row.player2_wins;
      } else if (isDraw) {
        update.status = "draw";
        update.draws = row.draws + 1;
      }

      const { data, error } = await db.from("tic_tac_toe").update(update).eq("id", 1).select().single();
      if (error) throw new Error(error.message);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown request type" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
