import './TrailNav.css'
import { STOPS, tr } from '../../data/stops'
import { useLang, useUI } from '../../data/i18n'
import { STOP_TS } from '../../hooks/useTrailControls'
import { Icon } from './Icons'

export function TrailNav({ stop, markerRef, onGo, onJump }) {
  const lang = useLang()
  const t = useUI()
  return (
    <nav className="trail" aria-label={t.stops}>
      <button className="step prev" onClick={() => onJump(-1)} aria-label={t.prev}>
        <Icon name="chevron" size={20} />
      </button>
      <div className="track" style={{ '--a': `${STOP_TS[0] * 100}%`, '--b': `${STOP_TS[STOP_TS.length - 1] * 100}%` }}>
        <div className="line" />
        <div className="line-fill" />
        {STOPS.map((st, i) => (
          <button key={st.id} className={`mark${i === stop ? ' on' : ''}`} style={{ left: `${STOP_TS[i] * 100}%` }} onClick={() => onGo(i)} aria-label={tr(st.name, lang)}>
            <span>{tr(st.name, lang)}</span>
          </button>
        ))}
        <div className="me" ref={markerRef} />
      </div>
      <button className="step next" onClick={() => onJump(1)} aria-label={t.next}>
        <Icon name="chevron" size={20} />
      </button>
    </nav>
  )
}
