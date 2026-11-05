import './StopCard.css'
import { useEffect, useState } from 'react'
import { useLang } from '../../data/i18n'
import { localize } from '../../data/stops'
import { CARD } from '../../scene/core/cardState'
import { CardHeader } from './CardHeader'
import { Facts } from './Facts'
import { Projects } from './Projects'
import { Artworks } from './Artworks'
import { Gallery } from './Gallery'
import { Contact } from './Contact'
import { Tags } from './Tags'

export function StopCard({ s: raw, index }) {
  const lang = useLang()
  const s = localize(raw, lang)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    CARD.open = open
    return () => (CARD.open = false)
  }, [open])

  return (
    <article className={`card${open ? ' open' : ''}`} style={{ '--accent': s.accent }}>
      <CardHeader id={s.id} index={index} kicker={s.kicker} name={s.name} open={open} onToggle={() => setOpen((o) => !o)} />
      <div className="card-body" id={`card-${s.id}`}>
        <h2>{s.title}</h2>
        <p className="org">{s.org}</p>
        <p className="body">{s.body}</p>
        {s.facts && <Facts items={s.facts} />}
        {s.projects && <Projects items={s.projects} />}
        {s.art && <Artworks items={s.art} />}
        {s.gallery && <Gallery count={s.gallery} />}
        {s.contact && <Contact />}
        {s.tags.length > 0 && <Tags items={s.tags} />}
      </div>
    </article>
  )
}
