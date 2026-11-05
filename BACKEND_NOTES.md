# Backend Notes (frontend-side workarounds)

These are production issues observed on Vercel that require backend/infrastructure changes, documented here because the frontend repo cannot touch the backend or configure AWS.

## S3 CORS blocks direct PUT from Vercel frontend

**Symptom:** `PUT https://s3-cinereous-flame-554008738594.s3.us-east-1.amazonaws.com/...` blocked by CORS policy — `No 'Access-Control-Allow-Origin' header is present on the requested resource.` (403/ERR_FAILED)

**Root cause:** The S3 bucket `s3-cinereous-flame-554008738594` does not allow `PUT` from origin `https://music-frontend-umber-delta.vercel.app`. The frontend does presigned direct `PUT` to S3 for files >4MB.

**Frontend workaround applied:** `PageAdminIngestion.vue` now falls back to the backend multipart upload route (`/admin/ingestion/upload`) when the direct S3 `PUT` fails (CORS/any error). The backend proxies to S3 server-side, bypassing CORS.

**Backend/infrastructure fix needed:** Configure the S3 bucket CORS to allow:
- Origins: `https://music-frontend-umber-delta.vercel.app` (and `https://music-three-coral.vercel.app` API origin if needed)
- Methods: `PUT`, `GET`, `HEAD`, `POST`
- Allowed headers: `*`
- Expose headers: `ETag`

Or set `PresignURLs`/`PublicBaseURL` in `S3Config` so the backend returns proxyable URLs instead of direct S3 links.

## yt-dlp missing on Vercel build

**Symptom:** `exec: \"yt-dlp\": executable file not found in $PATH` → 500 on import/batch.

**Fix applied (root repo):** `vercel.json` `buildCommand` now downloads `yt-dlp_linux` before `go build`. Committed in root `80df7da`.

## WebSocket connects to frontend origin instead of API

**Symptom:** `wss://music-frontend-umber-delta.vercel.app/api/v1/ws` → 404 (should be `music-three-coral.vercel.app`).

**Fix applied (frontend):** `socket/client.ts` `wsOrigin()` derives origin from `VITE_API_BASE_URL` when `VITE_WS_URL` is not set. Committed in frontend submodule.

## Backlog

- Configure S3 bucket CORS for the Vercel frontend origin (infrastructure, human-only).
- Rotate `.env` secrets that remain in git history (human-only; AGENTS.md notes).
- Run migrations against production Neon (human-only; AGENTS.md).
