# Phase 0 Audit — Muse Frontend

> RTL-first Persian music SPA (Vue 3 + Vite + Pinia + vue-i18n + PrimeVue + Tailwind v4), deployed on Vercel as `music-frontend`; backend is separate repo `music`. No backend changes — document them in BACKEND_NOTES.md.

## 1. Router map

**`src/router/routes/app.ts`** (LayoutMusicApp, public + authed):
- `/` → app.home (PageHome.vue)
- `/search` → search (PageSearch.vue)
- `/recommendations/for-you`, `/popular`, `/best`, `/recent`
- `/library` → library (requiresAuth)
- `/playlist/:id`, `/track/:id`, `/album/:id`, `/artist/:id`
- `/explore`, `/create-edit`, `/notifications`, `/social`, `/social/parties/:id`, `/social/rooms/:id`, `/social/clubs/browse`, `/social/clubs/:id`
- `/user/:id?` → user.profile, `/settings`, `/subscription`, `/contributions`, `/creator-dashboard`, `/upload`, `/upload/review`, `/gamification`, `/stats`, `/ai/mood-explorer`, `/ai/playlist-generator`, `/videos`, `/music-video/:videoId`

**`src/router/routes/admin.ts`** (LayoutAdmin, requiresAuth + admin): `/admin`, `/admin/catalog`, `/admin/tracks`, `/admin/artists`, `/admin/albums`, `/admin/genres`, `/admin/users`, `/admin/media`, `/admin/videos`, `/admin/import`, `/admin/import/artist`, `/admin/ingestion`, `/admin/moderation`, `/admin/subscriptions`, `/admin/contributions`, `/admin/analytics`, `/admin/cache`, `/admin/permissions`, `/admin/settings`

**`src/router/routes/auth.ts`** (LayoutAuth): `/auth/login`, `/auth/register`, `/auth/forgot-password`

**Top-level** (`src/router/routes/index.ts`): `/maintenance`, `/onboarding/genres`, not-found catch-all

## 2. Layout components

**`src/layouts/LayoutMusicApp.vue`** — main shell: `MusicSidebar` (desktop), `MusicAppHeader`, `<main>` scroll container (`overflow-y-auto`), `MusicRightPane`, `MobileNavPanel`, `SearchOverlay`, `RadioMode`, `PlayerRegion`, `MobileBottomNav`. Main padding adjusts for player bar height (`pb-32 lg:pb-28` expanded, `pb-20 lg:pb-16` collapsed).

**`src/components/music/layout/sidebar/navigation.ts`** — `navSections` config with `future: true` disabled items.

**`src/components/music/layout/sidebar/`**: `SidebarItem.vue`, `SidebarBadge.vue`, `SidebarLogo.vue`, `SidebarSection.vue`, `types.ts`, `useNavigation.ts`

**`src/components/layouts/app/`**: `MusicAppHeader.vue`, `MobileBottomNav.vue`, `MobileNavPanel.vue`, `ThemeProvider.vue`, `ProfileMenu.vue`, `AppearancePanel.vue`

## 3. Cover / avatar image sources (all raw ``, no CoverImage/Avatar component)

| File | Line | Src field |
|------|------|-----------|
| src/components/admin/IngestionReviewAlbumStep.vue | 134 | `a.coverUrl` |
| src/components/admin/IngestionReviewArtistStep.vue | 212 | `a.imageUrl` |
| src/components/music/layout/MusicRightPane.vue | 35 | `currentTrack.coverUrl` |
| src/components/music/player/FullscreenPlayer.vue | 354 | `currentTrack?.coverUrl` |
| src/components/music/player/FloatingMiniPlayerContent.vue | 36, 50 | `coverUrl` |
| src/components/social/ListeningPartyCard.vue | 51 | `avatar` |
| src/components/social/MusicClubCard.vue | 59 | `avatar` |
| src/components/social/LiveRoomCard.vue | 31 | `avatar` |
| src/pages/app/PageMusicVideo.vue | 233 | `trackInfo.cover_url` |
| src/pages/app/PageUserSettings.vue | 37 | `previewAvatar` |
| src/components/admin/AdminAlbumsCard.vue | 74-75 | `album.cover_url` |
| src/components/admin/AlbumFormDialog.vue | 115,139,143 | `form.cover_url` |
| src/components/admin/IngestionReviewConfirmStep.vue | 25,59,78 | coverUrl/imageUrl |
| src/components/admin/IngestionReviewSuccess.vue | 17,36,55 | coverUrl/imageUrl |
| src/components/admin/IngestionReviewTrackStep.vue | 74 | track coverUrl |
| src/components/admin/TrackFormDialog.vue | 30,31,85,127,177,308,310,344,395,415 | cover_url/avatar_url |
| src/components/common/ContextMenu.vue | 24,25,139,140 | `header.coverUrl` |
| src/components/contribution/ContributionLeaderboard.vue | 54-55 | `c.avatar_url` |
| src/components/gamification/GamificationLeaderboard.vue | 70-71 | `entry.avatar_url` |
| src/components/gamification/GamificationXPBar.vue | 8-9 | `profile.avatar_url` |
| src/components/layouts/app/MusicAppHeader.vue | 71-72 | `user.avatarUrl` |
| src/components/layouts/app/ProfileMenu.vue | 12-13 | `user.avatarUrl` |
| src/components/music/ActivityItem.vue | 13-14 | `item.avatarUrl` |
| src/components/music/catalog/AlbumCard.vue | 7-8 | `album.cover_url` |
| src/components/music/catalog/SearchOverlay.vue | 140,141,186 | `cover_url` |
| src/components/music/catalog/TrackDetailDialog.vue | 24,25 | `coverUrl` |
| src/components/music/catalog/TrackRow.vue | 14-15 | coverUrl (fallback chain: track.coverUrl → track.cover_url → album.coverUrl → album.cover_url) |

