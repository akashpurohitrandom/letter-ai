export default function SpotifyPlayer() {
  const playlistId = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID;
  if (!playlistId) return null;

  return (
    <div className="spotify-corner hud">
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}
