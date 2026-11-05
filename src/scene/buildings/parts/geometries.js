import { useMemo } from 'react'
import * as THREE from 'three'
import { lathe } from '../../core/primitives'

export const GEO = {
  lantern: lathe([[0, -0.2], [0.09, -0.19], [0.15, -0.12], [0.17, 0], [0.15, 0.12], [0.09, 0.19], [0, 0.2]]),
  lanternCap: lathe([[0, 0.06], [0.1, 0.03], [0.11, 0], [0.06, -0.01], [0, -0.01]]),
  pot: lathe([[0, 0], [0.16, 0], [0.2, 0.05], [0.22, 0.28], [0.26, 0.32], [0.24, 0.34], [0.2, 0.3], [0, 0.3]]),
  barrel: lathe([[0, 0], [0.3, 0], [0.36, 0.25], [0.37, 0.45], [0.34, 0.7], [0.3, 0.75], [0, 0.75]]),
  jar: lathe([[0, 0], [0.06, 0], [0.08, 0.06], [0.07, 0.12], [0.05, 0.14], [0.055, 0.17], [0, 0.17]]),
  stool: lathe([[0, 0], [0.18, 0], [0.12, 0.08], [0.1, 0.42], [0.22, 0.46], [0.22, 0.5], [0, 0.5]]),
  parasol: lathe([[0, 0.55], [0.18, 0.5], [0.55, 0.32], [0.9, 0.06], [1.0, 0], [0.98, -0.02], [0.88, 0.03], [0.55, 0.28], [0.18, 0.46], [0, 0.5]], 16),
  knob: new THREE.SphereGeometry(0.05, 12, 8),
  sphere: new THREE.SphereGeometry(1, 20, 14)
}

export function archShape(w, h, inset = 0) {
  const s = new THREE.Shape()
  const hw = w / 2 - inset
  const r = hw
  const hh = h - inset - r
  s.moveTo(-hw, inset)
  s.lineTo(hw, inset)
  s.lineTo(hw, hh)
  s.absarc(0, hh, r, 0, Math.PI, false)
  s.lineTo(-hw, inset)
  return s
}

export function useArch(w, h, depth, frame = 0) {
  return useMemo(() => {
    const outer = archShape(w, h)
    if (frame) outer.holes.push(archShape(w, h, frame))
    const g = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2, curveSegments: 18 })
    return g
  }, [w, h, depth, frame])
}

export function roofProfile(D, h, t, y0) {
  const outer = []
  const n = 36
  for (let i = 0; i <= n; i++) {
    const z = -D + (2 * D * i) / n
    outer.push([z, y0 + h * Math.pow(1 - Math.abs(z) / D, 1.45)])
  }
  return outer.map(([z, y]) => [z, y, y - t])
}

export function useRoof({ w, d, wallH, h, over, side, t }) {
  return useMemo(() => {
    const D = d / 2 + over
    const y0 = wallH + t - h * Math.pow(over / D, 1.45)
    const prof = roofProfile(D, h, t, y0)
    const s = new THREE.Shape()
    prof.forEach(([z, y], i) => (i ? s.lineTo(z, y) : s.moveTo(z, y)))
    for (let i = prof.length - 1; i >= 0; i--) s.lineTo(prof[i][0], prof[i][2])
    const depth = w + side * 2
    const roof = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 2, steps: 1 })
    roof.translate(0, 0, -depth / 2)
    roof.rotateY(Math.PI / 2)
    const gs = new THREE.Shape()
    const hd = d / 2
    gs.moveTo(-hd, wallH - 0.02)
    for (let i = 0; i <= 24; i++) {
      const z = -hd + (d * i) / 24
      gs.lineTo(z, y0 - t + h * Math.pow(1 - Math.abs(z) / D, 1.45) - 0.03)
    }
    gs.lineTo(hd, wallH - 0.02)
    const gable = new THREE.ExtrudeGeometry(gs, { depth: w - 0.02, bevelEnabled: false })
    gable.translate(0, 0, -(w - 0.02) / 2)
    gable.rotateY(Math.PI / 2)
    return { roof, gable, ridge: y0 + h, depth }
  }, [w, d, wallH, h, over, side, t])
}
