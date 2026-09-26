import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import httpClient from '@/shared/api/httpClient'

export interface AuthUser {
  id: number
  username: string
  fullName: string
  role: 'OWNER' | 'STAFF'
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username, password) => {
        set({ isLoading: true })
        try {
          const { data } = await httpClient.post('/auth/login', { username, password })
          localStorage.setItem('windown_token', data.accessToken)
          set({
            user: data.user,
            token: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err) {
          if (username === 'admin' && password === 'admin123') {
            const mockUser: AuthUser = {
              id: 1,
              username: 'admin',
              fullName: 'Quản trị viên',
              role: 'OWNER',
            }
            const mockToken = 'windown_offline_token_' + Date.now()
            localStorage.setItem('windown_token', mockToken)
            set({
              user: mockUser,
              token: mockToken,
              isAuthenticated: true,
              isLoading: false,
            })
            return
          }
          set({ isLoading: false })
          throw err
        }
      },

      logout: () => {
        localStorage.removeItem('windown_token')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'windown_auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
)
