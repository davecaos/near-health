import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { splitLines, lineRevealVars, blockRevealVars, blockRevealFromVars, selfTrigger } from '../../utils/reveal'
import useIsMobile from '../../hooks/useIsMobile'
import { asset } from '../../utils/assetPath'
import './OnePlatform.css'

const INITIAL = ['Vision', 'Dental', 'Medicare', 'ACA', 'Employer-sponsored']
const COPIES = 4
const items = Array.from({ length: COPIES }, () => INITIAL).flat()

// px per second — slow enough that the eye can read each label as it passes.
const SPEED = 70

export default function OnePlatform() {
  const isMobile = useIsMobile()

  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const phoneRef = useRef(null)
  const trackRef = useRef(null)
  const containerRef = useRef(null)

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

  /* Continuous horizontal flow.
     - tx decreases linearly each frame at SPEED px/s
     - when tx crosses one INITIAL-set-width, snap it back so loops are seamless
     - per-frame: each item's distance from container center drives both opacity
       (gentle, wide falloff) and a --t custom prop (sharp falloff, drives color
        via color-mix in CSS) so the active label crisply reads as solid */
  useEffect(() => {
    if (typeof window === 'undefined') return
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const els = Array.from(track.children)
    let centers = []
    let setWidth = 0
    let spacing = 0
    let containerCenter = 0
    let baseTx = 0

    const measure = () => {
      centers = els.map((el) => el.offsetLeft + el.offsetWidth / 2)
      setWidth = centers[INITIAL.length] - centers[0]
      // Average gap between adjacent item centres — used to scale the
      // active/inactive crossfade so neighbouring items hand off cleanly.
      spacing = setWidth / INITIAL.length
      containerCenter = container.offsetWidth / 2
      const startIdx = INITIAL.length + Math.floor(INITIAL.length / 2)
      baseTx = containerCenter - centers[startIdx]
    }
    measure()

    let tx = baseTx
    let last = 0
    let raf = 0

    const paintItem = (el, i) => {
      const screenX = centers[i] + tx
      const dist = Math.abs(screenX - containerCenter)
      // Plateau-with-smoothstep falloff: the active word stays fully dark for a
      // wide centre band (innerR), then smoothly transitions to white across a
      // short ramp (innerR → outerR), then is white. Both endpoints sit well
      // inside one item-spacing so adjacent items are always white when one is
      // at the centre — the highlight never doubles up — while the active word
      // gets a long dwell at full dark and a soft (not instant) colour change.
      const innerR = spacing * 0.32
      const outerR = spacing * 0.48
      const x = Math.max(0, Math.min(1, (dist - innerR) / (outerR - innerR)))
      const t = x * x * (3 - 2 * x)
      // Opacity has a wider falloff so far-away items still register as context
      // without competing with the active one for attention.
      const fadeT = Math.min(1, dist / (spacing * 2.2))
      el.style.opacity = (1 - fadeT * 0.7).toString()
      el.style.setProperty('--t', t.toString())
    }

    const tick = (time) => {
      if (!last) last = time
      const dt = (time - last) / 1000
      last = time

      tx -= SPEED * dt
      // Keep tx in (baseTx - setWidth, baseTx]; wrapping by setWidth lands the
      // next identical item at center, so the loop is invisible.
      while (setWidth > 0 && tx <= baseTx - setWidth) tx += setWidth

      track.style.transform = `translate3d(${tx}px, 0, 0)`
      els.forEach(paintItem)

      raf = requestAnimationFrame(tick)
    }

    if (reduceMotion) {
      // Static state: fix the start frame so labels still read sensibly.
      track.style.transform = `translate3d(${baseTx}px, 0, 0)`
      els.forEach(paintItem)
      return
    }

    raf = requestAnimationFrame(tick)

    const onResize = () => {
      const prevSet = setWidth
      measure()
      // Keep the visible offset stable across resize: shift tx by the change in baseTx.
      if (prevSet > 0) tx = ((tx - baseTx) % setWidth + setWidth) % setWidth + (baseTx - setWidth)
    }
    window.addEventListener('resize', onResize)

    // Webfonts can shift item widths after first measure; re-measure when they settle.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const prevSet = setWidth
        measure()
        if (prevSet > 0) tx = ((tx - baseTx) % setWidth + setWidth) % setWidth + (baseTx - setWidth)
      })
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

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
        <div className="carousel-track" ref={trackRef}>
          {items.map((item, i) => (
            <span key={`${item}-${i}`} className="carousel-item">{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
