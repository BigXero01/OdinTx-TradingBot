import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useTelegramTheme } from '@/hooks/useTelegramTheme'
import NavBar from '@/components/NavBar'
import Dashboard from '@/pages/Dashboard'
import Signals from '@/pages/Signals'
import Portfolio from '@/pages/Portfolio'
import Settings from '@/pages/Settings'

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
    <BrowserRouter basename="/app">
      <div className="flex flex-col min-h-dvh bg-surface">
        <main className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signals" element={<Signals />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}
