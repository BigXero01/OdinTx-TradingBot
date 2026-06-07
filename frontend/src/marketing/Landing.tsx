import { useEffect } from 'react'
import Ticker from './Ticker'
import MarketingNav from './MarketingNav'
import Hero from './Hero'
import Stats from './Stats'
import SignalsSection from './SignalsSection'
import HowItWorks from './HowItWorks'
import Features from './Features'
import FinalCta from './FinalCta'
import Footer from './Footer'

export default function Landing() {
  useEffect(() => {
    document.title = 'OdinTx — AI Trading Signals for TON'
  }, [])

  return (
    <div className="min-h-dvh bg-surface">
      <Ticker />
      <MarketingNav />
      <Hero />
      <Stats />
      <SignalsSection />
      <HowItWorks />
      <Features />
      <FinalCta />
      <Footer />
    </div>
  )
}
