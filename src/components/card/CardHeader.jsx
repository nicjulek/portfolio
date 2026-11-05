import { Emblem, Icon } from '../ui/Icons'
import { STOPS } from '../../data/stops'
import { useUI } from '../../data/i18n'

export function CardHeader({ id, index, kicker, name, open, onToggle }) {
  const t = useUI()
  return (
    <header className="card-head" onClick={onToggle}>
      <span className="tape" aria-hidden="true" />
      <span className="stamp">
        <Emblem id={id} />
      </span>
      <div className="head-text">
        <p className="kicker">
          <span className="stop-no">
            {index + 1}/{STOPS.length}
          </span>
          {kicker}
        </p>
        <p className="place">{name}</p>
      </div>
      <button
        className="card-toggle"
        aria-expanded={open}
        aria-controls={`card-${id}`}
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
      >
        {open ? t.less : t.more}
        <Icon name="chevron" size={16} />
      </button>
      <svg className="deckle" viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 14V6c20 4 34-5 55-2s31 6 52 3 30-7 50-4 33 7 54 4 29-6 49-3 34 6 54 2 25-4 41-1 25 3 45 0v9z" />
      </svg>
    </header>
  )
}
