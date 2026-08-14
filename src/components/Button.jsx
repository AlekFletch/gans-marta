import { useCallback, useRef, useState } from 'react'
import { useBookingModal } from '../context/BookingModalContext'
import styles from './Button.module.css'

// Диаметр круга, гарантированно перекрывающего кнопку из любой точки
// origin — по максимальному расстоянию до четырёх углов.
function coverDiameter(width, height, x, y) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y),
      ),
  )
}

export function Booking({ href, children, compact = false }) {
  const nodeRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState(0)
  const { open } = useBookingModal()

  const setOriginFrom = useCallback((x, y) => {
    const el = nodeRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setOrigin({ x, y })
    setSize(coverDiameter(r.width, r.height, x, y))
  }, [])

  const fromPointer = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setOriginFrom(e.clientX - r.left, e.clientY - r.top)
  }

  const fromCenter = () => {
    const el = nodeRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setOriginFrom(r.width / 2, r.height / 2)
  }

  const showFill = hovered || pressed

  return (
    <a
      ref={nodeRef}
      className={compact ? `${styles.primary} ${styles.compact}` : styles.primary}
      href={href}
      data-fill={showFill ? 'true' : 'false'}
      onClick={(e) => {
        e.preventDefault()
        open()
      }}
      onPointerEnter={(e) => {
        fromPointer(e)
        setHovered(true)
      }}
      onPointerLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onPointerDown={(e) => {
        if (e.button !== 0) return
        fromPointer(e)
        setPressed(true)
      }}
      onPointerUp={() => setPressed(false)}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) {
          fromCenter()
          setHovered(true)
        }
      }}
      onBlur={() => {
        setHovered(false)
        setPressed(false)
      }}
    >
      {/* Круг растёт из точки входа курсора/фокуса — не мигает цветом,
          а буквально заливает кнопку изнутри. Размер и позиция — через
          инлайн-стиль, потому что считаются на лету из origin/size. */}
      <span
        className={styles.fill}
        aria-hidden="true"
        style={{ left: origin.x, top: origin.y, width: size, height: size }}
      />
      <span className={styles.label}>
        {children}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </span>
    </a>
  )
}

export function Quiet({ href, children, ...rest }) {
  return (
    <a className={styles.quiet} href={href} {...rest}>
      {children}
    </a>
  )
}
