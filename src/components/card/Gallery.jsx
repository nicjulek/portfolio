import { useUI } from '../../data/i18n'

const TILTS = [-3, 2, -1.5, 3]
const WASHES = ['#9fc8e0', '#f2c38f', '#b8d99a', '#e7b1c3']

export function Gallery({ count }) {
  const t = useUI()
  return (
    <div className="gallery">
      {Array.from({ length: count }, (_, i) => (
        <figure key={i} className="polaroid" style={{ '--tilt': `${TILTS[i % 4]}deg`, '--wash': WASHES[i % 4] }}>
          <span className="pin" />
          <span className="photo" />
          <figcaption>{t.soon}</figcaption>
        </figure>
      ))}
    </div>
  )
}
