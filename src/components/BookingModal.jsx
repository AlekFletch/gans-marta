import { useEffect, useRef, useState } from 'react'
import { useBookingModal } from '../context/BookingModalContext'
import styles from './BookingModal.module.css'

function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Диаметр круга, гарантированно перекрывающего кнопку из любой точки
// origin — та же техника, что у кнопки «Забронировать» (Button.jsx).
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

// Кнопка с заливкой из точки входа курсора/фокуса — используется и для
// сабмита, и для «Закрыть» на экране успеха, чтобы обе выглядели одинаково.
function FillButton({ className, disabled = false, children, ...rest }) {
  const nodeRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const [size, setSize] = useState(0)

  const setOriginFrom = (x, y) => {
    const el = nodeRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setOrigin({ x, y })
    setSize(coverDiameter(r.width, r.height, x, y))
  }

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

  const showFill = !disabled && (hovered || pressed)

  return (
    <button
      ref={nodeRef}
      className={className}
      data-fill={showFill ? 'true' : 'false'}
      disabled={disabled}
      onPointerEnter={(e) => {
        if (disabled) return
        fromPointer(e)
        setHovered(true)
      }}
      onPointerLeave={() => {
        setHovered(false)
        setPressed(false)
      }}
      onPointerDown={(e) => {
        if (disabled || e.button !== 0) return
        fromPointer(e)
        setPressed(true)
      }}
      onPointerUp={() => setPressed(false)}
      onFocus={(e) => {
        if (disabled) return
        if (e.target.matches(':focus-visible')) {
          fromCenter()
          setHovered(true)
        }
      }}
      onBlur={() => {
        setHovered(false)
        setPressed(false)
      }}
      {...rest}
    >
      <span
        className={styles.submitFill}
        aria-hidden="true"
        style={{ left: origin.x, top: origin.y, width: size, height: size }}
      />
      <span className={styles.submitLabel}>{children}</span>
    </button>
  )
}

// Витринная форма: имя/телефон/дата, «отправка» — заглушка (setTimeout),
// никуда по сети не уходит. Реальную доставку (на почту и т.п.)
// подключим отдельно, когда определимся с сервисом приёма форм.
export default function BookingModal() {
  const { isOpen, close } = useBookingModal()
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | submitting | done

  useEffect(() => {
    if (!isOpen) return
    setStatus('idle')
    triggerRef.current = document.activeElement
    dialogRef.current?.focus()

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus()
    }
  }, [isOpen, close])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('submitting')
    window.setTimeout(() => setStatus('done'), 900)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.scrim} onClick={close} aria-hidden="true" />
      <div
        ref={dialogRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        tabIndex={-1}
      >
        <button type="button" className={styles.close} onClick={close} aria-label="Закрыть">
          <span aria-hidden="true">×</span>
        </button>

        {status === 'done' ? (
          <div className={styles.success}>
            <svg className={styles.successIcon} viewBox="0 0 52 52" aria-hidden="true">
              <circle className={styles.successCircle} cx="26" cy="26" r="24" fill="none" />
              <path className={styles.successCheck} fill="none" d="M15 27l7 7 16-16" />
            </svg>
            <p className="eyebrow">заявка отправлена</p>
            <h2 className={styles.title}>Спасибо!</h2>
            <p className={styles.lead}>
              Мы позвоним вам, чтобы подтвердить стол на выбранную дату.
            </p>
            <FillButton type="button" className={styles.submit} onClick={close}>
              Закрыть
            </FillButton>
          </div>
        ) : (
          <>
            <p className="eyebrow">бронирование</p>
            <h2 id="booking-modal-title" className={styles.title}>
              Забронировать стол
            </h2>
            <p className={styles.lead}>
              Оставьте имя, телефон и дату — мы перезвоним и подтвердим стол.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Имя</span>
                <span className={styles.inputWrap}>
                  <input
                    type="text"
                    className={styles.input}
                    name="name"
                    placeholder="Как к вам обращаться"
                    autoComplete="name"
                    required
                  />
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Телефон</span>
                <span className={styles.inputWrap}>
                  <input
                    type="tel"
                    className={styles.input}
                    name="phone"
                    placeholder="+7 900 000-00-00"
                    autoComplete="tel"
                    required
                  />
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                </span>
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Дата визита</span>
                <input
                  type="date"
                  className={styles.input}
                  name="date"
                  min={todayISO()}
                  defaultValue={todayISO()}
                  required
                />
              </label>

              <FillButton
                type="submit"
                className={styles.submit}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Отправляем…' : 'Отправить заявку'}
              </FillButton>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
