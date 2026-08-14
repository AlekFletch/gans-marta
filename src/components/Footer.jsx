import { contacts, site } from '../data/content'
import { Quiet } from './Button'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={`${styles.footer} shell`}>
      <div className={styles.grid}>
        <div className={styles.col}>
          <p className="eyebrow">бронирование</p>
          {contacts.phones.map((p) => (
            <a className={`${styles.phone} num`} href={p.href} key={p.href}>
              {p.label}
            </a>
          ))}
          <Quiet href={`mailto:${contacts.email}`}>{contacts.email}</Quiet>
        </div>

        <div className={styles.col}>
          <p className="eyebrow">часы работы</p>
          <dl className={`${styles.hours} num`}>
            {site.hours.map((h) => (
              <div key={h.days} style={{ display: 'contents' }}>
                <dt>{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.col}>
          <p className="eyebrow">мы в сети</p>
          {contacts.social.map((s) => (
            <Quiet key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </Quiet>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.mark} aria-hidden="true">
          {site.name}
        </span>
        <span className={styles.legal}>{contacts.legal}</span>
      </div>
    </footer>
  )
}
