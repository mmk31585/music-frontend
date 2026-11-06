# AGENTS.md — music (frontend)

Read this whole file at the start of every session. Then read `docs/STATUS.md`. If `docs/STATUS.md` does not exist you are at Phase F0. Follow section 20 (working agreement) exactly.

## 1. What this is

The web app for a personal online music player. Users log in, upload their own audio files, browse a library, and play music with synced lyrics. The backend is a separate repo, `music-api`; its OpenAPI file is the only contract between us.

- Goal right now: **it works and is deployed**. Looks come later from a design system (section 7), so build clean, token-driven, unfancy UI.
- Audience: Persian and English speakers (Iranian market). Persian and right-to-left layout are first-class, not an afterthought.
- Non-goals for now: social features, payments, native apps, offline audio caching.

## 2. Architecture

```
music (Vercel project A, static Vite build)
   |-- JSON + Bearer JWT --------> music-api (Vercel project B)
   |-- direct upload (token from API) ---> Vercel Blob
   '-- <audio src=blobUrl> (Range) <------ Vercel Blob CDN
```

Audio is played straight from the Blob URL stored on each track. Uploads go straight to Blob using `upload()` from `@vercel/blob/client`; the API only hands out a short-lived token.

## 3. Stack (decided; changes need an ADR in `docs/decisions/`)

| Concern | Choice |
|---|---|
| Framework | Vue 3, `<script setup lang="ts">` only (no Options API), Vite, TypeScript strict |
| Routing / state | Vue Router, Pinia |
| API client | `openapi-typescript` + `openapi-fetch`, types generated from `music-api`'s `openapi.json` |
| i18n | `vue-i18n`, locales `fa` (default) and `en` |
| Tags + audio info | `music-metadata` (`parseBlob`) in the browser |
| Upload | `@vercel/blob` client (`upload`) |
| Styling | Plain CSS with design tokens (CSS variables), scoped styles, logical properties; no CSS framework |
| Fonts | Vazirmatn + one Latin font, self-hosted via `@fontsource` packages (no Google Fonts requests: they can be blocked) |
| Tests | Vitest + Vue Test Utils; Playwright for e2e; axe for accessibility checks |
| Scaffold | `npm create vue@latest` with TypeScript, Router, Pinia, Vitest, Playwright, ESLint, Prettier |
| Package manager | npm |

Never guess package versions or APIs: run `npm view <pkg> version`, install, read the installed types. Installed types win over memory.

## 4. Platform facts (checked against Vercel docs, Oct 2026)

- Vite apps deploy to Vercel with zero config. Add `vercel.json` with an SPA rewrite: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.
- Files over about 4.5 MB cannot go through functions, which is why uploads are direct to Blob.
- **Hobby plan Blob limits are small (1 GB storage, 10 GB transfer per month).** The backend enforces caps; the UI must show the usage meter from `GET /me` and disable uploading when the cap is reached.
- **Iranian users report Vercel sites being blocked or returning 403.** Not solved now. Keep the app host-agnostic: the API base URL comes only from `VITE_API_URL`, nothing is hardcoded to `*.vercel.app`.
- **CORS on audio is unknown until measured.** If you set `crossOrigin="anonymous"` on the `<audio>` element and the Blob URL does not send `access-control-allow-origin`, playback fails completely. Never set `crossOrigin` unless `music-api/docs/PLATFORM_FACTS.md` (or your own `curl -I` test) confirms the header. The audio visualizer is behind a feature flag that stays off until this is confirmed.

## 5. Repo layout

```
music-web/
  AGENTS.md  README.md  vercel.json  package.json  .env.example
  contracts/openapi.json            # pinned copy of the backend contract
  src/
    main.ts  App.vue
    api/ client.ts schema.d.ts      # schema.d.ts is generated, never hand-edited
    router/index.ts
    stores/ auth.ts player.ts library.ts uploads.ts playlists.ts ui.ts
    player/ engine.ts queue.ts mediaSession.ts       # no Vue components in here
    lyrics/ parseLrc.ts sync.ts                       # pure functions, unit tested
    upload/ readTags.ts normalizeCover.ts sha256.ts pipeline.ts
    i18n/ index.ts fa.json en.json
    styles/ tokens.css base.css rtl.css
    ui/                              # primitives: BaseButton IconButton Chip Dialog Sheet TextField Snackbar Slider Tabs Skeleton
    components/                      # app components: TrackRow CoverArt PlayerBar LyricsView UploadQueue UsageMeter
    views/ LoginView RegisterView LibraryView UploadView NowPlayingView PlaylistsView PlaylistView SettingsView
  tests/  e2e/
  docs/ STATUS.md BLOCKERS.md LEARNINGS.md decisions/ feedback/INBOX.md research/
  reference/                         # optional: aura-player.html prototype, read-only inspiration
```

