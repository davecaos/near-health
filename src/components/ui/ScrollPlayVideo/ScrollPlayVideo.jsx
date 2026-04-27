import { useEffect, useRef } from 'react'
import { asset } from '../../../utils/assetPath'

const MOBILE_MEDIA = '(max-width: 767px)'
const DESKTOP_MEDIA = '(min-width: 768px)'

const isMobileViewport = () =>
  typeof window !== 'undefined' && window.matchMedia(MOBILE_MEDIA).matches

/**
 * Video that loads/plays only when scrolled into view.
 * Source is picked at load time via native <source media>.
 * Poster is picked once at mount (no resize reactivity).
 *
 * Retains stalled/suspend/visibilitychange handlers as defensive iOS Safari
 * workarounds — see plan Risk 2 before removing.
 */
export default function ScrollPlayVideo({
  desktop, mobile, desktopWebm, mobileWebm,
  desktopPoster, mobilePoster, className = '',
}) {
  const videoRef = useRef(null)
  const poster = isMobileViewport() ? mobilePoster : desktopPoster

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let visible = false
    const tryPlay = () => {
      if (visible && video.paused) video.play().catch(() => {})
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) tryPlay()
        else video.pause()
      },
      { threshold: 0.1 }
    )

    const onVisibilityChange = () => {
      if (!document.hidden && visible) tryPlay()
    }

    let stalledTimer = null
    const onStalled = () => {
      clearTimeout(stalledTimer)
      stalledTimer = setTimeout(tryPlay, 300)
    }

    video.addEventListener('stalled', onStalled)
    video.addEventListener('suspend', onStalled)
    document.addEventListener('visibilitychange', onVisibilityChange)
    observer.observe(video)

    return () => {
      clearTimeout(stalledTimer)
      video.removeEventListener('stalled', onStalled)
      video.removeEventListener('suspend', onStalled)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer.disconnect()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="auto"
      poster={poster ? asset(poster) : undefined}
      className={className}
    >
      {mobileWebm  && <source src={asset(mobileWebm)}  type="video/webm" media={MOBILE_MEDIA} />}
      {mobile      && <source src={asset(mobile)}      type="video/mp4"  media={MOBILE_MEDIA} />}
      {desktopWebm && <source src={asset(desktopWebm)} type="video/webm" media={DESKTOP_MEDIA} />}
      {desktop     && <source src={asset(desktop)}     type="video/mp4"  media={DESKTOP_MEDIA} />}
    </video>
  )
}
