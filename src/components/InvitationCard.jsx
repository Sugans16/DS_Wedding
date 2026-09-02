import { useEffect, useRef } from 'react'

export default function InvitationCard() {
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

    const el = sectionRef.current?.querySelector('.invitation-card')
    if (el) observer.observe(el)

    return () => observer.disconnect()
  }, [])

  const handleDownload = () => {
    // Try to download the PDF first; fall back to the invitation image
    const link = document.createElement('a')
    link.href = '/images/invitation.png'
    link.download = 'Dinesh_Subhikshaa_Wedding_Invitation.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="invitation" className="py-20 md:py-32 bg-charcoal relative" ref={sectionRef}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-body mb-3">You Are Cordially Invited</p>
          <h2 className="font-script text-4xl md:text-5xl gold-gradient-text mb-4">Wedding Invitation</h2>
          <div className="section-divider" />
        </div>

        {/* Invitation Card */}
        <div className="invitation-card opacity-0 max-w-2xl mx-auto">
          <div className="glass-card rounded-2xl p-4 md:p-6 hover:border-gold/40 transition-all duration-500 group">
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-black/30">
              <img
                src="/images/invitation.png"
                alt="Dinesh & Subhikshaa Wedding Invitation"
                className="w-full h-auto group-hover:scale-[1.01] transition-transform duration-700"
              />
            </div>
            
            {/* Download Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleDownload}
                className="btn-gold-filled inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Invitation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
