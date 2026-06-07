import { useEffect } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        close: () => void
        initDataUnsafe: { user?: { id: number; first_name: string; username?: string } }
        colorScheme: 'light' | 'dark'
        themeParams: Record<string, string>
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (fn: () => void) => void
        }
      }
    }
  }
}

export function useTelegramTheme() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return
    const params = tg.themeParams
    if (params.bg_color) {
      document.documentElement.style.setProperty('--tg-theme-bg-color', params.bg_color)
    }
  }, [])
}

export function useTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null
}
