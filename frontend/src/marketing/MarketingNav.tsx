import { Github, Send } from 'lucide-react'

const TELEGRAM_URL = 'https://t.me/OdinTxBot'
const GITHUB_URL = 'https://github.com/BigXero01/OdinTx-TradingBot'

export default function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-surface-border bg-surface/90 px-4 backdrop-blur-xl md:px-8">
      <a href="/" className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-black shadow-[0_0_16px_rgba(247,161,48,0.35)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
          </svg>
        </span>
        <span className="text-[17px] font-extrabold tracking-tight text-white">OdinTx</span>
      </a>

      <ul className="hidden items-center gap-7 md:flex">
        <li><a href="#signals" className="text-sm font-medium text-neutral transition-colors hover:text-white">Signals</a></li>
        <li><a href="#how" className="text-sm font-medium text-neutral transition-colors hover:text-white">How it works</a></li>
        <li><a href="#features" className="text-sm font-medium text-neutral transition-colors hover:text-white">Features</a></li>
      </ul>

      <div className="flex items-center gap-2.5">
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-lg border border-surface-border px-4 py-2 text-[13px] font-semibold text-neutral transition-colors hover:border-neutral hover:text-white sm:flex"
        >
          <Github size={15} />
          GitHub
        </a>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-[13px] font-bold text-black transition-colors hover:bg-brand-dark"
        >
          <Send size={15} />
          Open App
        </a>
      </div>
    </nav>
  )
}
