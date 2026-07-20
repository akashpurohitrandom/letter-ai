import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // never cache — we want a new pick every refresh

async function getAccessToken() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const basic = Buffer.from(`${id}:${secret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to authenticate with Spotify");
  const data = await res.json();
  return data.access_token as string;
}

export async function GET() {
  try {
    const playlistId = process.env.SPOTIFY_PLAYLIST_ID;
    if (!playlistId) {
      return NextResponse.json({ error: "No playlist configured" }, { status: 500 });
    }

    const token = await getAccessToken();

    // Playlists can have >100 tracks; Spotify paginates in pages of 100.
    let items: any[] = [];
    let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&fields=items(track(id,name,artists(name),uri)),next`;

    while (url) {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch playlist");
      const data = await res.json();
      items = items.concat(data.items || []);
      url = data.next;
    }

    const tracks = items
      .map((i) => i.track)
      .filter((t) => t && t.id);

    if (tracks.length === 0) {
      return NextResponse.json({ error: "Playlist has no playable tracks" }, { status: 404 });
    }

    const track = tracks[Math.floor(Math.random() * tracks.length)];

    return NextResponse.json({
      id: track.id,
      name: track.name,
      artists: track.artists?.map((a: any) => a.name).join(", "),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Spotify error" }, { status: 500 });
  }
}
