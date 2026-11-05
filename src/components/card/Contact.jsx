import { Icon } from '../ui/Icons'
import { useUI } from '../../data/i18n'
import { LINKS } from '../../data/stops'
import { CopyEmail } from './CopyEmail'

function ContactRow({ icon, label, value, href, action }) {
  const inner = (
    <>
      <span className="link-icon">
        <Icon name={icon} />
      </span>
      <span className="link-text">
        <span className="link-label">{label}</span>
        <span className="link-value">{value}</span>
      </span>
      {action || <Icon name="arrow" size={16} />}
    </>
  )
  return href ? (
    <a className="link" href={href} target="_blank" rel="noreferrer">
      {inner}
    </a>
  ) : (
    <div className="link">{inner}</div>
  )
}

export function Contact() {
  const t = useUI()
  return (
    <ul className="links">
      <li>
        <ContactRow icon="card" label="LinkedIn" value="nicole-julek-klazura" href={LINKS.linkedin} />
      </li>
      <li>
        <ContactRow icon="mail" label={t.email} value={LINKS.email} action={<CopyEmail />} />
      </li>
      <li>
        <ContactRow icon="code" label="GitHub" value="nicjulek" href={LINKS.github} />
      </li>
    </ul>
  )
}
