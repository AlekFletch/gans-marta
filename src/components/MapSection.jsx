import { useEffect, useRef, useState } from 'react'
import { place } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { Quiet } from './Button'
import styles from './MapSection.module.css'

const YANDEX_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY

// Скрипт грузим один раз на всё приложение и переиспользуем промис,
// даже если секция карты успеет размонтироваться/смонтироваться заново.
let ymapsPromise = null
function loadYmaps() {
  if (ymapsPromise) return ymapsPromise
  ymapsPromise = new Promise((resolve, reject) => {
    if (window.ymaps) {
      window.ymaps.ready(() => resolve(window.ymaps))
      return
    }
    const script = document.createElement('script')
    const keyParam = YANDEX_API_KEY ? `apikey=${YANDEX_API_KEY}&` : ''
    script.src = `https://api-maps.yandex.ru/2.1/?${keyParam}lang=ru_RU`
    script.async = true
    script.onload = () => window.ymaps.ready(() => resolve(window.ymaps))
    script.onerror = () => reject(new Error('Не удалось загрузить Яндекс.Карты'))
    document.head.appendChild(script)
  })
  return ymapsPromise
}

export default function MapSection() {
  const holder = useRef(null)
  const mapRef = useRef(null)
  const [panelRef, panelVisible] = useReveal()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadYmaps()
      .then((ymaps) => {
        if (cancelled || !holder.current) return

        const map = new ymaps.Map(
          holder.current,
          {
            center: place.coords,
            zoom: place.zoom,
            controls: [],
            // Скролл отдан странице: карта не перехватывает колесо мыши.
            behaviors: ['drag', 'multiTouch'],
          },
          { suppressMapOpenBlock: true },
        )
        mapRef.current = map

        // Своя метка — шампанская точка с медленным кольцом — вместо
        // стандартной капли Яндекса, в стиле остального сайта.
        const PinLayout = ymaps.templateLayoutFactory.createClass(
          `<div class="${styles.pin}"><b></b><i></i></div>`,
        )
        const placemark = new ymaps.Placemark(
          place.coords,
          {},
          {
            iconLayout: PinLayout,
            iconShape: { type: 'Circle', coordinates: [0, 0], radius: 5 },
          },
        )
        map.geoObjects.add(placemark)

        setReady(true)
      })
      .catch(() => {})

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
  }, [])

  const zoomBy = (delta) => {
    const map = mapRef.current
    if (!map) return
    map.setZoom(map.getZoom() + delta, { checkZoomRange: true, duration: 300 })
  }

  const routeHref = `https://yandex.ru/maps/?rtext=~${place.coords[0]},${place.coords[1]}&rtt=pd`

  return (
    <section className={styles.section} id="map">
      <div className={styles.canvas} ref={holder} aria-hidden="true" />
      <div className={styles.tint} />
      <div className={styles.veil} />

      {ready && (
        <div className={styles.zoom}>
          <button type="button" onClick={() => zoomBy(1)} aria-label="Приблизить">
            +
          </button>
          <button type="button" onClick={() => zoomBy(-1)} aria-label="Отдалить">
            –
          </button>
        </div>
      )}

      <div className="shell" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
        <div ref={panelRef} data-visible={panelVisible} className={styles.panel}>
          <p className="eyebrow">контакты</p>
          <h2 className={styles.address}>{place.address}</h2>
          <p className={styles.city}>
            {place.city} · {place.metro}
          </p>
          <p className={styles.note}>{place.note}</p>
          <div className={styles.actions}>
            <Quiet href={routeHref} target="_blank" rel="noreferrer">
              Построить маршрут
            </Quiet>
            <Quiet
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(
                `${place.city}, ${place.address}`,
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              Открыть в картах
            </Quiet>
          </div>
        </div>
      </div>
    </section>
  )
}
