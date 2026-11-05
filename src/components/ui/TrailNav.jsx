import './TrailNav.css'
import { STOPS, tr } from '../../data/stops'
import { useLang, useUI } from '../../data/i18n'
import { STOP_TS } from '../../hooks/useTrailControls'

export function TrailNav({ stop, markerRef, onGo, onJump }) {
  const lang = useLang()
  const t = useUI()
  return (
    <nav className="trail" aria-label={t.stops}>
      <button className="step" onClick={() => onJump(-1)} aria-label={t.prev}>
        ‹
      </button>
      <div className="track">
        <div className="line" />
        {STOPS.map((st, i) => (
          <button key={st.id} className={`mark${i === stop ? ' on' : ''}`} style={{ left: `${STOP_TS[i] * 100}%` }} onClick={() => onGo(i)} aria-label={tr(st.name, lang)}>
            <span>{tr(st.name, lang)}</span>
          </button>
        ))}
        <div className="me" ref={markerRef} />
      </div>
      <button className="step" onClick={() => onJump(1)} aria-label={t.next}>
        ›
      </button>
    </nav>
  )
}
