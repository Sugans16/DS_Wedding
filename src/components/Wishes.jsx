import { useState, useEffect, useRef, useCallback } from 'react'
import { db } from '../firebase'
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore'

const DEFAULT_WISHES = [
  {
    id: 1,
    name: 'With Love',
    message: 'Wishing you both a beautiful married life filled with endless love, joy, and togetherness. Congratulations! 🎊 ❤️',
    emoji: '💐',
  },
]

const EMOJIS = ['💐', '🎉', '💕', '✨', '🥂', '💝', '🌸', '🎊', '💍', '❤️', '😊', '😍', '🥰', '🥳', '🙌', '😘']

export default function Wishes() {
  const [wishes, setWishes] = useState(() => {
    if (!db) {
      const saved = localStorage.getItem('wedding-wishes-dinesh-subhi')
      return saved ? JSON.parse(saved) : DEFAULT_WISHES
    }
    return DEFAULT_WISHES
  })
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)

  const nextSlide = useCallback(() => {
    if (wishes.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % wishes.length)
  }, [wishes.length])

  const prevSlide = useCallback(() => {
    if (wishes.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + wishes.length) % wishes.length)
  }, [wishes.length])

  // Auto-scroll every 10 seconds
  useEffect(() => {
    if (wishes.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide()
    }, 10000)
    return () => clearInterval(interval)
  }, [wishes.length, nextSlide])

  // Firebase Real-time Listener
  useEffect(() => {
    if (!db) return;
    
    const q = query(collection(db, 'wishes'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseWishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      if (firebaseWishes.length > 0) {
        setWishes(firebaseWishes);
      }
    });

    return () => unsubscribe();
  }, []);

  // LocalStorage fallback sync (only if Firebase is not active)
  useEffect(() => {
    if (!db) {
      localStorage.setItem('wedding-wishes-dinesh-subhi', JSON.stringify(wishes))
    }
  }, [wishes])

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

    const items = sectionRef.current?.querySelectorAll('.wish-item')
    items?.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [wishes])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    const cardEmojis = ['💐', '🎉', '💕', '✨', '🥂', '💝', '🌸', '🎊']
    const selectedCardEmoji = cardEmojis[Math.floor(Math.random() * cardEmojis.length)];
    
    const newWishData = {
      name: name.trim(),
      message: message.trim(),
      emoji: selectedCardEmoji,
      timestamp: Date.now()
    };

    if (db) {
      try {
        await addDoc(collection(db, 'wishes'), newWishData);
      } catch (error) {
        console.error("Error adding wish: ", error);
        alert("Could not send wish. Please try again.");
        return;
      }
    } else {
      setWishes((prev) => [...prev, { id: Date.now(), ...newWishData }]);
    }

    setName('')
    setMessage('')
    setShowModal(false)
  }

  const handleDeleteWish = async (id) => {
    const code = window.prompt("Enter admin code to delete wish:")
    if (code === "DineshSubhiMarriage") {
      if (db) {
        try {
          await deleteDoc(doc(db, 'wishes', id));
          setActiveIndex((prev) => (prev >= wishes.length - 1 ? Math.max(0, wishes.length - 2) : prev))
        } catch (error) {
          console.error("Error deleting wish:", error);
        }
      } else {
        setWishes((prev) => prev.filter(wish => wish.id !== id))
        setActiveIndex((prev) => (prev >= wishes.length - 1 ? Math.max(0, wishes.length - 2) : prev))
      }
    } else if (code !== null) {
      window.location.reload()
    }
  }

  return (
    <section id="wishes" className="py-20 md:py-32 bg-charcoal-light relative" ref={sectionRef}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <p className="text-gold text-xs uppercase tracking-[0.4em] font-body mb-3">Blessings & Wishes</p>
          <h2 className="font-script text-4xl md:text-5xl gold-gradient-text mb-4">Guestbook</h2>
          <div className="section-divider" />
        </div>

        {/* Wishes Carousel */}
        <div className="relative h-64 md:h-48 mb-12 max-w-2xl mx-auto group">
          <div className="overflow-hidden h-full mask-image-vertical relative">
            <div 
              className="flex flex-col transition-transform duration-1000 ease-in-out h-full"
              style={{ transform: `translateY(-${activeIndex * 100}%)` }}
            >
              {wishes.map((wish, index) => (
                <div
                  key={wish.id}
                  className="w-full h-full flex-shrink-0 flex items-center justify-center py-4 cursor-default"
                  onDoubleClick={() => handleDeleteWish(wish.id)}
                >
                  <div className="wish-card px-6 py-5 md:px-8 md:py-6 w-full shadow-xl">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">{wish.emoji}</span>
                      <div>
                        <p className="font-heading text-base md:text-lg text-charcoal/90 leading-relaxed mb-2 italic">
                          "{wish.message}"
                        </p>
                        <p className="text-charcoal/60 font-body text-sm flex items-center gap-1 font-semibold">
                          <span className="text-green-600">~</span> {wish.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 md:-translate-y-6 bg-charcoal/80 hover:bg-gold text-white hover:text-charcoal p-2 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 border border-gold/20 z-10"
            aria-label="Previous wish"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 md:translate-y-6 bg-charcoal/80 hover:bg-gold text-white hover:text-charcoal p-2 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 border border-gold/20 z-10"
            aria-label="Next wish"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Send Wishes Button */}
        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="btn-gold-filled inline-flex items-center gap-2 text-base"
          >
            Send your wishes 💌
          </button>
        </div>
      </div>

      {/* Wish Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-2xl text-gold">Send Your Wishes</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm font-body mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/5 border border-gold/20 rounded-lg px-4 py-3 text-white font-body text-sm
                    placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm font-body mb-1">Your Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your wishes for the couple..."
                  rows={4}
                  className="w-full bg-white/5 border border-gold/20 rounded-lg px-4 py-3 text-white font-body text-sm
                    placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm font-body mb-2">Add Emojis</label>
                <div className="flex flex-wrap gap-2 bg-charcoal p-2 rounded-lg border border-gold/10">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setMessage(prev => prev + emoji)}
                      className="text-xl p-2 rounded hover:bg-gold/20 hover:scale-110 transition-all duration-300"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-gold-filled w-full text-center mt-4">
                Send Wishes 💕
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
