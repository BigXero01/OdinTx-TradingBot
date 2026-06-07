import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Zap, Wallet, Settings } from 'lucide-react'

const tabs = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Market' },
  { to: '/signals', icon: Zap, label: 'Signals' },
  { to: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function NavBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-surface-card border-t border-surface-border z-50"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-brand' : 'text-neutral hover:text-white'
              }`
            }
          >
            <Icon size={20} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
