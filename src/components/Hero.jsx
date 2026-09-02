import { useState, useEffect } from 'react'

export default function Hero() {
  const weddingDate = new Date('2026-10-30T09:00:00+05:30')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  function getTimeLeft() {
    const now = new Date()
    const diff = weddingDate - now
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      passed: false,
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="hero" className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Content */}
      <div className="w-full lg:w-1/2 hero-gradient flex flex-col justify-center items-start px-8 md:px-16 lg:px-20 py-16 lg:py-0 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold/10 rounded-full animate-float" />
        <div className="absolute bottom-20 right-10 w-20 h-20 border border-gold/5 rounded-full animate-float animate-delay-300" />
        <div className="absolute top-1/2 right-0 w-px h-40 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

        {/* Date & Countdown */}
        <div className="opacity-0 animate-fade-in-up mb-8">
          <div className="flex items-start gap-4">
            <div className="text-right">
              <p className="text-gold text-xs uppercase tracking-[0.3em] font-body">Friday</p>
              <p className="text-white/80 font-heading text-sm">30 October</p>
              <p className="text-white/80 font-heading text-sm">2026</p>
              <p className="text-white/50 text-xs mt-1">9:00 am</p>
            </div>
            <div className="w-px h-16 bg-gold/40" />
            <div className="flex flex-col justify-center">
              {timeLeft.passed ? (
                <div>
                  <p className="text-gold text-3xl font-heading font-bold">Married!</p>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Happily Ever After</p>
                </div>
              ) : (
                <div>
                  <p className="text-gold text-4xl font-heading font-bold">{timeLeft.days}</p>
                  <p className="text-white/60 text-xs uppercase tracking-wider">Days to go</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Names */}
        <div className="opacity-0 animate-fade-in-up animate-delay-200 mb-6">
          <h1 className="font-script text-5xl md:text-6xl lg:text-7xl gold-gradient-text text-shadow-gold leading-tight">
            Dinesh & Subhikshaa
          </h1>
        </div>

        {/* Tagline */}
        <div className="opacity-0 animate-fade-in-up animate-delay-300 mb-12">
          <p className="font-heading text-lg md:text-xl text-white/70 italic">
            Join us for a memorable event to remember
          </p>
        </div>

        {/* Countdown Timer */}
        {!timeLeft.passed && (
          <div className="opacity-0 animate-fade-in-up animate-delay-400 mb-12">
            <div className="flex gap-6 md:gap-8">
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="text-gold/30 text-3xl font-light self-start mt-2">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="text-gold/30 text-3xl font-light self-start mt-2">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="countdown-label">Mins</span>
              </div>
              <div className="text-gold/30 text-3xl font-light self-start mt-2">:</div>
              <div className="countdown-item">
                <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="countdown-label">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Venue */}
        <div className="opacity-0 animate-fade-in-up animate-delay-500">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-px h-12 bg-gold/40 mt-1 flex-shrink-0" />
            <p className="text-white/60 font-body text-sm leading-relaxed">
              Thalapathy Arivaalayam - DMK District Headquarter,<br />
              Public Office Rd, South Palpannaicherry, Kadambadi,<br />
              Nagapattinam, Tamil Nadu 611003
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Thalapathy+Arivaalayam+DMK+District+Headquarter+Nagapattinam+Tamil+Nadu+611003"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 btn-gold text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Get Direction
          </a>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full lg:w-1/2 h-[60vh] lg:h-screen relative image-overlay">
        <img
          src="/images/couple-1.png"
          alt="Dinesh and Subhikshaa - Beach Sunset"
          className="w-full h-full object-cover object-top"
        />
      </div>
    </section>
  )
}
