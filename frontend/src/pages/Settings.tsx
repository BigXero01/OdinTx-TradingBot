import { Settings as SettingsIcon, Bell, Shield, Info, ChevronRight } from 'lucide-react'
import { useTelegramUser } from '@/hooks/useTelegramTheme'
import { TonConnectButton } from '@tonconnect/ui-react'

const SIGNAL_PAIRS = ['BTC/USDT', 'ETH/USDT', 'TON/USDT', 'SOL/USDT', 'BNB/USDT']

export default function Settings() {
  const user = useTelegramUser()

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center gap-2 mb-5">
        <SettingsIcon size={20} className="text-brand" />
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      {user && (
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold">
            {user.first_name[0]}
          </div>
          <div>
            <p className="font-semibold text-white">{user.first_name}</p>
            {user.username && <p className="text-neutral text-sm">@{user.username}</p>}
          </div>
        </div>
      )}

      <div className="mb-5">
        <p className="text-xs text-neutral uppercase tracking-widest mb-3">Wallet</p>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
          <TonConnectButton />
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-neutral uppercase tracking-widest mb-3">Notifications</p>
        <div className="bg-surface-card border border-surface-border rounded-2xl divide-y divide-surface-border">
          {[
            { icon: Bell, label: 'Signal Alerts', sub: 'Get notified on new signals' },
            { icon: Shield, label: 'Risk Alerts', sub: 'Stop-loss breach warnings' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 p-4">
              <Icon size={18} className="text-neutral" />
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-neutral text-xs">{sub}</p>
              </div>
              <ChevronRight size={16} className="text-neutral" />
            </div>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs text-neutral uppercase tracking-widest mb-3">Tracked Pairs</p>
        <div className="flex flex-wrap gap-2">
          {SIGNAL_PAIRS.map((pair) => (
            <span key={pair} className="bg-surface-card border border-brand/30 text-brand px-3 py-1 rounded-full text-sm font-medium">
              {pair}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-2xl p-4 flex items-center gap-3">
        <Info size={18} className="text-neutral" />
        <div>
          <p className="text-white text-sm font-medium">OdinTx v0.1.0</p>
          <p className="text-neutral text-xs">AI-powered TON trading signals</p>
        </div>
      </div>
    </div>
  )
}
