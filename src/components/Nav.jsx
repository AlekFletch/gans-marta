import { useEffect, useState } from 'react'
import { nav, site, contacts } from '../data/content'
import { Booking } from './Button'
import styles from './Nav.module.css'

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Пока меню открыто: страница не скроллит под ним, Esc закрывает.
  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  // Разворот в десктоп-ширину при открытом меню (поворот планшета
  // и т.п.) — панель не должна зависать открытой поверх десктоп-нава.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 680) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  // Подсвечивает пункт меню той секции, что сейчас пересекает
  // горизонтальную полосу по центру экрана — стандартный scroll-spy.
  useEffect(() => {
    const sections = nav
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <header className={`${styles.nav} ${solid ? styles.solid : ''} shell`}>
      <a className={styles.mark} href="#top" onClick={closeMenu}>
        {site.name}
      </a>
      <div className={styles.right}>
        <nav className={styles.links}>
          {nav.map((item) => (
            <a
              className={`${styles.link} ${active === item.href.slice(1) ? styles.linkActive : ''}`}
              key={item.href}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <Booking href={contacts.booking} compact>
          Забронировать стол
        </Booking>
        <button
          type="button"
          className={styles.burger}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={styles.burgerLine} data-open={menuOpen} />
          <span className={styles.burgerLine} data-open={menuOpen} />
        </button>
      </div>

      <div className={styles.scrim} data-open={menuOpen} onClick={closeMenu} aria-hidden="true" />

      <nav id="mobile-nav" className={styles.mobilePanel} data-open={menuOpen}>
        {nav.map((item, i) => (
          <a
            className={`${styles.mobileLink} ${active === item.href.slice(1) ? styles.linkActive : ''}`}
            key={item.href}
            href={item.href}
            style={{ '--i': i }}
            onClick={closeMenu}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
