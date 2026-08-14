import { interior } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import TiltCard from './TiltCard'
import styles from './Interior.module.css'

function Shot({ shot, delay }) {
  return (
    <figure className={`${styles.shot} ${styles[shot.size]}`}>
      <TiltCard
        monogram={shot.caption[0]}
        caption={shot.caption}
        src={shot.src}
        alt={shot.alt}
        position={shot.position}
        delay={delay}
      />
    </figure>
  )
}

/* Своя сигнатура секции: снимки проявляются масштабом, не сдвигом —
   иной почерк, чем у меню (там строки едут по вертикали). */
function GridReveal({ main, rest }) {
  const [ref, visible] = useReveal()

  return (
    <div ref={ref} data-visible={visible} className={styles.grid}>
      <Shot shot={main} delay={0} />
      <div className={styles.column}>
        {rest.map((shot, i) => (
          <Shot key={shot.caption} shot={shot} delay={(i + 1) * -4} />
        ))}
      </div>
    </div>
  )
}

export default function Interior() {
  const [main, ...rest] = interior.shots
  const [headRef, headVisible] = useReveal()

  return (
    <section className={`${styles.section} shell`} id="interior">
      <div ref={headRef} data-visible={headVisible} className={`${styles.head} reveal-up`}>
        <div>
          <p className="eyebrow">атмосфера</p>
          <h2 className={styles.title}>{interior.title}</h2>
        </div>
        <div>
          <p className={styles.lead}>{interior.lead}</p>
          <p className={styles.note}>{interior.note}</p>
        </div>
      </div>

      <GridReveal main={main} rest={rest} />
    </section>
  )
}
