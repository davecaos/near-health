import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useIsMobile from '../../hooks/useIsMobile'
import ResponsiveVideo from '../ui/ResponsiveVideo/ResponsiveVideo'
import BuiltForCarousel from './BuiltForCarousel'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const isMobile = useIsMobile()
  const bottomRowRef = useRef(null)
  const cardRef = useRef(null)
  const headingRef = useRef(null)
  const carouselWrapRef = useRef(null)
  const leftRef = useRef(null)

  useEffect(() => {
    if (isMobile) return
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Skip the scrub on tablet width: layout collapses to a column at <=1024px
    if (window.innerWidth <= 1024) return

    const row = bottomRowRef.current
    const card = cardRef.current
    if (!row || !card) return

    const targets = { dx: 0, dy: 0, scale: 1 }
    const fadeTargets = [headingRef.current, carouselWrapRef.current, leftRef.current].filter(Boolean)

    const ctx = gsap.context(() => {
      // Card expands from natural size → full-width (with site gutters) and
      // holds at full size for the rest of the scroll-zone.
      // Border-radius is intentionally NOT animated — transform: scale()
      // visually scales the corners proportionally with the card.
      gsap.to(card, {
        x: () => targets.dx,
        y: () => targets.dy,
        scale: () => targets.scale,
        ease: 'none',
        scrollTrigger: {
          trigger: row,
          start: 'top top',
          end: () => '+=' + window.innerHeight * 0.7,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            // Read the card's natural geometry (un-stuck, no transform).
            // PAD_X mirrors the site's --px horizontal padding so the
            // expanded card stops at the same gutters as the rest of the page.
            // dy stays 0: with transform-origin 50% 0% (top center), the
            // card grows only downward + sideways from its sticky top.
            const vw = window.innerWidth
            const padX = Math.max(20, Math.min(80, 0.05 * vw)) // clamp(20px, 5vw, 80px)
            gsap.set(card, { clearProps: 'transform' })
            const r = card.getBoundingClientRect()
            targets.dx = vw / 2 - (r.left + r.width / 2)
            targets.dy = 0
            targets.scale = (vw - 2 * padX) / r.width
          },
        },
      })

      if (fadeTargets.length) {
        gsap.to(fadeTargets, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: row,
            start: 'top top',
            end: () => '+=' + window.innerHeight * 0.5,
            scrub: 0.6,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [isMobile])

  return (
    <div className="hero-outer">
    <section className="hero" id="hero">
      <div className="container hero-container">
        {isMobile ? (
          /* ── Mobile layout ── */
          <>
            <div className="hero-mobile-top">
              <h1 className="hero-heading hero-heading--mobile">Turning<br />coverage<br />into care</h1>
              <p className="hero-subtitle hero-subtitle--mobile">Where everything connects –<br />and care actually moves.</p>
              <div className="hero-buttons hero-buttons--mobile">
                <a href="#contact" className="btn btn--primary">Request a demo</a>
                <a href="#contact" className="btn btn--secondary">Talk to us</a>
              </div>
            </div>
            <BuiltForCarousel />
            <div className="hero-mobile-video">
              <ResponsiveVideo desktop="assets/Hero_Desktop.mp4" mobile="assets/Hero_Mobile.mp4" desktopWebm="assets/Hero_Desktop.webm" mobileWebm="assets/Hero_Mobile.webm" />
            </div>
          </>
        ) : (
          /* ── Desktop layout ── */
          <>
            <div className="hero-top-row">
              <h1 ref={headingRef} className="hero-heading">Turning<br />coverage<br />into care</h1>
              <div ref={carouselWrapRef} className="hero-carousel-wrap">
                <BuiltForCarousel />
              </div>
            </div>
            <div ref={bottomRowRef} className="hero-bottom-row">
              <div ref={leftRef} className="hero-left">
                <p className="hero-subtitle">Near coordinates care after enrolment without adding operational burden.</p>
                <div className="hero-buttons">
                  <a href="#contact" className="btn btn--primary">Request a demo</a>
                  <a href="#contact" className="btn btn--secondary">Talk to us</a>
                </div>
              </div>
              <div ref={cardRef} className="hero-video-card">
                <ResponsiveVideo desktop="assets/Hero_Desktop.mp4" mobile="assets/Hero_Mobile.mp4" desktopWebm="assets/Hero_Desktop.webm" mobileWebm="assets/Hero_Mobile.webm" />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
    </div>
  )
}
