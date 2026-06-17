# Port "Girls Gotta Golf" from GitHub

Source repo: `audrey-560/girlsgottagolf` — a Vite + React 18 + Tailwind + GSAP scroll-driven cinematic landing page, plus a `/join` form backed by Supabase.

## What ships

1. **Landing page (`/`)** — full-bleed `<canvas>` scroll story driven by GSAP `ScrollTrigger` + `Observer`, snapping through 3 chapters of golf footage (setup → fairway → green → celebration). Beats (titles, "What to expect" list, logo reveal) fade in/out at chapter boundaries. Fixed cream banner with logo + "Join the Club" CTA appears at the end. Below the journey: cream story section (founder note, expect grid, CTA, footer).
2. **Join page (`/join`)** — multi-question form (name, email, chip selects, optional fields) that writes to a `members` table. On success, shows a thank-you state.
3. **Brand styling** — colors `--green #314231 / --green-deep #22301f / --cream #f9f2ea / --gold #c9a35f / --ink #161f14`; fonts Playfair Display (display) + Jost (body).

## Mapping repo → this stack

| Source | Target |
|---|---|
| `src/main.tsx` + `BrowserRouter` | TanStack file routes in `src/routes/` |
| `src/pages/Landing.tsx` | `src/routes/index.tsx` |
| `src/pages/Join.tsx` | `src/routes/join.tsx` |
| `src/components/GolfJourney.tsx` (+ logic from `main.js`) | `src/components/GolfJourney.tsx` (client-only, `useEffect` for GSAP) |
| `src/index.css` + `styles.css` | merged into `src/styles.css` (Tailwind v4 + tokens as CSS vars in `@theme`) |
| Google Fonts `<link>` in `index.html` | `<link>` tag inside `head()` of `src/routes/__root.tsx` |
| `public/assets/**` (stills, clips, frames, logos) | copy to this project's `public/assets/**` |
| `src/lib/supabase.ts` + `supabase/schema.sql` | enable **Lovable Cloud**; create `members` table via migration; submit via TanStack server function |
| `react-router-dom` `<Link>` | `@tanstack/react-router` `<Link>` |

## Assets to transfer

- 4 stills (`01-setup`, `02-fairway`, `03-green`, `04-celebration`) — PNG
- 3 logos (`logo`, `logo-cream`, `logo-green`) — PNG
- 3 clips (`Clip-a/B/c.mp4`) — currently unused by `main.js`, copy anyway
- ~410 frame JPGs (`a-0001..a-0145`, `b-0001..b-0121`, `c-0001..c-0144`) plus `manifest.json` if present

I'll fetch these directly from `raw.githubusercontent.com` in batches and write them to `public/assets/`. This is the largest single-step in the port.

## Backend (Lovable Cloud)

Enable Lovable Cloud and create a migration:

```sql
create table public.members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  handicap text,
  frequency text,
  course text,
  notes text
);
grant insert on public.members to anon, authenticated;
grant all on public.members to service_role;
alter table public.members enable row level security;
create policy "anyone can join" on public.members for insert to anon, authenticated with check (true);
```

Join form submits via a `createServerFn` that inserts using the server publishable client (RLS-protected, anon insert allowed).

## Technical notes

- GSAP is client-only. The journey component runs all canvas/scroll setup inside `useEffect`, and the route returns `null` on SSR for the canvas layer until mount.
- Frame loading uses progressive `Image()` preloading with a loader bar; first segment blocks reveal, segments 2 & 3 stream in.
- Tailwind v4: brand tokens live in `@theme` block in `src/styles.css`; no `tailwind.config.js`.
- Keep `gsap` as the only new runtime dep (`bun add gsap`).
- Drop `react-router-dom`, `@supabase/supabase-js` (Lovable Cloud client is already wired), and the old vanilla `main.js` / `index.html` from the source.

## Order of work

1. Enable Lovable Cloud + run `members` migration.
2. `bun add gsap`.
3. Copy all `public/assets/**` from GitHub to this project (stills, logos, clips, frames).
4. Merge styles into `src/styles.css`; add font `<link>` to `__root.tsx`.
5. Build `src/components/GolfJourney.tsx` (port `main.js` + JSX from `GolfJourney.tsx`).
6. Build `src/routes/index.tsx` (journey + story section).
7. Build `src/routes/join.tsx` + `src/lib/join.functions.ts` server function.
8. Verify build, then load the preview to confirm the scroll story and form work.

## Out of scope (ask before adding)

- Auth, member login, admin dashboard.
- Email notifications on form submit.
- Analytics / SEO beyond per-route `head()` metadata.
