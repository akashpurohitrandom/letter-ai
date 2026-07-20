import "./globals.css";
import SpotifyPlayer from "@/components/SpotifyPlayer";

export const metadata = {
  title: "Letters",
  description: "A little collection of letters",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="bg-layer" />
        <div className="scanlines" />
        <SpotifyPlayer />
        {children}
      </body>
    </html>
  );
}
