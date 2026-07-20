# Letters

A private, password-protected letters blog with a Spotify soundtrack that changes on every visit.

- Write letters in a simple admin page — they publish instantly to the blog.
- Every page load plays a random track from a Spotify playlist you choose.
- The whole site is locked behind a single password.

## What you're setting up

1. **Supabase** — a free hosted database that stores the letters.
2. **Spotify Developer app** — free, lets the site pull a random track from your playlist.
3. **Vercel** — free hosting, deploys straight from this folder.

Takes about 15–20 minutes the first time. None of it requires ongoing payment for a small personal site like this.

---

## 1. Set up Supabase (database)

1. Go to https://supabase.com, sign up, and create a new project (any name/region, remember the database password it gives you — you won't need it directly, Supabase manages it).
2. Once the project is ready, go to **SQL Editor** in the left sidebar → **New query**.
3. Paste in the contents of `supabase.sql` (in this folder) and click **Run**. This creates the `letters` table.
4. Go to **Project Settings → API**. You'll need three values from here in step 4 below:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (click "Reveal") → `SUPABASE_SERVICE_ROLE_KEY` — keep this one secret, never share it or put it in client-side code.

## 2. Set up Spotify (for the random song)

1. Go to https://developer.spotify.com/dashboard and log in with any Spotify account.
2. Click **Create app**. Name/description can be anything. For "Redirect URI" you can put `https://example.com` (unused here, but Spotify requires one). Save.
3. Open the app, click **Settings**, and copy the **Client ID** and **Client Secret**.
4. Pick the playlist you want the site to play from. It must be a **public** playlist (or public-visible). Open it in Spotify, click **Share → Copy link to playlist**. The link looks like:
   `https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...`
   The part after `/playlist/` and before the `?` is your playlist ID.

## 3. Configure environment variables

1. Copy `.env.example` to `.env.local`:
   ```
   cp .env.example .env.local
   ```
2. Fill in every value in `.env.local`:
   - `SITE_PASSWORD` — whatever password you want your special someone to type in.
   - `AUTH_SECRET` — any long random string (mash your keyboard for 30+ characters).
   - The three Supabase values from step 1.4.
   - `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` from step 2.3.
   - `SPOTIFY_PLAYLIST_ID` from step 2.4.

## 4. Run it locally (optional, to test before deploying)

```
npm install
npm run dev
```

Visit http://localhost:3000 — it should ask for the password, then show the (empty) blog and a song. Go to http://localhost:3000/admin to write your first letter.

## 5. Deploy to Vercel

1. Push this folder to a GitHub repo (can be private).
2. Go to https://vercel.com, sign up/log in, click **Add New → Project**, and import the repo.
3. Before deploying, open **Environment Variables** and add every variable from your `.env.local` (same names, same values).
4. Click **Deploy**. In a minute or two you'll get a live URL like `letters-yourname.vercel.app`.
5. (Optional) In Vercel's project settings you can add a custom domain if you own one.

Share the URL and the password with your special someone. Write new letters any time at `/admin` on your live site — they'll appear on the homepage instantly.

## Notes on the Spotify player

Browsers block audio from auto-playing without a click — this is a browser rule, not something any website can override, Spotify embeds included. So the song is picked at random on every page load and shown ready to go, but they'll need to tap the play button once. It'll still feel like "the right song showed up," just not literally auto-blasting audio the instant the page opens.

## Notes on security

This is built for a personal, low-stakes gift — not a bank. The password gate is a single shared password (no separate accounts), which is intentional and simple. If you want stronger protection later (e.g. a proper login), that's a bigger addition — just ask.
