import { useEffect, useRef, useState } from 'react'
import { useBookingModal } from '../context/BookingModalContext'
import styles from './BookingModal.module.css'

function todayISO() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
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
            <p className="eyebrow">заявка отправлена</p>
            <h2 className={styles.title}>Спасибо!</h2>
            <p className={styles.lead}>
              Мы позвоним вам, чтобы подтвердить стол на выбранную дату.
            </p>
            <button type="button" className={styles.submit} onClick={close}>
              Закрыть
            </button>
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
                <input
                  type="text"
                  className={styles.input}
                  name="name"
                  placeholder="Как к вам обращаться"
                  autoComplete="name"
                  required
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Телефон</span>
                <input
                  type="tel"
                  className={styles.input}
                  name="phone"
                  placeholder="+7 900 000-00-00"
                  autoComplete="tel"
                  required
                />
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

              <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Отправляем…' : 'Отправить заявку'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
