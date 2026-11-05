import './Hint.css'
import { useUI } from '../../data/i18n'

export function Hint() {
  const t = useUI()
  return (
    <p className="hint">
      {t.walk}
      <span>{t.talk}</span>
    </p>
  )
}
