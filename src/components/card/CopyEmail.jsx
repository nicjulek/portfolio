import { useState } from 'react'
import { Icon } from '../ui/Icons'
import { useUI } from '../../data/i18n'
import { LINKS } from '../../data/stops'

export function CopyEmail() {
  const t = useUI()
  const [done, setDone] = useState(false)
  const copy = async (e) => {
    try {
      await navigator.clipboard.writeText(LINKS.email)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      const r = document.createRange()
      r.selectNodeContents(e.currentTarget.closest('.link').querySelector('.link-value'))
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(r)
    }
  }
  return (
    <button className="copy" onClick={copy} aria-label={t.copyEmail}>
      <Icon name={done ? 'check' : 'copy'} size={16} />
      <span>{done ? t.copied : t.copy}</span>
    </button>
  )
}