**Image URL fields**: `cover_url` (snake_case, API), `coverUrl` (camelCase), `avatar_url`, `avatarUrl`, `imageUrl`, `previewAvatar`. No CDN base-URL prefixing found — URLs stored/used as-is.

**Broken cover root cause**: Backend `player/service.go:82` returns `track.CoverURL` from `COALESCE(t.cover_url, '')` (repository.go:30). Tracks imported without cover extraction have empty `cover_url` → frontend gets `""` → broken-image icon. No embedded-cover extraction from audio metadata found in backend.

## 4. Greeting name source

`src/composables/useHomePage.ts:46-56`:
- `name = auth.user?.displayName || auth.user?.username || ''`
- Persian period map: morning `صبح‌تون بخیر`, afternoon/evening `عصر بخیر`, night `شب بخیر`
- Returns `${base}, ${name}` or just base
- `PageHome.vue` uses `:greeting="greeting"` and `:subtitle="greetingSubtitle"`

**Secondary duplicate greeting**: `src/pages/app/PageSocial.vue:321-329` (independent, `Hello`/`صبح بخیر`/`ظهر بخیر`/`عصر بخیر`)

**Issue**: `displayName` field does NOT exist on `User` type — falls back to `username`. If username is "Admin", greeting shows " Admin" which the user wants removed.

## 5. i18n

- `src/locales/index.ts`: `createI18n({legacy: false, locale: DEFAULT_LOCALE ('fa'), fallbackLocale: 'en', messages: {fa, en}})`
- `src/locales/fa.json` + `src/locales/en.json` — 93 keys each, complete
- `src/stores/locale.ts`: persists `muse-locale` to localStorage, syncs `document.documentElement.lang`/`dir`, vue-i18n, PrimeVue locale, dispatches `locale-change`
- Default: `fa` (Persian, RTL). `index.html`: `<html lang="fa-IR" dir="rtl">`
- Mounted `src/main.ts:17`, PrimeVue `rtl: initialLocale === 'fa'`
- **Note**: `grep $t(` found no direct call sites — templates appear to use a global translation directive/component or `useTranslation`; `{{ greeting }}` in PageSocial is hardcoded JS, not i18n.

## 6. Stores

| Store | Key fields |
|-------|-----------|
| `user-auth.ts` | `user` (User), `state` (TokenState), `deviceId`, `isAuthenticated`, `isAdmin`, `token`, `isGuest` |
| `player.ts` | `currentTrack`, `queue`, `isPlaying`, `isBuffering`, `volume`, `muted`, `shuffleMode`, `repeatMode`, `currentTime`, `duration`, `error` |
| `locale.ts` | `locale` ('fa'\|'en'), `isRTL`, `dir` |
| `feature-flags.ts`, `maintenance.ts`, `page-loader.ts`, `permissions.ts` | — |

**No `displayName` field**; `User` type in `src/services/api/auth/types.ts`. `role === 'admin'` for isAdmin.

## 7. API client

- `src/plugins/client/client.ts`: axios, `baseURL = VITE_API_BASE_URL`, `withCredentials: true`, JSON content type
- `src/plugins/client/request-factory.ts`: request interceptor attaches `Authorization: Bearer <token>`, 401 → refresh + retry, 403 → clear + redirect login
- All route files use `useRequest(url, config, resultConfig)` from `@/composables/useRequest`
- `VITE_API_BASE_URL` defaults to empty → requests go to origin (405 in prod)

## 8. WS URL

- `src/services/socket/client.ts:4`: `WS_URL = VITE_WS_URL || undefined`
- Line 66: base = `WS_URL || wss/ws://location.host/api/v1/ws` — **BUG**: falls back to frontend host (`music-frontend-umber-delta.vercel.app`) instead of API host (`music-three-coral.vercel.app`), causing WS 404 on production
- Token from `useUserAuthStore().token`, reconnect backoff, ping 25s

## 9. Nav items marked `future: true` (rendered disabled "Soon")

`src/components/music/layout/sidebar/navigation.ts`:
- Radio (`/`, future: true)
- Liked Songs (`/library`, future: true)
- Albums (`/library`, future: true)
- Artists (`/library`, future: true)
- Listening Parties (`/social`, future: true)
- Smart Mix (`/`, future: true)
- AI Radio (`/`, future: true)

`SidebarItem.vue` renders them disabled with `(coming soon)` title and `Soon` badge. `useNavigation.ts` filters by `permissions` but NOT `future`.

## 10. Hardcoded strings (non-i18n)

- `src/composables/useHomePage.ts:49-53` — Persian greeting map (hardcoded, not in locales) — OK but should be i18n keys
- `src/composables/useHomePage.ts:59-66` — Persian subtitle map (hardcoded)
- `src/pages/app/PageSocial.vue:321-329` — hardcoded `Hello`/`صبح بخیر` greeting, not i18n
- `src/components/music/home/HomeHero.vue` — check for hardcoded English
- Various `{{ title }}` / `{{ artistName }}` interpolations (user-generated, need `dir="auto"`)

## 11. Fonts

`index.html` preloads Google Fonts: Inter, Lexend, Vazirmatn (Persian font). `src/main.ts:22-35` preloads local `iranyekanweblight/regular/bold.woff2`.

## 12. Hardcoded colors / spacing / radius

`src/assets/css/main.css` — need full review for hardcoded values outside design tokens. PrimeVue `AppPreset` in `src/utils/prime/prime-preset.ts` has hardcoded color values.

---

**Next: Phase 1 (Bugs)** — broken images, RTL bidi, language consistency, greeting, unfinished nav items, header duplicates, scrolling, search.
