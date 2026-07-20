"use client";

import { useEffect, useState } from "react";

export default function SpotifyPlayer() {
  const [track, setTrack] = useState<{ id: string; name: string; artists: string } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/spotify", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(true);
        else setTrack(data);
      })
      .catch(() => setError(true));
  }, []);

  if (error) return null; // fail quietly — the letters matter more than the song
  if (!track) return null;

  return (
    <div className="spotify-box hud">
      <iframe
        src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
      <p className="caption">a song for today — press play</p>
    </div>
  );
}
