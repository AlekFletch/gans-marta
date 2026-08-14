import { useState } from 'react'
import { menu } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import styles from './Menu.module.css'

/* Каждая группа сама следит за появлением во вьюпорте: позиции внутри
   отвечают лёгким каскадом, а не всплывают все разом. */
function MenuGroup({ group }) {
  const [ref, visible] = useReveal()

  return (
    <div ref={ref} data-visible={visible} className={styles.group}>
      <div className={styles.groupHead}>
        <h3 className={styles.groupTitle}>{group.title}</h3>
        <p className={styles.groupHint}>{group.hint}</p>
      </div>

      <ul>
        {group.items.map((item, i) => (
          <MenuItem item={item} index={i} key={item.name} />
        ))}
      </ul>
    </div>
  )
}

/* Блюда без описания остаются статичной строкой: раскрывать нечего.
   Блюда с описанием — дисклоужер: стрелка вниз, по клику на строку
   или на саму стрелку раскрывается состав. */
function MenuItem({ item, index }) {
  const [open, setOpen] = useState(false)

  const row = (
    <>
      <h4 className={styles.itemName}>
        {item.name}
        {item.mark && <span className={styles.mark}>{item.mark}</span>}
      </h4>
      <span className={`${styles.itemPrice} num`}>{item.price}</span>
    </>
  )

  if (!item.desc) {
    return (
      <li className={styles.item} style={{ '--i': index }}>
        <div className={styles.row}>{row}</div>
      </li>
    )
  }

  return (
    <li className={styles.item} style={{ '--i': index }}>
      <button
        type="button"
        className={styles.row}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {row}
        <svg
          className={styles.chevron}
          data-open={open}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          aria-hidden="true"
        >
          <path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
      <div className={styles.descPanel} data-open={open}>
        <div className={styles.descInner}>
          <p className={styles.itemDesc}>{item.desc}</p>
        </div>
      </div>
    </li>
  )
}

export default function Menu() {
  const [headRef, headVisible] = useReveal()

  return (
    <section className={`${styles.section} shell`} id="menu">
      <div ref={headRef} data-visible={headVisible} className={`${styles.head} reveal-up`}>
        <div>
          <p className="eyebrow">сезонная карта</p>
          <h2 className={styles.title}>Меню</h2>
        </div>
        <p className={styles.stamp}>
          Цены указаны в рублях. Обслуживание включено в стоимость. Карта обновляется
          с началом каждого сезона.
        </p>
      </div>

      {menu.map((group) => (
        <MenuGroup key={group.id} group={group} />
      ))}
    </section>
  )
}
