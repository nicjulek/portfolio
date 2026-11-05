export function Tags({ items }) {
  return (
    <ul className="tags">
      {items.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}
