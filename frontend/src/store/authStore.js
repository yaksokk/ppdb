import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      lastActivity:    null,
      ppdbClosed:      false, // R4: flag PPDB ditutup

      setAuth: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        lastActivity: Date.now(),
        ppdbClosed: false,
      }),

      clearAuth: () => set({
        user:            null,
        token:           null,
        isAuthenticated: false,
        lastActivity:    null,
        ppdbClosed:      false,
      }),

      updateActivity: () => set({ lastActivity: Date.now() }),

      // R4: set/clear status PPDB tutup
      setPpdbClosed: (val) => set({ ppdbClosed: val }),

      isSessionExpired: () => {
        const { lastActivity } = get()
        if (!lastActivity) return true
        const ONE_HOUR = 60 * 60 * 1000
        return Date.now() - lastActivity > ONE_HOUR
      },
    }),
    {
      name: 'ppdb-auth',
      storage: {
        getItem:    (key) => {
          const item = localStorage.getItem(key)
          return item ? JSON.parse(item) : null
        },
        setItem:    (key, value) => localStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => localStorage.removeItem(key),
      },
    }
  )
)

export default useAuthStore
