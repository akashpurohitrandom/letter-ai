"use client";

import { usePathname } from "next/navigation";
import SpotifyPlayer from "./SpotifyPlayer";

export default function ConditionalSpotify() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <SpotifyPlayer />;
}
