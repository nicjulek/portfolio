import * as THREE from 'three'
import { GRAD, U } from './env'

const cache = new Map()

export function toon(color, opts = {}) {
  const k = color + JSON.stringify(opts)
  if (!cache.has(k)) cache.set(k, new THREE.MeshToonMaterial({ color, gradientMap: GRAD, ...opts }))
  return cache.get(k)
}

export const GLOWS = []

function glow(color, base, night) {
  const m = new THREE.MeshToonMaterial({ color, gradientMap: GRAD, emissive: new THREE.Color(color), emissiveIntensity: base })
  m.userData.glow = { base, night }
  GLOWS.push(m)
  return m
}

export const MAT = {
  windowGlass: glow('#ffc46a', 0.05, 1.2),
  lanternPaper: glow('#ffb866', 0.08, 1.15),
  lanternRed: glow('#ff6a3a', 0.06, 1.1),
  screen: glow('#7fb4ff', 0.7, 1.6),
  clockFace: glow('#fff6e2', 0.02, 0.9)
}

export function updateGlows() {
  const g = U.uGlow.value
  for (const m of GLOWS) m.emissiveIntensity = m.userData.glow.base + (m.userData.glow.night - m.userData.glow.base) * g
}
