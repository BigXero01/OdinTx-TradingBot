import { Send } from 'lucide-react'
import Reveal from './Reveal'

const TELEGRAM_URL = 'https://t.me/OdinTxBot'

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-surface-border px-5 py-24 text-center md:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(247,161,48,0.14), transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <h2 className="text-balance text-3xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
            Start trading smarter today — it&apos;s free.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-neutral">
            Open OdinTx in Telegram and get your first signal in under 10 seconds.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-bold text-black transition-colors hover:bg-brand-dark"
          >
            <Send size={18} />
            Open OdinTx Free
          </a>
        </Reveal>
      </div>
    </section>
  )
}
