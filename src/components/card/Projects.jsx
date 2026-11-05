import { Icon } from '../ui/Icons'

export function ProjectCard({ project: p }) {
  return (
    <a href={p.url} target="_blank" rel="noreferrer" className="project">
      <span className="project-top">
        <span className="project-name">{p.name}</span>
        <Icon name="arrow" size={14} />
      </span>
      <span className="project-desc">{p.desc}</span>
      <span className="project-meta">
        <span className="lang" style={{ '--lang': p.color }} />
        {p.lang} · {p.stack}
      </span>
    </a>
  )
}

export function Projects({ items }) {
  return (
    <ul className="projects">
      {items.map((p) => (
        <li key={p.url + p.name}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>
  )
}
