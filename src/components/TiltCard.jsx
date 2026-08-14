import { useRef, useState } from 'react'
import styles from './TiltCard.module.css'

/* Интерактивная карточка: лёгкий 3D-наклон, блик и параллакс снимка
   следуют за курсором. Пока файла снимка нет (или он не загрузился) —
   показывает декоративную подложку с монограммой, чтобы страница
   никогда не выглядела сломанной. */
export default function TiltCard({
  monogram,
  caption,
  src,
  alt,
  position = 'center',
  loading = 'lazy',
  className = '',
  delay = 0,
}) {
  const cardRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const hasPhoto = Boolean(src) && !failed

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const handleMove = (e) => {
    if (reducedMotion) return
    const card = cardRef.current
    if (!card) return
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    card.style.setProperty('--rx', `${(py - 0.5) * -9}deg`)
    card.style.setProperty('--ry', `${(px - 0.5) * 9}deg`)
    card.style.setProperty('--tx', `${(px - 0.5) * -16}px`)
    card.style.setProperty('--ty', `${(py - 0.5) * -16}px`)
    card.style.setProperty('--px', `${px * 100}%`)
    card.style.setProperty('--py', `${py * 100}%`)
    card.dataset.active = 'true'
  }

  const reset = () => {
    const card = cardRef.current
    if (!card) return
    card.dataset.active = 'false'
    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
    card.style.setProperty('--tx', '0px')
    card.style.setProperty('--ty', '0px')
  }

  return (
    <div className={`${styles.wrap} ${className}`}>
      <div
        ref={cardRef}
        className={styles.card}
        data-active="false"
        data-photo={hasPhoto ? 'true' : 'false'}
        style={{ '--drift-delay': `${delay}s` }}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onFocus={() => {
          if (cardRef.current) cardRef.current.dataset.active = 'true'
        }}
        onBlur={reset}
        tabIndex={0}
      >
        {hasPhoto ? (
          <img
            className={styles.image}
            src={src}
            alt={alt}
            loading={loading}
            // React 18 знает только нижний регистр этого атрибута
            // (camelCase fetchPriority появился лишь в React 19).
            fetchpriority={loading === 'eager' ? 'high' : undefined}
            style={{ objectPosition: position }}
            onError={() => setFailed(true)}
          />
        ) : (
          monogram && (
            <span className={styles.monogram} aria-hidden="true">
              {monogram}
            </span>
          )
        )}

        <span className={styles.sheen} aria-hidden="true" />

        {caption && (
          <>
            {/* Затемнение снизу: подпись обязана читаться поверх светлого
                кадра, а контраст на фотографии нельзя посчитать заранее. */}
            {hasPhoto && <span className={styles.scrim} aria-hidden="true" />}
            <span className={`${styles.caption} eyebrow`}>{caption}</span>
          </>
        )}
      </div>
    </div>
  )
}
