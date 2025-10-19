import React from 'react'
import { useFadeIn } from '../../hooks/useScrollAnimation'
import useIsMobile from '../../hooks/useIsMobile'
import { asset } from '../../utils/assetPath'
import './PostEnrollment.css'

const features = [
  {
    icon: <img src={asset('assets/images/where-actually-begins-icon.svg')} alt="" width="20" height="20" />,
    title: 'Where care actually begins',
    desc: 'The moment where coverage turns into real needs.',
  },
  {
    icon: <img src={asset('assets/images/AI that moves care forward-icon.svg')} alt="" width="20" height="20" />,
    title: 'AI that moves care forward',
    desc: 'Resolves requests and turns intent into action.',
  },
  {
    icon: <img src={asset('assets/images/One connected flow-icon.svg')} alt="" width="20" height="20" />,
    title: 'One connected flow',
    desc: 'Members, brokers, and providers move in sync.',
  },
  {
    icon: <img src={asset('assets/images/Built to scale across networks.svg')} alt="" width="20" height="20" />,
    title: 'Built to scale across networks',
    desc: 'From individual teams to full ecosystems.',
  },
  {
    icon: <img src={asset('assets/images/integration-ready.svg')} alt="" width="20" height="20" />,
    title: 'Integration-ready',
    desc: 'Fits seamlessly into existing broker and provider workflows.',
  },
]

export default function PostEnrollment() {
  const fade = useFadeIn()
  const isMobile = useIsMobile()

  return (
    <section className="post-enrollment" id="why-near" ref={fade.ref}>
      <div className={`container ${fade.className}`}>
        <h2 className="section-title" style={{ transitionDelay: '0s' }}>Designed for the<br />post-enrollment reality</h2>
        {isMobile ? (
          <div className="post-list">
            {features.map((f, i) => (
              <div className="post-list-item" key={i} style={{ transitionDelay: `${0.08 + i * 0.08}s` }}>
                <div className="post-list-header">
                  <div className="post-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                </div>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="post-grid">
              {features.slice(0, 3).map((f, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="post-divider-v"></div>}
                  <div className="post-col" style={{ transitionDelay: `${0.1 + i * 0.1}s` }}>
                    <div className="post-icon">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="post-grid post-grid-bottom">
              {features.slice(3).map((f, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="post-divider-v"></div>}
                  <div className="post-col" style={{ transitionDelay: `${0.3 + i * 0.1}s` }}>
                    <div className="post-icon">{f.icon}</div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </React.Fragment>
              ))}
              <div className="post-divider-v post-divider-hidden"></div>
              <div className="post-col post-col-hidden"></div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
