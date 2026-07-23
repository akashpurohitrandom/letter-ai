import Link from "next/link";

const LINKS = [
  { href: "/games/tic-tac-toe", label: "Tic Tac Toe" },
  { href: "/games/chat", label: "Chat" },
];

export default function GamesNav() {
  return (
    <nav className="games-nav">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="games-nav-link">
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