## 6. Environment variables

| Name | Notes |
|---|---|
| `VITE_API_URL` | base URL of music-api, no trailing slash. Default for dev: `http://localhost:3000` |
| `E2E_BASE_URL`, `E2E_EMAIL`, `E2E_PASSWORD` | only for Playwright, never committed |

Scripts that must exist: `dev`, `build`, `check` (= lint + typecheck + test:unit + build), `test:unit`, `test:e2e`, `api:types` (regenerates `src/api/schema.d.ts` from `contracts/openapi.json`), `api:pull` (downloads `$VITE_API_URL/openapi.json` into `contracts/openapi.json`, then runs `api:types`).

## 7. Design tokens contract (the seam for the design system that comes later)

A design system will be delivered after the first working version. To make it a drop-in, **no hardcoded colors, spacing, radii, font sizes, durations or easings anywhere except `src/styles/tokens.css`.** Use exactly these names:

- Colors: `--c-primary --c-on-primary --c-primary-container --c-on-primary-container --c-secondary-container --c-on-secondary-container --c-tertiary --c-surface --c-surface-low --c-surface-container --c-surface-high --c-surface-highest --c-on-surface --c-on-surface-variant --c-outline --c-outline-variant --c-error --c-on-error`
- Space: `--s-1` (4px) through `--s-8` (64px) on a 4px scale
- Radius: `--r-xs 4px, --r-sm 8px, --r-md 12px, --r-lg 16px, --r-xl 28px, --r-full 999px`
- Type (font shorthands): `--t-display --t-headline --t-title --t-body --t-label`
- Motion: `--m-dur-short 150ms, --m-dur-med 300ms, --m-dur-long 500ms, --m-ease-std cubic-bezier(.2,0,0,1), --m-ease-dec cubic-bezier(.05,.7,.1,1), --m-ease-acc cubic-bezier(.3,0,.8,.15), --m-ease-spring cubic-bezier(.34,1.45,.64,1)`
- Elevation: use tonal surface colors, not shadows
- z-index scale: `--z-base 0, --z-player 10, --z-sheet 20, --z-dialog 30, --z-snack 40`

Initial values: a dark theme (primary `#d0bcff`, surface `#141218`, on-surface `#e6e0e9`, and the matching Material 3 dark roles). Later the app will recolor these variables at runtime from the album cover, so every color in the UI must come from them.

Primitives in `src/ui/` have stable prop APIs (so restyling never touches views): `BaseButton(variant: filled|tonal|outlined|text)`, `IconButton`, `Chip`, `Dialog`, `Sheet`, `TextField`, `Snackbar`, `Slider`, `Tabs`, `Skeleton`. Views never contain raw `<button>` styling.

Prefer CSS logical properties (`margin-inline-start`, `padding-block`, `inset-inline-end`, `text-align: start`) everywhere so RTL works without overrides.

## 8. Routes and screens

| Route | Screen | Auth |
|---|---|---|
| `/login`, `/register` | forms; register has an invite code field | public |
| `/` | Library: search box, sort, infinite scroll list/grid, favorite toggle | yes |
| `/upload` | drag-drop multi-file upload queue with per-file progress, usage meter | yes |
| `/now-playing` | big cover, controls, queue, lyrics | yes |
| `/playlists`, `/playlists/:id` | list, detail, reorder, add/remove | yes |
| `/settings` | language (fa/en), usage, logout | yes |

A persistent `PlayerBar` is mounted once in `App.vue` so audio never stops on navigation. Mobile first: bottom player bar, tap targets at least 44px.

## 9. State and modules

