import useIsMobile from '../../hooks/useIsMobile'

const TRIPLED = [
  'Agents', 'Agencies', 'FMOs', 'GAs', 'Clinics', 'Groups', 'MSOs',
  'Agents', 'Agencies', 'FMOs', 'GAs', 'Clinics', 'Groups', 'MSOs',
  'Agents', 'Agencies', 'FMOs', 'GAs', 'Clinics', 'Groups', 'MSOs',
]

export default function BuiltForCarousel() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="hero-mobile-built-for">
        <span className="built-for-label-mobile">Built for</span>
        <div className="built-for-line-v"></div>
        <div className="built-for-h-viewport">
          <div className="built-for-h-track">
            {TRIPLED.map((item, i) => (
              <span className="built-for-h-item" key={i}>{item}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero-built-for">
      <span className="built-for-label">Built for</span>
      <div className="built-for-divider"></div>
      <div className="built-for-viewport">
        <div className="built-for-track">
          {TRIPLED.map((item, i) => (
            <div className="built-for-item" key={i}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
