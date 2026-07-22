import { supabase } from "@/lib/supabase";
import LettersGate from "@/components/LettersGate";
import Clock from "@/components/Clock";
import GoogleSearch from "@/components/GoogleSearch";
import StickyNote from "@/components/StickyNote";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  const { count } = await supabase
    .from("letters")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return (
    <main className="landing">
      <Clock />
      <LettersGate count={count || 0} />
      <GoogleSearch />
      <StickyNote />
    </main>
  );
}
