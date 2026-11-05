import './TopBar.css'
import { PROFILE, tr } from '../../data/stops'
import { useUI } from '../../data/i18n'
import { phaseOf } from '../../scene/core/env'
import { PRESETS } from '../../hooks/useClock'
import { Icon } from './Icons'

const fmt = (h) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`

function TimePicker({ clock }) {
  const t = useUI()
  const phase = t.phases[phaseOf(clock.hour)]
  return (
    <label className="pill time">
      <span className="clock">{fmt(clock.hour)}</span>
      <span className="phase">{clock.isLive ? phase : `${t.preview} · ${phase}`}</span>
      <select id="hora" value={clock.preset} onChange={(e) => clock.setPreset(e.target.value)} aria-label={t.hour}>
        {PRESETS.map((v, i) => (
          <option key={v} value={v}>
            {t.presets[i]}
          </option>
        ))}
      </select>
    </label>
  )
}

function IconToggle({ on, label, onClick, children, className = '' }) {
  return (
    <button className={`icon-btn${on ? ' on' : ''} ${className}`.trim()} onClick={onClick} aria-pressed={on} aria-label={label} title={label}>
      {children}
    </button>
  )
}

export function TopBar({ lang, onToggleLang, clock, muted, onToggleMute, rain, onToggleRain }) {
  const t = useUI()
  return (
    <header className="top">
      <div>
        <h1>{PROFILE.name}</h1>
        <p className="role">{tr(PROFILE.role, lang)}</p>
      </div>
      <div className="controls">
        <TimePicker clock={clock} />
        <IconToggle on={!muted} label={muted ? t.musicOn : t.musicOff} onClick={onToggleMute}>
          <Icon name={muted ? 'mute' : 'sound'} size={20} />
        </IconToggle>
        <IconToggle on={rain} label={rain ? t.rainOff : t.rainOn} onClick={onToggleRain}>
          <Icon name="rain" size={20} />
        </IconToggle>
        <button className="icon-btn lang-btn" onClick={onToggleLang} aria-label={t.lang} title={t.lang}>
          {lang === 'pt' ? 'EN' : 'PT'}
        </button>
      </div>
    </header>
  )
}
