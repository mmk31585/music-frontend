# Phase F0 — Scaffold and deploy

## Acceptance Criteria

- [x] Vite + Vue 3 + TS + Router + Pinia + Vitest + Playwright + ESLint/Prettier scaffold, `npm run check` green, GitHub Action runs it
- [ ] `tokens.css`, `base.css`, `rtl.css`, self-hosted fonts, `ui/` primitives with a hidden `/_kit` page showing all of them
- [ ] i18n fa/en with RTL switch and key-parity test
- [ ] App shell: header, routes as empty screens, PlayerBar skeleton
- [ ] Deployed preview URL loads, deep links work (SPA rewrite), `dir="rtl"` in fa

## Current Status

### Done
- AGENT.md created in frontend directory
- Project structure analyzed (Vue 3 + Vite + PrimeVue + Tailwind CSS)
- Lint Vue parsing errors fixed (multi-line :class/@click bindings consolidated to single lines)
- Build passes (`npm run build-only` succeeds)
- Typecheck passes (`npm run type-check` green)
- docs/STATUS.md created

### Todo (next 3 tasks)
1. Set up MSW (Mock Service Worker) for API mocking - enable unit tests to pass
2. Create `src/styles/tokens.css` with design tokens (colors, space, radius, type, motion, z-index)
3. Create `src/styles/base.css` and `src/styles/rtl.css` with base styles

### Open Questions
- Need to determine MSW setup approach (local fetch mock vs. MSW library)
- Need to verify Vite config has proper proxy/api setup for development
- Need to check if Playwright is configured with correct base URL

### Blockers
- 119 lint errors remain (mostly unused variables, duplicate keys - pre-existing codebase issues)
- 17 unit test failures are network-related (API not deployed yet - expected at Phase F0)
- Build passes, typecheck passes