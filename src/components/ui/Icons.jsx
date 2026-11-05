
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function Emblem({ id }) {
  const p = {
    ponto: (
      <>
        <path d="M20 34V15" />
        <circle cx="20" cy="10" r="6" />
        <path d="M17 10h6" />
        <path d="M12 34h16" />
      </>
    ),
    antena: (
      <>
        <path d="M9 25c5-1 11-7 12-12" />
        <path d="M8 26c-1-7 6-15 14-14" />
        <path d="M15 19l6-6" />
        <path d="M13 26l2 8h-6" />
        <path d="M26 8a6 6 0 0 1 6 6" />
        <path d="M27 3a11 11 0 0 1 10 10" />
      </>
    ),
    prefeitura: (
      <>
        <path d="M6 34h28" />
        <path d="M8 34V20l12-7 12 7v14" />
        <path d="M15 13V8l5-4 5 4v5" />
        <circle cx="20" cy="22" r="4" />
        <path d="M20 20v2l1.5 1" />
        <path d="M17 34v-5a3 3 0 0 1 6 0v5" />
      </>
    ),
    galpao: (
      <>
        <rect x="7" y="9" width="26" height="17" rx="2" />
        <path d="M3 30h34" />
        <path d="M16 15l-3 3 3 3" />
        <path d="M24 15l3 3-3 3" />
        <path d="M21 14l-2 8" />
      </>
    ),
    atelie: (
      <>
        <path d="M20 5c8 0 15 6 15 13 0 5-4 5-7 5-2 0-3 2-2 4 1 3-2 5-6 5C12 32 5 26 5 18S12 5 20 5z" />
        <circle cx="13" cy="15" r="2" />
        <circle cx="20" cy="11" r="2" />
        <circle cx="27" cy="15" r="2" />
        <circle cx="12" cy="23" r="2" />
      </>
    ),
    varal: (
      <>
        <path d="M3 9c10 5 24 5 34 0" />
        <path d="M8 11v16h10V13" />
        <path d="M22 13v12h10V11" />
        <path d="M11 22c2-3 4 1 6-2" />
        <circle cx="27" cy="18" r="2.5" />
      </>
    ),
    arvore: (
      <>
        <path d="M20 35V22" />
        <path d="M20 26l-5-4" />
        <path d="M20 23c-9 0-14-4-13-9 1-6 7-9 13-9s12 3 13 9c1 5-4 9-13 9z" />
        <path d="M13 22v8M17 22v8M12 30h6" />
      </>
    )
  }[id]
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" {...S}>
      {p}
    </svg>
  )
}

export function Icon({ name, size = 18 }) {
  const p = {
    sound: (
      <>
        <path d="M4 9h3l5-4v14l-5-4H4z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </>
    ),
    mute: (
      <>
        <path d="M4 9h3l5-4v14l-5-4H4z" />
        <path d="M16 9l5 6M21 9l-5 6" />
      </>
    ),
    rain: (
      <>
        <path d="M7 14a4 4 0 0 1-.5-8 6 6 0 0 1 11.3 1.5A3.5 3.5 0 0 1 17.5 14z" />
        <path d="M8 17l-1 3M12.5 17l-1 3M17 17l-1 3" />
      </>
    ),
    sun: (
      <>
        <path d="M7 14a4 4 0 0 1-.5-8 6 6 0 0 1 11.3 1.5A3.5 3.5 0 0 1 17.5 14z" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
      </>
    ),
    card: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="11" r="2.2" />
        <path d="M5.8 16.5c.6-1.8 1.8-2.6 3.2-2.6s2.6.8 3.2 2.6M15 10h3M15 13.5h3" />
      </>
    ),
    code: (
      <>
        <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" />
      </>
    ),
    arrow: <path d="M7 17L17 7M9 7h8v8" />,
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />
      </>
    ),
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    leaf: <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19l7-7" />
  }[name]
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...S}>
      {p}
    </svg>
  )
}
