import { Icon } from '../ui/Icons'

export function Facts({ items }) {
  return (
    <ul className="facts">
      {items.map((f) => (
        <li key={f}>
          <Icon name="leaf" size={15} />
          {f}
        </li>
      ))}
    </ul>
  )
}
