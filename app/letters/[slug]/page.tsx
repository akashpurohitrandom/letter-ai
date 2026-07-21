import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import HomeLink from "@/components/HomeLink";

export const dynamic = "force-dynamic";

export default async function LetterPage({ params }: { params: { slug: string } }) {
  const { data: letter } = await supabase
    .from("letters")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!letter) return notFound();

  return (
    <main className="container">
      <HomeLink />
      <Link href="/letters" className="back-link">&larr; back to all letters</Link>
      <h1>{letter.title}</h1>
      <time>
        {new Date(letter.created_at).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
      <div className="letter-content" style={{ marginTop: 24 }}>
        <ReactMarkdown>{letter.content}</ReactMarkdown>
      </div>
    </main>
  );
}
