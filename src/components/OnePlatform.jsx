import { useState, useEffect, useCallback, useRef } from 'react'
import { useFadeIn } from '../hooks/useScrollAnimation'
import useIsMobile from '../hooks/useIsMobile'
import { asset } from '../utils/assetPath'

const items = ['Vision', 'Dental', 'Medicare', 'ACA', 'Employer-sponsored']
const INTERVAL = 2200
const allItems = [...items, ...items, ...items]

export default function OnePlatform() {
  const fade = useFadeIn()
  const isMobile = useIsMobile()
  // Start at the middle copy so we have room on both sides
  const [activeIdx, setActiveIdx] = useState(items.length)
  const [translateX, setTranslateX] = useState(0)
  const [snap, setSnap] = useState(false)
  const trackRef = useRef(null)
  const containerRef = useRef(null)

  const recenter = useCallback((idx) => {
    requestAnimationFrame(() => {
      const track = trackRef.current
      const container = containerRef.current
      if (!track || !container) return
      const item = track.children[idx]
      if (!item) return
      const containerMid = container.offsetWidth / 2
      const itemMid = item.offsetLeft + item.offsetWidth / 2
      setTranslateX(containerMid - itemMid)
    })
  }, [])

  // Advance index every interval
  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(prev => {
        const next = prev + 1
        // Reset silently to the middle copy when we've gone through one full copy
        // We'll handle the reset after the transition
        return next
      })
    }, INTERVAL)
    return () => clearInterval(id)
  }, [])

  // When activeIdx reaches the last copy, snap back silently to middle copy
  useEffect(() => {
    if (activeIdx >= items.length * 2) {
      const equivalent = activeIdx - items.length
      const id = setTimeout(() => {
        setSnap(true)           // disable transition
        setActiveIdx(equivalent)
        requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)))
      }, 650)
      return () => clearTimeout(id)
    }
  }, [activeIdx])

  // Recalculate translateX whenever activeIdx changes
  useEffect(() => {
    recenter(activeIdx)
  }, [activeIdx, recenter])

  // Recalculate on resize
  useEffect(() => {
    const onResize = () => recenter(activeIdx)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeIdx, recenter])

  return (
    <section className="one-platform" id="one-platform" ref={fade.ref}>
      <div className={`container one-platform-inner ${fade.className}`}>
        <div className="platform-text">
          <h2 className="section-title">One platform.<br />All coverage.</h2>
          <p className="platform-subtitle">Supporting the coverage types brokers and providers work with every day.</p>
        </div>
        <div className="platform-phone">
          <picture>
            <source srcSet={asset(isMobile ? 'assets/images/one-platform-mobile.webp' : 'assets/images/one-platform-desktop.webp')} type="image/webp" />
            <img
              src={asset(isMobile ? 'assets/images/one-platform-mobile.jpg' : 'assets/images/one-platform-desktop.jpg')}
              alt="Near Health - Activate Care"
              loading="lazy"
              className="platform-phone-img"
            />
          </picture>
        </div>
      </div>

      <div className="coverage-carousel" ref={containerRef}>
        <div
          className="carousel-track"
          ref={trackRef}
          style={{ transform: `translateX(${translateX}px)`, transition: snap ? 'none' : undefined }}
        >
          {allItems.map((item, i) => {
            const dist = Math.abs(i - activeIdx)
            const isActive = dist === 0
            return (
              <span
                key={i}
                className={`carousel-item${isActive ? ' carousel-item--active' : ''}`}
                style={{ opacity: Math.max(0, 1 - dist * 0.3) }}
              >
                {item}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
