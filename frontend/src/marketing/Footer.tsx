const GITHUB_URL = 'https://github.com/BigXero01/OdinTx-TradingBot'
const TELEGRAM_URL = 'https://t.me/OdinTxBot'

export default function Footer() {
  return (
    <footer className="flex flex-col items-start gap-4 border-t border-surface-border px-5 py-8 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-center gap-2.5">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand text-black">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
          </svg>
        </span>
        <span className="font-extrabold text-white">OdinTx</span>
      </div>

      <div className="flex items-center gap-6">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral transition-colors hover:text-white">GitHub</a>
        <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-neutral transition-colors hover:text-white">Telegram</a>
        <a href="https://ton.org" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral transition-colors hover:text-white">TON</a>
      </div>

      <p className="text-xs text-neutral">© 2025 OdinTx. Not financial advice.</p>
    </footer>
  )
}
