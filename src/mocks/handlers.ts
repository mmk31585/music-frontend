import { http, HttpResponse } from 'msw'

// Base mock handler definitions scaffolded for Phase F1.
// Driven by contracts/openapi.json; expand as endpoints are implemented.
export const handlers = [
  // Auth
  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string }
    if (!body.email || !body.password) {
      return HttpResponse.json({ message: 'no access token' }, { status: 400 })
    }
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: { id: 'u1', email: body.email, username: 'mockuser', role: 'listener' },
    })
  }),
  http.post('/api/v1/auth/register', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      user: { id: 'u2', ...body },
    })
  }),
  http.post('/api/v1/auth/refresh', () =>
    HttpResponse.json({ access_token: 'mock-access-token-2', refresh_token: 'mock-refresh-2' }),
  ),
  http.get('/api/v1/auth/me', () =>
    HttpResponse.json({ id: 'u1', email: 'mock@example.com', username: 'mockuser', role: 'listener' }),
  ),
]