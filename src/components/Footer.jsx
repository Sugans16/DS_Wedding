export default function Footer() {
  const addToGoogleCalendar = (event) => {
    const { title, startDate, endDate, location, description } = event

    // Format dates for Google Calendar (YYYYMMDDTHHmmssZ format)
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
    }

    const start = formatDate(startDate)
    const end = formatDate(endDate)

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}&sf=true&output=xml`

    window.open(url, '_blank')
  }

  const weddingEvent = {
    title: 'Dinesh & Subhikshaa - Wedding Ceremony',
    startDate: new Date('2026-10-30T03:30:00Z'), // 9:00 AM IST = 3:30 AM UTC
    endDate: new Date('2026-10-30T05:00:00Z'),    // 10:30 AM IST = 5:00 AM UTC
    location: 'Thalapathy Arivaalayam, DMK District Headquarter, Public Office Rd, Kadambadi, Nagapattinam, Tamil Nadu 611003',
    description: 'Wedding ceremony of Dinesh & Subhikshaa. We look forward to celebrating this special day with you!',
  }

  const receptionEvent = {
    title: 'Dinesh & Subhikshaa - Reception',
    startDate: new Date('2026-11-01T13:00:00Z'), // 6:30 PM IST = 1:00 PM UTC
    endDate: new Date('2026-11-01T16:00:00Z'),   // 9:30 PM IST = 4:00 PM UTC
    location: 'Anjugam Ammaiyar Marriage Hall, Kalaignar Kottam, Bus Stop, SH 65, Kattur, Tamil Nadu 610104',
    description: 'Reception celebration of Dinesh & Subhikshaa. Join us for an evening of joy and celebration!',
  }

  return (
    <footer id="footer" className="py-16 bg-charcoal relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Add to Calendar */}
        <div className="text-center mb-12">
          <p className="text-white/50 font-body text-sm mb-6">Add to your Google Calendar</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => addToGoogleCalendar(weddingEvent)}
              className="btn-gold inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Wedding — 30 Oct
            </button>
            <button
              onClick={() => addToGoogleCalendar(receptionEvent)}
              className="btn-gold inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Reception — 01 Nov
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        {/* Couple Names */}
        <div className="text-center">
          <h3 className="font-script text-3xl gold-gradient-text mb-3">Dinesh & Subhikshaa</h3>
          <p className="text-white/40 font-body text-xs tracking-widest uppercase mb-6">
            Two hearts, one beautiful journey
          </p>
          <p className="text-white/20 font-body text-xs">
            Made with ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}
