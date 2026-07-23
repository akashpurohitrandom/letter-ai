import { supabase } from "@/lib/supabase";
import Clock from "@/components/Clock";
import StickyNote from "@/components/StickyNote";
import SideNav from "@/components/SideNav";

export const dynamic = "force-dynamic";

export default async function MainPage() {
  const { count } = await supabase
    .from("letters")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return (
    <main className="landing">
      <Clock />
      <StickyNote />
      <SideNav letterCount={count || 0} />
    </main>
  );
}
