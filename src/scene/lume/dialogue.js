export function greet(h, L) {
  if (h < 5) return L.greet[0]
  if (h < 12) return L.greet[1]
  if (h < 18) return L.greet[2]
  return L.greet[3]
}

export function lumeLines(h, L) {
  const night = h >= 18.5 || h < 5.5
  return [greet(h, L), L.intro, L.hover, L.rain, night ? L.nightTip : L.dayTip, L.spin]
}