- `player/engine.ts` owns **one** `HTMLAudioElement` for the whole app. Never create a second one. It exposes plain functions and reactive state through the `player` store.
- `player/queue.ts` is pure logic (next, previous, shuffle without immediate repeats, repeat off/all/one) with unit tests.
- Handle `audio.play()` rejections (autoplay policy, expired URL). Show a Snackbar, never crash.
- `player/mediaSession.ts` sets title, artist, album, artwork, and the play/pause/previous/next/seekto handlers.
- Persist volume, shuffle, repeat, last track and last position in `localStorage` (wrapped in try/catch).
- Keyboard: Space play/pause, arrows seek 5 s, `N`/`P` next/previous, `M` mute. Ignore when typing in inputs.
- API calls go only through `src/api/client.ts`. It adds the Bearer token, and on a 401 clears the session and redirects to `/login`. Never hand-write request/response types: use the generated `schema.d.ts`.
- Token storage for the MVP: `localStorage`. Note the XSS tradeoff in a decision record; move to an httpOnly cookie only if both apps end up on the same site.

## 10. Upload pipeline (`src/upload/pipeline.ts`, one pure-ish module with tests)

For each selected file, in this order:

1. Reject early: not an audio extension/MIME, or bigger than the backend limit (read from `/me` usage or a constant that matches the API).
2. `readTags.ts`: `music-metadata` `parseBlob(file)` -> title, artist, album, albumArtist, genre, year, track no, disc no, duration, bitrate, sample rate, embedded lyrics (plain or LRC), embedded picture. If tags are missing, derive title/artist from the filename (`Artist - Title.mp3`, strip leading track numbers and underscores).
3. `normalizeCover.ts`: **sniff the image type from the first bytes** (JPEG `FF D8`, PNG `89 50 4E 47`, GIF `47 49 46`, WebP `RIFF....WEBP`, BMP `42 4D`); do not trust the tag's format string. Decode with `createImageBitmap` (fallback: `Image` + `decode()`), center-crop to a square, resize to 720x720, fill the background first (PNG transparency), encode JPEG quality 0.88 (aim under 300 KB). If decoding fails, upload without a cover; the UI draws a generated gradient placeholder.
4. `sha256.ts`: `crypto.subtle.digest` over the file.
5. `POST /uploads/preflight`; stop on 409/413/415/429 and show a clear message per code.
6. `upload()` to Blob: audio then cover, with `onUploadProgress`, an explicit `contentType` from the extension map (browsers give empty `file.type` for flac/opus), pathname `u/<userId>/audio/<uuid>.<ext>`.
7. `POST /tracks` with everything. On success add to the library store.
8. If step 7 fails after uploading, call `POST /uploads/discard`.

Concurrency: at most 2 files at a time. Each item shows queued / reading / uploading % / done / error with a retry button.

## 11. Lyrics (`src/lyrics/`)

- `parseLrc.ts`: parse `[mm:ss.xx]` (also `[mm:ss]` and `[mm:ss:xx]`), multiple timestamps on one line, ignore `[ar:]`-style tags and `<mm:ss.xx>` word tags, sort by time, collapse consecutive empty lines. If no timestamps exist, return plain lines. Unit tests for all of that.
- `sync.ts`: `findActive(lines, time)` by binary search (last line with `t <= time`). Unit tested.
- `LyricsView.vue`: fetch from `GET /tracks/{id}/lyrics`, fall back to embedded lyrics. Show a source label (embedded / LRCLIB / manual), a "find again" dialog (`/lyrics/refresh` with title/artist), a timing nudge (+/- 0.5 s, kept in the component), and click a line to seek.
- Synced rendering rules: scroll with `transform: translate3d` on a track element with a CSS transition (not `scrollTo({behavior:'smooth'})`); only touch the lines within 6 of the active one when the active line changes; the active line shows a karaoke fill using a gradient on an inline span (`background-clip: text`, `box-decoration-break: slice` so wrapped lines fill in order); lines with `dir="auto"`, and RTL lines align to the end with the transform origin on the right. When the user scrolls manually, pause auto-follow for about 3 seconds.
- Plain (unsynced) lyrics are a normal scrollable text block.

## 12. i18n and RTL

