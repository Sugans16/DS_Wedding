import { useEffect, useRef } from 'react'

export default function Events() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            entry.target.style.opacity = '1'
          }
        })
      },
      { threshold: 0.2 }
    )

    const items = sectionRef.current?.querySelectorAll('.event-item')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  const events = [
    {
      date: '30',
      day: 'Fri',
      month: 'Oct',
      year: '2026',
      title: 'Wedding Ceremony',
      time: '9:00 AM – 10:30 AM',
      venue: 'Thalapathi Arivalayam',
      address: 'Near Valivalam Desigar Polytechnic College, Velippalayam, Nagapattinam',
      mapQuery: 'Thalapathy+Arivaalayam+DMK+District+Headquarter+Nagapattinam+Tamil+Nadu+611003',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      date: '01',
      day: 'Sun',
      month: 'Nov',
      year: '2026',
      title: 'Reception',
      time: '6:30 PM onwards',
      venue: 'Anjugam Ammaiyar Marriage Hall',
      address: 'Kalaignar Kottam, Bus Stop, SH 65, Kattur, Tamil Nadu 610104',
      mapUrl: 'https://maps.app.goo.gl/SpzoXMg6HjFAnZhB9',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.75 1.75 0 003 15.546V12a9 9 0 0118 0v3.546z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="events" className="py-20 md:py-32 bg-charcoal relative" ref={sectionRef}>
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-body mb-3">Save The Date</p>
          <h2 className="font-script text-4xl md:text-5xl gold-gradient-text mb-4">Our Events</h2>
          <div className="section-divider" />
        </div>

        {/* Events */}
        <div className="space-y-12">
          {events.map((event, index) => (
            <div
              key={index}
              className="event-item opacity-0 flex flex-col md:flex-row items-stretch gap-6 md:gap-10"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Date Block */}
              <div className="flex-shrink-0 flex md:flex-col items-center md:items-end gap-3 md:gap-0 md:w-24 md:text-right">
                <span className="text-5xl md:text-6xl font-heading font-bold text-gold leading-none">{event.date}</span>
                <div className="flex md:flex-col items-center md:items-end gap-1">
                  <span className="text-sm font-body text-white/50">{event.day}</span>
                  <span className="text-lg font-heading text-white/70">{event.month}</span>
                  <span className="text-xs font-body text-white/40">{event.year}</span>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-gold flex-shrink-0" />
                <div className="w-px flex-1 bg-gold/20" />
              </div>

              {/* Event Details */}
              <div className="flex-1 glass-card rounded-xl p-6 md:p-8 hover:border-gold/40 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-gold group-hover:scale-110 transition-transform duration-300">
                    {event.icon}
                  </div>
                  <h3 className="font-heading text-2xl md:text-3xl text-white font-semibold">{event.title}</h3>
                </div>
                <p className="text-gold font-body text-sm mb-3 tracking-wide">{event.time}</p>
                <p className="font-heading text-lg text-white/80 mb-1">{event.venue}</p>
                <p className="text-white/50 font-body text-sm leading-relaxed mb-4">{event.address}</p>
                <a
                  href={event.mapUrl || `https://www.google.com/maps/search/?api=1&query=${event.mapQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold text-sm font-body hover:text-gold-light transition-colors duration-300 group/link"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="border-b border-gold/30 group-hover/link:border-gold transition-colors duration-300">Get Direction</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
