import { useState } from 'react'
import { Lightbox } from './Lightbox'
import { useUI } from '../../data/i18n'

export function Artworks({ items }) {
  const t = useUI()
  const [open, setOpen] = useState(-1)
  return (
    <>
      <ul className="artworks">
        {items.map((a, i) => (
          <li key={i} className={i === 0 ? 'feature' : ''}>
            <button className="art" onClick={() => setOpen(i)} aria-label={`${t.enlarge}: ${a.title}`}>
              <img src={a.src} alt={a.title} loading="lazy" />
              <span className="art-cap">
                <span className="art-title">{a.title}</span>
                <span className="art-note">{a.note}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open >= 0 && <Lightbox items={items} at={open} onClose={() => setOpen(-1)} onGo={setOpen} credit="KnockUp Game Studio" />}
    </>
  )
}
