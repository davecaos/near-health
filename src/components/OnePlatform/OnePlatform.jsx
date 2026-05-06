import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { splitLines, lineRevealVars, blockRevealVars, blockRevealFromVars, selfTrigger } from '../../utils/reveal'
import useIsMobile from '../../hooks/useIsMobile'
import { asset } from '../../utils/assetPath'
import './OnePlatform.css'

const INITIAL = ['Vision', 'Dental', 'Medicare', 'ACA', 'Employer-sponsored']
const INTERVAL = 2200
const DURATION = 550
const COPIES = 3
const items = Array.from({ length: COPIES }, () => INITIAL).flat()

export default function OnePlatform() {
  const isMobile = useIsMobile()
  const centerOffset = Math.floor(INITIAL.length / 2)

  const [baseIndex, setBaseIndex] = useState(INITIAL.length)
  const [animated, setAnimated] = useState(false)
  const [tx, setTx] = useState(0)
  const [snapping, setSnapping] = useState(false)

  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const phoneRef = useRef(null)
  const trackRef = useRef(null)
  const containerRef = useRef(null)
  const txRef = useRef(0)
  const baseRef = useRef(INITIAL.length)
  const busyRef = useRef(false)

  useScrollReveal({
    scopeRef: sectionRef,
    prepare: () => {
      gsap.set([titleRef.current, subtitleRef.current], { autoAlpha: 0 })
      gsap.set(phoneRef.current, blockRevealFromVars())
      return [titleRef.current, subtitleRef.current, phoneRef.current]
    },
    animate: () => {
      const titleSplit = splitLines(titleRef.current)
      const subSplit = splitLines(subtitleRef.current)
      gsap.set([titleRef.current, subtitleRef.current], { autoAlpha: 1 })

      gsap.from(titleSplit.lines, { ...lineRevealVars(), scrollTrigger: selfTrigger(titleRef.current) })
      gsap.from(subSplit.lines, { ...lineRevealVars(), scrollTrigger: selfTrigger(subtitleRef.current) })
      gsap.to(phoneRef.current, { ...blockRevealVars({ stagger: 0 }), scrollTrigger: selfTrigger(phoneRef.current) })
    },
  })

  const activeIndex = baseIndex + centerOffset

  const getTxForIndex = useCallback((idx) => {
    const track = trackRef.current
    const container = containerRef.current
    if (!track || !container) return 0
    const item = track.children[idx]
    if (!item) return 0
    return container.offsetWidth / 2 - (item.offsetLeft + item.offsetWidth / 2)
  }, [])

  const applyTx = useCallback((value, withAnim) => {
    txRef.current = value
    setAnimated(withAnim)
    setTx(value)
  }, [])

  /* Center on mount */
  useEffect(() => {
    requestAnimationFrame(() => {
      applyTx(getTxForIndex(INITIAL.length + centerOffset), false)
    })
  }, [])

  /* Resize handler */
  useEffect(() => {
    const onResize = () => {
      applyTx(getTxForIndex(baseRef.current + centerOffset), false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applyTx, getTxForIndex, centerOffset])

  /* Advance one step */
  const advance = useCallback(() => {
    if (busyRef.current) return
    busyRef.current = true

    const newBase = baseRef.current + 1
    const newActive = newBase + centerOffset

    applyTx(getTxForIndex(newActive), true)
    baseRef.current = newBase
    setBaseIndex(newBase)
  }, [applyTx, getTxForIndex, centerOffset])

  /* On transitionend: check if we need to jump back */
  const onTransitionEnd = useCallback((e) => {
    if (e.target !== trackRef.current || e.propertyName !== 'transform') return
    busyRef.current = false

    if (baseRef.current >= 2 * INITIAL.length) {
      const newBase = baseRef.current - INITIAL.length
      baseRef.current = newBase
      setSnapping(true)
      setBaseIndex(newBase)
      applyTx(getTxForIndex(newBase + centerOffset), false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSnapping(false))
      })
    }
  }, [applyTx, getTxForIndex, centerOffset])

  /* Auto-advance interval */
  useEffect(() => {
    const id = setInterval(advance, INTERVAL)
    return () => clearInterval(id)
  }, [advance])

  return (
    <section className="one-platform" id="one-platform" ref={sectionRef}>
      <div className="container one-platform-inner">
        <div className="platform-text">
          <h2 className="section-title" ref={titleRef}>One platform.<br />All coverage.</h2>
          <p className="platform-subtitle" ref={subtitleRef}>Supporting the coverage types brokers and providers work with every day.</p>
        </div>
        <div className="platform-phone" ref={phoneRef}>
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
          className={`carousel-track${snapping ? ' carousel-track--snap' : ''}`}
          ref={trackRef}
          onTransitionEnd={onTransitionEnd}
          style={{
            transform: `translateX(${tx}px)`,
            transition: animated
              ? `transform ${DURATION}ms cubic-bezier(0.16,1,0.3,1)`
              : 'none',
          }}
        >
          {items.map((item, i) => {
            const dist = Math.abs(i - activeIndex)
            return (
              <span
                key={`${item}-${i}`}
                className={`carousel-item${i === activeIndex ? ' carousel-item--active' : ''}`}
                style={{ opacity: Math.max(0.15, 1 - dist * 0.25) }}
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
