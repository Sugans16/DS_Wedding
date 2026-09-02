import { useState, useEffect, useRef, useCallback } from 'react'

const ALL_IMAGES = [
  { src: '/images/couple-1.png', alt: 'Dinesh & Subhikshaa - Beach Sunset' },
  { src: '/images/couple-2.png', alt: 'Dinesh & Subhikshaa - Village Scene' },
  { src: '/images/couple-3.png', alt: 'Dinesh & Subhikshaa - Rainy Evening' },
  { src: '/images/couple-4.png', alt: 'Dinesh & Subhikshaa - Coffee Shop' },
  { src: '/images/couple-5.png', alt: 'Dinesh & Subhikshaa - Beach Portrait' },
  { src: '/images/couple-6.png', alt: 'Dinesh & Subhikshaa - Temple Wedding' },
]

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxImage, setLightboxImage] = useState(null)
  const sectionRef = useRef(null)

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % ALL_IMAGES.length)
  }, [])

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + ALL_IMAGES.length) % ALL_IMAGES.length)
  }, [])

  // Auto-scroll every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 10000) // 10 seconds

    return () => clearInterval(interval)
  }, [nextSlide])

  // Intersection observer for scroll animations
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
      { threshold: 0.1 }
    )

    const el = sectionRef.current?.querySelector('.gallery-container')
    if (el) observer.observe(el)

    return () => observer.disconnect()
  }, [])

  const openLightbox = useCallback((image) => {
    setLightboxImage(image)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxImage(null)
    document.body.style.overflow = ''
  }, [])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [closeLightbox])

  return (
    <section id="gallery" className="py-20 md:py-32 bg-charcoal-light relative" ref={sectionRef}>
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-body mb-3">Moments Together</p>
          <h2 className="font-script text-4xl md:text-5xl gold-gradient-text mb-4">Our Gallery</h2>
          <div className="section-divider" />
          <p className="text-white/40 text-xs mt-4 font-body tracking-wide">
            ✨ Swipe to view more memories
          </p>
        </div>

        {/* Carousel Container */}
        <div className="gallery-container opacity-0 max-w-4xl mx-auto relative group">
          <div className="overflow-hidden rounded-2xl h-[50vh] md:h-[75vh] shadow-2xl shadow-black/50 border border-gold/10 bg-black/40">
            <div
              className="flex transition-transform duration-1000 ease-in-out h-full"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {ALL_IMAGES.map((image, index) => (
                <div
                  key={index}
                  className="w-full h-full flex-shrink-0 cursor-pointer relative flex items-center justify-center p-2 md:p-4"
                  onClick={() => openLightbox(image)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 bg-charcoal/50 hover:bg-gold text-white hover:text-charcoal p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 border border-gold/20"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 bg-charcoal/50 hover:bg-gold text-white hover:text-charcoal p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 border border-gold/20"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {ALL_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex
                    ? 'w-8 h-2 bg-gold'
                    : 'w-2 h-2 bg-white/20 hover:bg-gold/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
            onClick={closeLightbox}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  )
}
