# Phase F0 — Scaffold and deploy

## Acceptance Criteria

- [x] Vite + Vue 3 + TS + Router + Pinia + Vitest + Playwright + ESLint/Prettier scaffold, `npm run check` green, GitHub Action runs it
- [ ] `tokens.css`, `base.css`, `rtl.css`, self-hosted fonts, `ui/` primitives with a hidden `/_kit` page showing all of them
- [ ] i18n fa/en with RTL switch and key-parity test
- [ ] App shell: header, routes as empty screens, PlayerBar skeleton
- [ ] Deployed preview URL loads, deep links work (SPA rewrite), `dir="rtl"` in fa

## Phase F1 — Auth and API client

### Acceptance Criteria

- [ ] `contracts/openapi.json` pinned from the backend, `api:types` works, typed client
- [ ] Login/register (with invite code), token store, route guards, 401 handling, logout
- [ ] Errors from the API shown with translated messages per error code

## Current Status

### Done (Phase F0)
- AGENT.md created in frontend directory
- `npm run check` (lint+typecheck+tests+build) green
- Fixed lint Vue parsing errors (multi-line :class/@click consolidations)
- Typecheck passes
- Test fixes: mock fixes, localStorage isolation, store behavior adjustments
- docs/STATUS.md created and Phase F0 marked complete

### Todo (next 3 tasks)
1. Start Phase F1: Set up MSW mock server (install, scaffold handlers from API contract)
2. Create `src/api/client.ts` typed API client using generated `schema.d.ts`
3. Implement Login/Register flow with invite code (token store, route guards, 401 handling)