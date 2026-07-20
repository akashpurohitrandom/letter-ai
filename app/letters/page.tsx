import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LettersPage() {
  const { data: letters } = await supabase
    .from("letters")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="container">
      <header className="site-header">
        <div className="eyebrow">// unlocked for you</div>
        <h1>Letters</h1>
      </header>

      {(!letters || letters.length === 0) && (
        <p style={{ textAlign: "center", color: "#8a7d6a" }}>
          Nothing here yet — the first letter is on its way.
        </p>
      )}

      {letters?.map((letter) => (
        <Link key={letter.id} href={`/letters/${letter.slug}`} className="letter-card hud">
          <h2>{letter.title}</h2>
          <time>
            {new Date(letter.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </Link>
      ))}
    </main>
  );
}
