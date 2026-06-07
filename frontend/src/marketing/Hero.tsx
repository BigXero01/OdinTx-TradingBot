import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import PhoneMockup from './PhoneMockup'

const TELEGRAM_URL = 'https://t.me/OdinTxBot'

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-16 md:pb-24 md:pt-24">
      {/* Backdrop */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(247,161,48,0.12), transparent 60%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(#2a2a2a 1px, transparent 1px), linear-gradient(90deg, #2a2a2a 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-semibold text-brand"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-glow" />
          Live on TON Network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl"
        >
          Trade smarter with{' '}
          <span className="text-brand">AI-powered signals</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral md:text-lg"
        >
          Real-time BUY / SELL / HOLD signals driven by RSI, MACD, and on-chain
          intelligence — all inside Telegram.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-base font-bold text-black transition-colors hover:bg-brand-dark sm:w-auto"
          >
            <Send size={18} />
            Launch OdinTx Free
          </a>
          <a
            href="#signals"
            className="flex w-full items-center justify-center rounded-xl border border-surface-border px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-neutral sm:w-auto"
          >
            See live signals
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-16"
      >
        <PhoneMockup />
      </motion.div>
    </section>
  )
}