- Default `fa`; `<html lang dir>` updated when the language changes; persisted. `fa.json` and `en.json` must have identical key sets (there is a unit test for this).
- Format numbers and dates with `Intl` for the active locale. Show durations as `m:ss` with locale digits only in UI text, never in data.
- Mixed text: wrap track titles and artists with `dir="auto"` and `unicode-bidi: plaintext` so an English title inside an RTL layout renders correctly.
- Icons that imply direction (previous/next, chevrons) flip in RTL; play/pause do not. Playback controls keep the conventional order (previous, play, next) in both directions.

## 13. Performance and accessibility budgets

- Initial JS under 200 KB gzip excluding fonts. Lazy-load views, the upload code (and `music-metadata`) and the lyrics view.
- Long lists: render windowed or paginate with infinite scroll (API cursor); no more than about 200 DOM rows at once.
- Animate only `transform` and `opacity`. No `backdrop-filter`, no large blur filters, no animated box-shadows. One `requestAnimationFrame` loop at most for the lyric fill and progress, and it stops when paused.
- Honor `prefers-reduced-motion`.
- Every interactive element is reachable by keyboard with a visible focus ring; icon buttons have `aria-label`; the progress slider uses `role="slider"` with `aria-valuetext`. Run axe in the Playwright suite on login, library and now-playing.

## 14. Known pitfalls from the earlier prototype (do not repeat)

1. A cover inside a flex column that shrinks vertically gets squished. Give the cover a fixed square size from a CSS variable (`--cover: clamp(...)`), `flex: none`, `aspect-ratio: 1`.
2. Embedded cover formats are unreliable (wrong or missing MIME). Sniff bytes, normalize to a square JPEG, and always have an `onerror` fallback to the generated placeholder.
3. Huge cover images (3000 px) make decoding and repainting janky. Never display the original: always the 720 px normalized one (and a small thumbnail in lists).
4. Heavy blur filters, `backdrop-filter`, and per-frame CSS variable updates on large trees cause jank. Use pre-blurred small canvases or images for backgrounds, and update only transforms.
5. Smooth `scrollTo` for lyrics is inconsistent across browsers. Use the transform approach in section 11.
6. A visualizer needs CORS on the audio source (section 4). Verify first; feature-flag it.

## 15. Testing gates

- `npm run check` must be green before every commit.
- Unit tests required for: `parseLrc`, `findActive`, `queue`, filename-to-tags guess, cover type sniffing, i18n key parity, the upload pipeline with mocked API.
- Component tests for `PlayerBar` (play/pause, disabled when no track) and `UploadQueue` states.
- Playwright e2e (Phase F7) against `E2E_BASE_URL` with a seeded test user: login, upload `tests/fixtures/tiny.mp3`, find it in the library, play it, see lyrics area, logout. Plus axe checks.

## 16. Phases and acceptance criteria

Tick every box before moving on. Report progress in `docs/STATUS.md`. The backend phases are in `music-api/AGENTS.md`; F1 and later need the backend's matching phase deployed, until then use a mock server (MSW) driven by `contracts/openapi.json`.

**Phase F0 — Scaffold and deploy**
- [ ] Vite + Vue 3 + TS + Router + Pinia + Vitest + Playwright + ESLint/Prettier scaffold, `npm run check` green, GitHub Action runs it
- [ ] `tokens.css`, `base.css`, `rtl.css`, self-hosted fonts, `ui/` primitives with a hidden `/_kit` page showing all of them
- [ ] i18n fa/en with RTL switch and key-parity test
- [ ] App shell: header, routes as empty screens, PlayerBar skeleton
- [ ] Deployed preview URL loads, deep links work (SPA rewrite), `dir="rtl"` in fa

**Phase F1 — Auth and API client**
- [ ] `contracts/openapi.json` pinned from the backend, `api:types` works, typed client
- [ ] Login/register (with invite code), token store, route guards, 401 handling, logout
- [ ] Errors from the API shown with translated messages per error code

**Phase F2 — Upload**
- [ ] Pipeline from section 10 with unit tests, UploadView with queue and usage meter
- [ ] Verified once against the real deployed API with `tests/fixtures/tiny.mp3`; note results in `docs/LEARNINGS.md`

