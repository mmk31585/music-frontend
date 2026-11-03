import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserAuthStore } from '@/stores/user-auth'

vi.mock('@/services/api/auth', () => ({
  useAuthApi: () => ({
    login: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  }),
}))

vi.mock('js-cookie', () => ({
  default: {
    set: vi.fn(),
    remove: vi.fn(),
    get: vi.fn(() => undefined),
  },
}))

describe('user-auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('initializes unauthenticated', () => {
    const store = useUserAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('setSession marks authenticated and stores user', () => {
    const store = useUserAuthStore()
    store.setSession({
      access_token: 'access-123',
      refresh_token: 'refresh-123',
      user: { id: 'u1', email: 'a@b.com', username: 'alice', role: 'listener' },
    })
    expect(store.isAuthenticated).toBe(true)
    expect(store.token).toBe('access-123')
    expect(store.user?.id).toBe('u1')
  })

  it('clearToken clears authentication state', () => {
    const store = useUserAuthStore()
    store.setSession({
      access_token: 'access-123',
      user: { id: 'u1', email: 'a@b.com', username: 'alice', role: 'listener' },
    })
    store.clearToken()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
  })

  it('clearUser clears user but keeps token', () => {
    const store = useUserAuthStore()
    store.setSession({
      access_token: 'access-123',
      user: { id: 'u1', email: 'a@b.com', username: 'alice', role: 'listener' },
    })
    store.clearUser()
    expect(store.user).toBeNull()
    expect(store.token).toBe('access-123')
  })

  it('$reset clears everything', () => {
    const store = useUserAuthStore()
    store.setSession({
      access_token: 'access-123',
      user: { id: 'u1', email: 'a@b.com', username: 'alice', role: 'listener' },
    })
    store.$reset()
    expect(store.isAuthenticated).toBe(false)
    expect(store.token).toBeNull()
    expect(store.user).toBeNull()
  })

  it('isAdmin is true only for admin role', () => {
    const store = useUserAuthStore()
    store.setSession({
      access_token: 't',
      user: { id: 'u1', email: 'a@b.com', username: 'alice', role: 'admin' },
    })
    expect(store.isAdmin).toBe(true)

    store.setSession({
      access_token: 't',
      user: { id: 'u2', email: 'b@b.com', username: 'bob', role: 'listener' },
    })
    expect(store.isAdmin).toBe(false)
  })
})
