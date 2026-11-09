import { useState } from 'react'
import { Lightbox } from './Lightbox'
import { useUI } from '../../data/i18n'

const TILTS = [-3, 2, -1.5, 3]

export function Gallery({ items }) {
  const t = useUI()
  const [open, setOpen] = useState(-1)
  return (
    <>
      <div className="gallery">
        {items.map((d, i) => (
          <figure key={i} className={`polaroid${d.wide ? ' wide' : ''}`} style={{ '--tilt': `${TILTS[i % 4] * (d.wide ? 0.4 : 1)}deg` }}>
            <span className="pin" />
            <button className="photo" onClick={() => setOpen(i)} aria-label={`${t.enlarge} ${i + 1}/${items.length}`}>
              <img src={d.src} alt={d.note} loading="lazy" />
            </button>
          </figure>
        ))}
      </div>
      {open >= 0 && <Lightbox items={items} at={open} onClose={() => setOpen(-1)} onGo={setOpen} />}
    </>
  )
}
