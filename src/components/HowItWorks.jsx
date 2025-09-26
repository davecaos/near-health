import { useEffect, useRef, useState } from 'react'
import { useFadeIn } from '../hooks/useScrollAnimation'
import useIsMobile from '../hooks/useIsMobile'
import { asset } from '../utils/assetPath'

const steps = [
  { title: 'Capture what matters', desc: 'Every request starts with real intent.', num: '01' },
  { title: 'Guide it forward', desc: 'Turning intent into clear next steps.', num: '02' },
  { title: 'Align everyone', desc: 'Members, brokers, and providers stay in sync.', num: '03' },
]

/* κ controls curve squareness: 0.55 = ellipse, 1.0 = right angle.
   0.92 gives a squared L-shape with a smooth rounded corner. */
const K = 0.92

function CenterIcon({ delay = 0 }) {
  return (
    <div className="how-center-icon" style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      <div className="how-circle">
        <img src={asset('assets/icons/near-logo-coloured.svg')} alt="" className="how-circle-logo" />
      </div>
    </div>
  )
}

function StepCard({ title, desc, num, delay = 0 }) {
  return (
    <div className="how-step-card" style={delay ? { transitionDelay: `${delay}s` } : undefined}>
      <div className="how-step-top">
        <h3>{title}</h3>
        <span className="how-num">{num}</span>
      </div>
      <p>{desc}</p>
    </div>
  )
}

export default function HowItWorks() {
  const fade = useFadeIn()
  const isMobile = useIsMobile()
  const layoutRef = useRef(null)
  const [svg, setSvg] = useState(null)

  useEffect(() => {
    if (isMobile) { setSvg(null); return }

    /* Walk offsetParent chain to get layout position relative to ancestor
       — immune to CSS transforms (scroll-reveal translateY) */
    const offsetTo = (node, ancestor) => {
      let top = 0, left = 0
      let el = node
      while (el && el !== ancestor) {
        top += el.offsetTop
        left += el.offsetLeft
        el = el.offsetParent
      }
      return { top, left }
    }

    const compute = () => {
      const el = layoutRef.current
      if (!el) return

      const topCards = el.querySelectorAll('.how-steps-row .how-step-card')
      const card2 = el.querySelector('.how-step-center-row .how-step-card')
      if (!topCards[0] || !topCards[1] || !card2) return

      const p1 = offsetTo(topCards[0], el)
      const p2 = offsetTo(card2, el)
      const p3 = offsetTo(topCards[1], el)

      // Anchor points (layout positions, no transform offset)
      const x1 = p1.left + topCards[0].offsetWidth / 2   // Card 1 bottom center
      const y1 = p1.top + topCards[0].offsetHeight
      const x2l = p2.left                                 // Card 2 left middle
      const y2 = p2.top + card2.offsetHeight / 2
      const x2r = p2.left + card2.offsetWidth              // Card 2 right middle
      const x3 = p3.left + topCards[1].offsetWidth / 2     // Card 3 bottom center
      const y3 = p3.top + topCards[1].offsetHeight

      // Path 1: Card 1 bottom-center → Card 2 left-middle
      // Start tangent: vertical ↓   End tangent: horizontal → (arriving from left)
      const dy1 = y2 - y1
      const dx1 = x2l - x1
      const d1 = [
        `M ${x1} ${y1}`,
        `C ${x1} ${y1 + K * dy1},`,
        `${x2l - K * dx1} ${y2},`,
        `${x2l} ${y2}`,
      ].join(' ')

      // Path 2: Card 2 right-middle → Card 3 bottom-center
      // Start tangent: horizontal →   End tangent: vertical ↑
      const dx2 = x3 - x2r
      const dy2 = y2 - y3
      const d2 = [
        `M ${x2r} ${y2}`,
        `C ${x2r + K * dx2} ${y2},`,
        `${x3} ${y3 + K * dy2},`,
        `${x3} ${y3}`,
      ].join(' ')

      setSvg({ w: el.scrollWidth, h: el.scrollHeight, d1, d2 })
    }

    requestAnimationFrame(() => requestAnimationFrame(compute))
    window.addEventListener('resize', compute)
    return () => window.removeEventListener('resize', compute)
  }, [isMobile])

  return (
    <section className="how-it-works" id="how-it-works" ref={fade.ref}>
      <div className={`container ${fade.className}`}>
        <div className="how-header">
          <span className="how-label">How it works</span>
          <h2 className="section-title">From policy to care,<br />in a few steps</h2>
          <p className="how-desc">Near activates coverage by coordinating brokers, providers, and patients inside one structured system.</p>
        </div>

        {isMobile ? (
          /* Mobile: center icon + vertical timeline */
          <>
            <CenterIcon delay={0.1} />
            <div className="how-steps-row">
              {steps.map((s, i) => (
                <StepCard key={s.num} {...s} delay={0.15 + i * 0.1} />
              ))}
            </div>
          </>
        ) : (
          /* Desktop: two Hermite-interpolated curves connecting cards */
          <div className="how-layout" ref={layoutRef}>
            <div className="how-steps-row">
              <StepCard {...steps[0]} delay={0.1} />
              <CenterIcon delay={0.2} />
              <StepCard {...steps[2]} delay={0.3} />
            </div>
            <div className="how-step-center-row">
              <StepCard {...steps[1]} delay={0.4} />
            </div>
            {svg && (
              <svg
                className="how-curves"
                width={svg.w}
                height={svg.h}
                viewBox={`0 0 ${svg.w} ${svg.h}`}
                fill="none"
                style={{ transitionDelay: '0.15s' }}
              >
                <path d={svg.d1} stroke="#0A1C1E" strokeWidth="1.5" />
                <path d={svg.d2} stroke="#0A1C1E" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
