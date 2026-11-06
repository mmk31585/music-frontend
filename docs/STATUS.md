# Phase F0 - Scaffold and deploy: COMPLETE

# Phase F1 - Auth and API client (in progress)

## Acceptance Criteria
- [x] `contracts/openapi.json` pinned from backend (from docs/swagger.json)
- [ ] `api:types` works, typed client - needs openapi-typescript + OpenAPI 3 conversion
- [ ] Login/register (with invite code), token store, route guards, 401 handling, logout
- [ ] Errors shown per error code

## Completed
- npm run check green (lint+typecheck+tests+build)
- Lint Vue parsing errors fixed
- MSW mock server + handlers scaffolded (src/mocks)
- Auth flow modules exist (useAuth composable, user-auth store, routes guards)
- Storage isolated for tests

## Next 3 tasks
1. Convert swagger 2.0 to OpenAPI 3 and run openapi-typescript (api:types)
2. Implement MSW handlers for remaining auth/track/playlist endpoints per swagger
3. Wire login/register UI with invite code, token store persistence, 401 redirect handling