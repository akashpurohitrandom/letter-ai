import { supabase } from "@/lib/supabase";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import LettersGate from "@/components/LettersGate";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { count } = await supabase
    .from("letters")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return (
    <main className="landing">
      <SpotifyPlayer />
      <LettersGate count={count || 0} />
    </main>
  );
}
