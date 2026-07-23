import "./globals.css";
import ConditionalSpotify from "@/components/ConditionalSpotify";

// Background depends on time of day (IST), computed per-request.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Letters",
  description: "A little collection of letters",
};

function getTheme(): "theme-day" | "theme-night" {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      hourCycle: "h23",
    }).format(new Date())
  );
  return hour >= 6 && hour < 18 ? "theme-day" : "theme-night";
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = getTheme();

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
      <body className={theme}>
        <div className="bg-layer" />
        <div className="scanlines" />
        <ConditionalSpotify />
        {children}
      </body>
    </html>
  );
}
