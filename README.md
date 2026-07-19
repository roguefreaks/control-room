# ACHYUT // CONTROL ROOM

A portfolio that is not a portfolio: it's a live operations console, styled after
the hospital admin dashboards I build and run for a living. The visitor's session
is treated as an order moving through my real order state machine —
`RECEIVED → REVIEWING → EVALUATING → SHORTLISTED` — advanced by scrolling,
completed by making contact.

Live systems it monitors (my actual freelance production deployments):

- **Prabhu Dana Pani** — https://prabhu-dana-pani.vercel.app
- **Cascade & Coal** — https://cascade-coal-delta.vercel.app

## Stack

Next.js 16 (App Router, ISR) · TypeScript strict · Tailwind CSS v4 ·
Supabase (telemetry + guestbook) · Vitest · GitHub Actions

No client-side trackers, no third-party scripts, no analytics SDK.
Everything interactive is hand-rolled (command palette, fuzzy matcher,
state machine, tickers) — total app JS is ~35KB gzipped on top of the
framework runtime.

## Architecture notes

- **Landing page is static** (ISR, 10-minute revalidate). Live data — GitHub
  deploy feed, production health probes, guestbook entries — is fetched
  server-side at revalidation, so visitors never trigger request storms.
- **Health checks** (`src/lib/health.ts`) probe both production systems from
  the server with an 8s timeout, cached 10 minutes via `unstable_cache`.
  If a system is down the site says `DEGRADED`, honestly.
- **Visitor telemetry** (`/api/visitors`) is privacy-safe: one httpOnly
  session cookie with a random UUID, anonymous counters in Supabase, IPs
  only ever used as salted hashes for rate limiting. No Supabase configured →
  the telemetry module hides itself.
- **Signal board** (`/api/guestbook`): private by design — messages are
  emailed to me and stored, never displayed to other visitors (senders see
  only their own, in their session). Zod-validated, profanity-filtered
  (leetspeak-aware), rate-limited (3 posts / 10 min / IP), honeypot field;
  listing and deletion require the admin token.
- **The state machine** (`src/lib/state-machine.ts`) is pure and fully unit
  tested: forward-only, `SHORTLISTED` reachable only through a contact action.
- **Security headers** in `next.config.ts`: CSP (script/style
  `'unsafe-inline'` is required by Next's static bootstrap + the pre-paint
  theme script; `'unsafe-eval'` is dev-only), HSTS, nosniff, frame-deny,
  restrictive Permissions-Policy.
- **Accessibility**: full keyboard support (palette included), visible focus
  rings, `aria-live` announcements for state changes, WCAG AA contrast in
  both themes, `prefers-reduced-motion` respected everywhere (boot sequence
  skips entirely).
- **No-JS resilience**: content is server-rendered and visible without
  JavaScript; scroll-reveal styling only applies when a pre-paint script
  confirms JS is present.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm test           # vitest (state machine, rate limiter, schemas, fuzzy, profanity)
npm run lint
npm run build
```

The site runs fully without any env vars — live modules degrade gracefully:
telemetry and the signal board hide, the deploy feed shows public events only.

## Environment variables

Copy `.env.example` to `.env.local` (and mirror in Vercel → Project →
Settings → Environment Variables):

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | recommended | Canonical URL for metadata/sitemap/JSON-LD |
| `SUPABASE_URL` | optional | Supabase project URL (telemetry + guestbook) |
| `SUPABASE_SERVICE_ROLE_KEY` | optional | Service-role key — **server-only**, never exposed |
| `GITHUB_TOKEN` | optional | Token for the freelance account so the deploy feed can include private-repo activity |
| `ADMIN_TOKEN` | optional | Secret for guestbook moderation (`DELETE /api/guestbook`) |
| `TELEMETRY_SALT` | recommended | Salt for one-way IP hashing |

### Supabase setup (one-time)

1. Create a project at supabase.com.
2. Open SQL Editor → paste and run `supabase/schema.sql`.
3. Copy Project URL and `service_role` key into the env vars above.

All tables have RLS enabled with **no policies** — only the service-role key
(server-side) can touch them.

### GitHub token (deploy feed)

Create a fine-grained personal access token on the **SKY830-sudo** account
(read-only; it only calls `/users/SKY830-sudo/events`). Note: with this set,
private-repo names/commit messages appear in the public feed — that is the
point, but keep it in mind.

### Guestbook moderation

```bash
curl -X DELETE https://your-domain/api/guestbook \
  -H "x-admin-token: $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id":"<signal uuid>"}'
```

## Editing content

Every fact and line of copy lives in `src/content/` — components never
hard-code text:

- `profile.ts` — name, contact, links, availability
- `systems.ts` — the two production systems + lab experiments
- `skills.ts` — telemetry readout groups
- `audit.ts` — education, certifications, achievements
- `incidents.ts` — **drafts: review and edit these before sharing the site**

The resume served by the download button is `public/Achyut_Anand_Pandey_Resume.pdf` —
replace the file to update it.

## Performance

- Landing page: static HTML (~18KB gz), self-hosted subset fonts, zero
  third-party requests, zero images above the fold.
- Total JS ~191KB gz, of which ~160KB is the Next 16 + React 19 runtime
  floor — app code is ~35KB. (The original sub-180KB target is not reachable
  on this framework version without dropping React; noted for honesty.)
- All animations are CSS or rAF, ≤400ms, gated on `prefers-reduced-motion`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. vercel.com → New Project → import the repo (defaults are correct).
3. Add the env vars above → Deploy.
4. Set `NEXT_PUBLIC_SITE_URL` to the final domain and redeploy.

CI (`.github/workflows/ci.yml`) runs typecheck + lint + tests on every push.
