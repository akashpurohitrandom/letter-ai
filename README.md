# Letters

A surprise site: a typed-letter "door" gate, then a landing page with a background photo and a Spotify playlist player, a "LETTERS" button that asks for a password, and a blog-style letters section behind it.

- `/` is the door — a typewriter-animated letter followed by a password prompt. Entering the door password unlocks `/main` for that browser session only (closing the browser means it replays next time).
- `/main` is public once past the door — shows the background, the Spotify playlist widget, and a LETTERS button with a live count.
- Clicking LETTERS asks for a separate password (in a modal); the correct one unlocks `/letters`, and stays remembered for 30 days.
- `/letters` is a blog-style list; click into any letter to read it in full.
- `/admin` lets you write and publish new letters instantly — currently left unprotected (add auth before sharing widely).

## What you're setting up

1. **Supabase** — a free hosted database that stores the letters.
2. **Spotify playlist** — just the playlist ID, embedded directly (no developer app or API keys needed).
3. **Vercel** — free hosting, deploys straight from this folder.

Takes about 10–15 minutes the first time. None of it requires ongoing payment for a small personal site like this.

---

## 1. Set up Supabase (database)

1. Go to https://supabase.com, sign up, and create a new project (any name/region, remember the database password it gives you — you won't need it directly, Supabase manages it).
2. Once the project is ready, go to **SQL Editor** in the left sidebar → **New query**.
3. Paste in the contents of `supabase.sql` (in this folder) and click **Run**. This creates the `letters` table.
4. Go to **Project Settings → API**. You'll need three values from here in step 4 below:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY` — keep this one secret, never share it or put it in client-side code.

## 2. Set up Spotify (for the playlist player)

1. Pick the playlist you want the site to play from. It must be a **public** playlist (or public-visible).
2. Open it in Spotify, click **Share → Copy link to playlist**. The link looks like:
   `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...`
   The part after `/playlist/` and before the `?` is your playlist ID.
3. That's it — no developer account, API keys, or backend needed. The site embeds Spotify's own player widget directly.

## 3. Configure environment variables

1. Copy `.env.example` to `.env.local`:
   ```
   cp .env.example .env.local
   ```
2. Fill in every value in `.env.local`:
   - `SITE_PASSWORD` — the password for the LETTERS gate.
   - `DOOR_PASSWORD` — the password for the very first door page (defaults to `july2026` if unset).
   - `AUTH_SECRET` — any long random string (mash your keyboard for 30+ characters).
   - The three Supabase values from step 1.4.
   - `NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID` from step 2.2.

## 4. Run it locally (optional, to test before deploying)

```
npm install
npm run dev
```

Visit http://localhost:3000 — you'll first see the door page with the typed letter and a password prompt. Enter the door password to reach `/main`, where you'll see the background, the Spotify player in the corner, and the LETTERS button with a count. Click it, enter the LETTERS password, and you'll land on the (empty) letters list. Go to http://localhost:3000/admin to write your first letter.

## 5. Deploy to Vercel

1. Push this folder to a GitHub repo (can be private).
2. Go to https://vercel.com, sign up/log in, click **Add New → Project**, and import the repo.
3. Before deploying, open **Environment Variables** and add every variable from your `.env.local` (same names, same values).
4. Click **Deploy**. In a minute or two you'll get a live URL like `letters-yourname.vercel.app`.
5. (Optional) In Vercel's project settings you can add a custom domain if you own one.

Share the URL and the password with your special someone. Write new letters any time at `/admin` on your live site — they'll appear in the letters section instantly.

## Notes on the Spotify player

Browsers block audio from auto-playing without a click — this is a browser rule, not something any website can override, Spotify embeds included. The playlist widget is shown ready to go on page load, but they'll need to tap play once. It supports native play/pause and skipping between tracks in the playlist.

## Notes on security

This is built for a personal, low-stakes gift — not a bank. Both password gates (the door and LETTERS) are single shared passwords, which is intentional and simple. The door password isn't remembered between browser sessions on purpose — it replays every visit. `/admin` is currently left open with no password — anyone with the link could write letters. Add protection there before sharing the site widely, or just ask and I'll wire it up.
