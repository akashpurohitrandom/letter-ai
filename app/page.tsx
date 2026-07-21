import { supabase } from "@/lib/supabase";
import LettersGate from "@/components/LettersGate";
import Clock from "@/components/Clock";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { count } = await supabase
    .from("letters")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return (
    <main className="landing">
      <LettersGate count={count || 0} />
      <Clock />
    </main>
  );
}
