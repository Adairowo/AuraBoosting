import { create } from 'zustand'
import { fetchCurrentUser, login as apiLogin, logout as apiLogout } from '../api/auth'

const TOKEN_KEY = 'auth_token'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem(TOKEN_KEY) || '',
  status: 'idle',
  async bootstrap() {
    const { token, status } = get()
    if (!token) {
      set({ status: 'unauthenticated', user: null })
      return null
    }
    if (status === 'authenticated') return get().user
    set({ status: 'loading' })
    try {
      const user = await fetchCurrentUser()
      set({ user, status: 'authenticated' })
      return user
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY)
      set({ token: '', user: null, status: 'unauthenticated' })
      return null
    }
  },
  async login(payload) {
    const data = await apiLogin(payload)
    const token = data?.access_token
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      set({ token })
    }
    set({ user: data?.user || null, status: 'authenticated' })
    return data
  },
  async logout() {
    try {
      await apiLogout()
    } catch (error) {
      // ignore network errors on logout
    }
    localStorage.removeItem(TOKEN_KEY)
    set({ token: '', user: null, status: 'unauthenticated' })
  },
}))

export default useAuthStore
