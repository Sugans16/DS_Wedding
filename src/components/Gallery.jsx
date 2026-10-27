import { useState, useEffect, useRef, useCallback } from 'react'

// Dynamically import all images from assets/gallery
const imageModules = import.meta.glob('../assets/gallery/*.jpg', { eager: true, import: 'default' })

// Convert to array
const ALL_IMAGES = Object.entries(imageModules).map(([filePath, src]) => {
  const fileName = filePath.split('/').pop().replace(/\.[^/.]+$/, '')
  return {
    src,
    id: fileName,
    alt: `Dinesh & Subhikshaa (${fileName})`,
  }
})

// Sort so 0Y1A1024 is #1 (Hero first photo), followed by 0Y1A1020 (#2), then natural order
ALL_IMAGES.sort((a, b) => {
  if (a.id === '0Y1A1024') return -1
  if (b.id === '0Y1A1024') return 1
  if (a.id === '0Y1A1020') return -1
  if (b.id === '0Y1A1020') return 1
  return a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' })
})

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [showAllGrid, setShowAllGrid] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const sectionRef = useRef(null)
  const thumbStripRef = useRef(null)

  const total = ALL_IMAGES.length

  const nextSlide = useCallback(() => {
    if (total <= 1) return
    setActiveIndex((prev) => (prev + 1) % total)
  }, [total])

  const prevSlide = useCallback(() => {
    if (total <= 1) return
    setActiveIndex((prev) => (prev - 1 + total) % total)
  }, [total])

  // Scroll active thumbnail into view smoothly
  useEffect(() => {
    if (thumbStripRef.current) {
      const activeThumb = thumbStripRef.current.children[activeIndex]
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        })
      }
    }
  }, [activeIndex])

  // Auto-scroll every 8 seconds, pausing if user hovers or is in lightbox
  useEffect(() => {
    if (isPaused || lightboxIndex !== null || total <= 1) return
    const interval = setInterval(() => {
      nextSlide()
    }, 8000)
    return () => clearInterval(interval)
  }, [nextSlide, isPaused, lightboxIndex, total])

  // Intersection observer for entrance animation
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

  // Lightbox navigation
  const openLightbox = (index) => {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const nextLightbox = useCallback(
    (e) => {
      e?.stopPropagation()
      if (total <= 1) return
      setLightboxIndex((prev) => (prev + 1) % total)
    },
    [total]
  )

  const prevLightbox = useCallback(
    (e) => {
      e?.stopPropagation()
      if (total <= 1) return
      setLightboxIndex((prev) => (prev - 1 + total) % total)
    },
    [total]
  )

  // Keyboard controls for lightbox and carousel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowRight') nextLightbox()
        if (e.key === 'ArrowLeft') prevLightbox()
      } else {
        if (e.key === 'ArrowRight') nextSlide()
        if (e.key === 'ArrowLeft') prevSlide()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, closeLightbox, nextLightbox, prevLightbox, nextSlide, prevSlide])

  return (
    <section id="gallery" className="py-20 md:py-32 bg-charcoal-light relative" ref={sectionRef}>
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-body mb-3">Moments Together</p>
          <h2 className="font-script text-4xl md:text-5xl gold-gradient-text mb-4">Our Gallery</h2>
          <div className="section-divider" />
          <p className="text-white/60 text-xs mt-4 font-body tracking-wide flex items-center justify-center gap-2">
            <span>✨ {total} Memories Captured</span>
            <span>&bull;</span>
            <span>Click any photo to enlarge</span>
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="gallery-container opacity-0 max-w-4xl mx-auto relative group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Active Photo Counter Pill */}
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-xs uppercase tracking-widest text-gold/80 font-body">
              {ALL_IMAGES[activeIndex]?.id}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-gold/30 text-gold text-xs font-semibold tracking-wider font-body shadow-lg">
              {activeIndex + 1} / {total}
            </span>
          </div>

          {/* Main Slide Card */}
          <div className="overflow-hidden rounded-2xl h-[50vh] md:h-[75vh] shadow-2xl shadow-black/50 border border-gold/20 bg-black/50 relative">
            <div
              className="flex transition-transform duration-700 ease-in-out h-full"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {ALL_IMAGES.map((image, index) => (
                <div
                  key={image.id}
                  className="w-full h-full flex-shrink-0 cursor-pointer relative flex items-center justify-center p-2 md:p-4"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-500 hover:scale-[1.01]"
                    loading={Math.abs(index - activeIndex) <= 2 ? 'eager' : 'lazy'}
                  />
                  {/* Subtle click to zoom badge */}
                  <div className="absolute bottom-6 right-6 bg-black/60 hover:bg-gold hover:text-charcoal text-white/80 p-2 rounded-full backdrop-blur-md border border-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 bg-charcoal/80 hover:bg-gold text-white hover:text-charcoal p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border border-gold/30 z-10"
            aria-label="Previous image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 bg-charcoal/80 hover:bg-gold text-white hover:text-charcoal p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-xl border border-gold/30 z-10"
            aria-label="Next image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Interactive Thumbnails Scroller Bar */}
          <div className="mt-6">
            <div
              ref={thumbStripRef}
              className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gold/30 scrollbar-track-black/20"
              style={{ scrollBehavior: 'smooth' }}
            >
              {ALL_IMAGES.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    idx === activeIndex
                      ? 'border-gold scale-105 shadow-md shadow-gold/30 opacity-100 ring-2 ring-gold/40'
                      : 'border-white/10 opacity-40 hover:opacity-80 hover:border-gold/50'
                  }`}
                  aria-label={`Jump to photo ${idx + 1}`}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Full Photo Album Grid */}
          <div className="text-center mt-10">
            <button
              onClick={() => setShowAllGrid(!showAllGrid)}
              className="btn-gold inline-flex items-center gap-2 text-xs font-semibold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span>{showAllGrid ? 'Hide Full Album' : `Explore All ${total} Photos`}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${showAllGrid ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Expanded Grid View */}
          {showAllGrid && (
            <div className="mt-8 pt-8 border-t border-gold/10">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {ALL_IMAGES.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => openLightbox(index)}
                    className="gallery-img aspect-square relative rounded-xl overflow-hidden bg-black/40 border border-gold/10 group/item cursor-pointer"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-gold text-xs font-semibold px-2 py-1 rounded bg-black/70 border border-gold/30">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal with Full Navigation */}
      {lightboxIndex !== null && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          {/* Header Bar */}
          <div
            className="absolute top-4 left-6 right-6 flex justify-between items-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="px-3 py-1 rounded-full bg-black/70 border border-gold/30 text-gold text-xs font-semibold font-body tracking-wider">
              {lightboxIndex + 1} / {total} &bull; {ALL_IMAGES[lightboxIndex]?.id}
            </span>
            <button
              className="text-white/70 hover:text-white bg-black/60 p-2 rounded-full border border-white/20 transition-colors"
              onClick={closeLightbox}
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Left Arrow */}
          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-gold bg-charcoal/80 hover:bg-gold p-3 rounded-full border border-gold/30 transition-all z-20 shadow-xl"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Main Image */}
          <img
            src={ALL_IMAGES[lightboxIndex]?.src}
            alt={ALL_IMAGES[lightboxIndex]?.alt}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />

          {/* Right Arrow */}
          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-gold bg-charcoal/80 hover:bg-gold p-3 rounded-full border border-gold/30 transition-all z-20 shadow-xl"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
