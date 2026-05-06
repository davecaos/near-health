import { useRef } from 'react'
import gsap from 'gsap'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { splitLines, lineRevealVars, selfTrigger } from '../../utils/reveal'
import { asset } from '../../utils/assetPath'
import './ShapedSection.css'

export default function ShapedSection() {
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const badgeRef = useRef(null)

  useScrollReveal({
    scopeRef: sectionRef,
    prepare: () => {
      const targets = [badgeRef.current, textRef.current, titleRef.current]
      gsap.set(targets, { autoAlpha: 0 })
      return targets
    },
    animate: () => {
      const targets = [badgeRef.current, textRef.current, titleRef.current]
      const splits = targets.map((el) => splitLines(el))
      gsap.set(targets, { autoAlpha: 1 })

      targets.forEach((el, i) => {
        gsap.from(splits[i].lines, { ...lineRevealVars(), scrollTrigger: selfTrigger(el) })
      })
    },
  })

  return (
    <section className="shaped-section" id="shaped" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title" ref={titleRef}>Shaped by real-world use</h2>
        <div className="shaped-photo" ref={cardRef}>
          <picture>
            <source srcSet={asset('assets/images/shaped-real-world.webp')} type="image/webp" />
            <img
              src={asset('assets/images/shaped-real-world.png')}
              alt="Real-world healthcare"
              loading="lazy"
            />
          </picture>
          <div className="shaped-overlay">
            <p className="shaped-overlay-text" ref={textRef}>
              From intake and scheduling to claims and follow-ups, every part reflects real operational needs – not assumptions. This isn&rsquo;t a top-down product. It&rsquo;s built from how care actually moves. Because the best systems aren&rsquo;t imagined. They&rsquo;re shaped by the people who rely on them.
            </p>
            <div className="shaped-overlay-badge">
              <img src={asset('assets/icons/near-logo.svg')} alt="" className="shaped-badge-icon" />
              <span ref={badgeRef}>Designed alongside the people who<br />handle these workflows every day.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
