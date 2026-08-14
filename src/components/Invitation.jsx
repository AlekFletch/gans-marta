import { useRef, useState } from 'react'
import { site, contacts, place } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { Booking, Quiet } from './Button'
import styles from './Invitation.module.css'

// Бегущая строка — только реальные факты, взятые из content.js,
// а не выдуманные лозунги.
const tickerItems = [
  'Немецкая кухня',
  'Пиво собственной варки',
  place.metro,
  `Ежедневно ${site.hours[0].time}`,
]

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Финальный акцент страницы: приглашение, а не ещё один блок с контактами
   (те остаются в Footer). Оранжевое свечение — только в hero, здесь
   его нет: один акцентный жест на весь сайт, а не по копии на секцию. */
export default function Invitation() {
  const [ref, visible] = useReveal()
  const magnetRef = useRef(null)
  const [pull, setPull] = useState({ x: 0, y: 0 })

  const handleMove = (e) => {
    if (reducedMotion) return
    const el = magnetRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const max = 10
    setPull({
      x: Math.max(-max, Math.min(max, dx * 0.25)),
      y: Math.max(-max, Math.min(max, dy * 0.25)),
    })
  }

  const resetPull = () => setPull({ x: 0, y: 0 })

  return (
    <section className={`${styles.section} shell`} id="invitation">
      <span className={styles.mark} aria-hidden="true">
        {site.name}
      </span>

      <div ref={ref} data-visible={visible} className={`${styles.content} reveal-up`}>
        <p className="eyebrow">приглашение</p>
        <h2 className={styles.heading}>Ждём вас за столом.</h2>

        <div className={styles.ticker}>
          <div className={styles.tickerTrack} aria-hidden="true">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span className={styles.tickerItem} key={i}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <div
            ref={magnetRef}
            className={styles.magnet}
            style={{ '--pull-x': `${pull.x}px`, '--pull-y': `${pull.y}px` }}
            onMouseMove={handleMove}
            onMouseLeave={resetPull}
          >
            <Booking href={contacts.booking}>Забронировать стол</Booking>
          </div>
          <Quiet href={contacts.phones[0].href}>{contacts.phones[0].label}</Quiet>
        </div>
      </div>
    </section>
  )
}
