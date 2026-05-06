import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NearBrand from '../ui/NearBrand/NearBrand'
import './Footer.css'

export default function Footer() {
  const footerRef = useRef(null)
  const brandRef = useRef(null)
  const gradientRef = useRef(null)

  useEffect(() => {
    const footer = footerRef.current
    const brand = brandRef.current
    const gradient = gradientRef.current
    if (!footer || !brand || !gradient) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      gsap.set([brand, gradient], { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(brand, { opacity: 0, y: 90 })
      gsap.set(gradient, { opacity: 0 })

      gsap.to(brand, {
        opacity: 1,
        y: 0,
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: footer, start: 'top 95%', once: true },
      })

      gsap.to(gradient, {
        opacity: 1,
        duration: 2.2,
        ease: 'power2.out',
        scrollTrigger: { trigger: footer, start: 'top bottom', once: true },
      })
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer" ref={footerRef}>
      <div className="footer-gradient" ref={gradientRef} aria-hidden="true" />
      <div className="container">
        <NearBrand size="lg" className="footer-brand" ref={brandRef} />
        <span className="footer-item footer-copyright">&copy; Near Health LLC. 2026</span>
        <a href="mailto:hello@near.health" className="footer-item footer-email">hello@near.health</a>
        <a href="#" className="footer-item footer-terms">Terms</a>
        <a href="#" className="footer-item footer-privacy">Privacy</a>
        <div className="footer-socials">
          <a href="#" className="social-icon" aria-label="LinkedIn">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 5v7M3.5 2a1 1 0 100 2 1 1 0 000-2zM7 5v7m0-4.5c0-1.5 1-2.5 2.5-2.5S12 6 12 7.5V12" stroke="#0A1C1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="#" className="social-icon" aria-label="X">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l5.5 6L1 13M13 1L7.5 7 13 13" stroke="#0A1C1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
          <a href="#" className="social-icon" aria-label="Facebook">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10 1H8a3 3 0 00-3 3v2H3v3h2v5h3V9h2l1-3H8V4a1 1 0 011-1h1V1z" stroke="#0A1C1E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
