import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useTelegramTheme } from '@/hooks/useTelegramTheme'
import NavBar from '@/components/NavBar'
import Landing from '@/marketing/Landing'
import Dashboard from '@/pages/Dashboard'
import Signals from '@/pages/Signals'
import Portfolio from '@/pages/Portfolio'
import Settings from '@/pages/Settings'

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-surface-border bg-surface/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-1.5 text-sm font-medium text-neutral transition-colors hover:text-white">
          <ChevronLeft size={16} />
          Home
        </Link>
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-black">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
            </svg>
          </span>
          <span className="text-sm font-extrabold text-white">OdinTx</span>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <NavBar />
    </div>
  )
}

export default function App() {
  useTelegramTheme()

  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/app/dashboard" element={<AppShell><Dashboard /></AppShell>} />
        <Route path="/app/signals" element={<AppShell><Signals /></AppShell>} />
        <Route path="/app/portfolio" element={<AppShell><Portfolio /></AppShell>} />
        <Route path="/app/settings" element={<AppShell><Settings /></AppShell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