**Phase F3 — Library and player**
- [ ] Library list with search, sort, infinite scroll, favorites, delete with confirmation
- [ ] Player engine, queue, PlayerBar, Media Session, resume, keyboard shortcuts, error snackbars
- [ ] A track plays from its Blob URL on desktop and on a phone

**Phase F4 — Now playing and lyrics**
- [ ] NowPlayingView, LyricsView per section 11 (synced and plain), find-again dialog, .lrc import, timing nudge

**Phase F5 — Playlists**
- [ ] CRUD, add/remove from the track menu, reorder (drag or move up/down buttons), play a playlist

**Phase F6 — Polish seams**
- [ ] Dominant color from the normalized cover sets `--c-*` roles at runtime (smooth transition)
- [ ] Visualizer behind a flag, enabled only if CORS was confirmed
- [ ] Web app manifest + service worker that caches only the app shell, never audio
- [ ] Skeletons, empty states, error boundary

**Phase F7 — E2E and accessibility**
- [ ] Playwright suite and axe checks green in CI against a preview deployment

## 17. Working agreement (for every agent session)

Small free models get lost in long sessions, so memory lives in files:

1. **Start**: read this file, `docs/STATUS.md`, `docs/BLOCKERS.md`, the last 20 lines of `docs/LEARNINGS.md`. Run `git status` and `npm run check`.
2. **One task at a time**: one bullet of one phase. Small commits (aim for under 200 changed lines), Conventional Commit messages.
3. **After every task**: run `npm run check`. Commit only when green. Then update `docs/STATUS.md` (current phase, done, next 3 tasks, open questions).
4. **When something fails**: fix the first error only, rerun. After 3 failed attempts on the same problem, write it in `docs/BLOCKERS.md` and move to the next task.
5. **Learn**: every non-trivial bug or surprise gets an append-only entry in `docs/LEARNINGS.md`: `date | symptom | cause | fix | rule for next time`.
6. **Decisions**: anything that changes stack, contract use or design tokens gets `docs/decisions/NNN-title.md`.
7. **Feedback**: `docs/feedback/INBOX.md` collects lines `- [date] [source: user|test|agent] [area] text`. Read it at session start; turn items into tasks in STATUS.md.
8. **Contract sync**: when the backend changes, run `npm run api:pull`, fix type errors, and note it in `docs/STATUS.md`. Never edit `schema.d.ts` by hand.
9. **Never**: commit secrets or `.env` files, hardcode colors/sizes outside `tokens.css`, hardcode the API host, disable a failing test to get green, add a dependency without saying why in the commit message, start a later phase before the earlier acceptance list is fully ticked.
10. **Measure, do not assume**: anything about browser or platform behavior (audio CORS, Range seeking, iOS autoplay, bundle size) is checked once and written to `docs/LEARNINGS.md`.

## 18. Human-only tasks (stop and ask the human with exact instructions)

1. Create the GitHub repo and push.
2. `vercel link` to create the project; set `VITE_API_URL` (Production and Preview) to the API's URL.
3. Add the frontend's origin to the API's `CORS_ORIGINS` and redeploy the API.
4. Provide a test account (`E2E_EMAIL`, `E2E_PASSWORD`) and an invite code for e2e.

## 19. Hooks for the self-improving loop (designed later by Claude; keep these files current now)

`docs/STATUS.md`, `docs/LEARNINGS.md`, `docs/BLOCKERS.md`, `docs/feedback/INBOX.md`, `docs/research/` (one note per researched question: question, sources, conclusion, date). A single command (`npm run check`, `npm run test:e2e`) must reproduce every test result.

## 20. Handoff notes for Claude (the design-system and agent-workflow phase)

- Decided: Vue 3 + Vite + Pinia, token-only styling with the contract in section 7, primitives with stable props, transform-only motion, RTL-first.
- The design system should deliver: real values for the section 7 tokens, restyled `ui/` primitives, motion rules, a cover-driven dynamic color approach, and the lyrics and now-playing visual language. It must not change prop APIs.
- The `reference/aura-player.html` prototype (if present) is inspiration only; it is not production code.
- Open for the owner: custom domains, whether the visualizer ships, how much offline support the PWA gets, an Iran-friendly host.