import './Lightbox.css'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useUI } from '../../data/i18n'

export function Lightbox({ items, at, onClose, onGo, credit }) {
  const t = useUI()
  const it = items[at]
  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onGo((at + 1) % items.length)
      if (e.key === 'ArrowLeft') onGo((at - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [at, items, onClose, onGo])
  return createPortal(
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={it.title ?? it.note} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()} key={at}>
        <img src={it.src} alt={it.title ?? it.note} />
        <figcaption>
          {it.title && <span className="lb-title">{it.title}</span>}
          <span className="lb-note">
            {credit ? `${it.note} · ${credit}` : it.note}
          </span>
          <span className="lb-count">
            {at + 1}/{items.length}
          </span>
        </figcaption>
      </figure>
      <button className="lb-nav prev" onClick={(e) => (e.stopPropagation(), onGo((at - 1 + items.length) % items.length))} aria-label={t.prevArt}>
        ‹
      </button>
      <button className="lb-nav next" onClick={(e) => (e.stopPropagation(), onGo((at + 1) % items.length))} aria-label={t.nextArt}>
        ›
      </button>
      <button className="lb-close" onClick={onClose} aria-label={t.close}>
        ×
      </button>
    </div>,
    document.body
  )
}
