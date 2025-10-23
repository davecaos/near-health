import { useFadeIn } from '../../hooks/useScrollAnimation'
import { asset } from '../../utils/assetPath'
import './RealWorld.css'

const features = [
  { title: 'HIPAA-compliant', desc: <>Secure, compliant infrastructure<br />with complete audit trails.</>,
    icon: <img src={asset('assets/images/hippa-compliant-icon.svg')} alt="" width="19" height="26" /> },
  { title: 'Role-based access', desc: 'Structured permissions across members, brokers, and providers.',
    icon: <img src={asset('assets/images/role-access.svg')} alt="" width="20" height="20" /> },
  { title: 'Deep integrations', desc: <>Scheduling, enrollment, and<br />plan data - fully connected.</>,
    icon: <img src={asset('assets/images/deep-integration.svg')} alt="" width="22" height="22" /> },
  { title: 'Multi-tenant ready', desc: 'Supports branded experiences across agencies and provider networks.',
    icon: <img src={asset('assets/images/Multi-tenant ready-icon.svg')} alt="" width="22" height="22" /> },
]

export default function RealWorld() {
  const fade = useFadeIn()

  return (
    <section className="real-world" id="real-world" ref={fade.ref}>
      <div className={`container ${fade.className}`}>
        <h2 className="section-title" style={{ transitionDelay: '0s' }}>
          <span className="desktop-only">Built for real-world operations</span>
          <span className="mobile-only">Shaped by<br />real-world use</span>
        </h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
