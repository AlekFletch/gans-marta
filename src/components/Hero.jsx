import { useRef } from 'react'
import { site, contacts } from '../data/content'
import { Booking } from './Button'
import TiltCard from './TiltCard'
import styles from './Hero.module.css'

export default function Hero() {
  const heroRef = useRef(null)

  // Тёплое пятно ходит за курсором с лёгким запаздыванием — только
  // в hero, больше нигде на сайте акцент не становится оранжевым.
  const handleMove = (e) => {
    const el = heroRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section className={`${styles.hero} shell`} id="top" ref={heroRef} onMouseMove={handleMove}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`${styles.left} ${styles.reveal}`}>
        <p className="eyebrow">{site.eyebrow}</p>
        <h1 className={styles.word}>{site.name}</h1>
        <p className={styles.tagline}>{site.tagline}</p>
        <hr className={styles.rule} />
        <p className={styles.lead}>{site.lead}</p>
        <Booking href={contacts.booking}>Забронировать стол</Booking>
      </div>

      {/* .plate задаёт пропорции снаружи — TiltCard просто заполняет его
          на 100%, как и в Interior.jsx. Кадр первого экрана грузится
          сразу (eager): он виден без прокрутки. */}
      <figure className={styles.plate}>
        <TiltCard
          monogram="ГМ"
          src={site.heroShot.src}
          alt={site.heroShot.alt}
          position={site.heroShot.position}
          loading="eager"
        />
      </figure>
    </section>
  )
}
