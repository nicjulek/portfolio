import { useMemo } from 'react'
import * as THREE from 'three'
import { GRAD, rng, windify } from '../core/env'
import { Instanced } from '../core/primitives'
import { STREAM_Z, height, pathX } from '../../world/terrain'

export function Flowers({ avoid }) {
  const items = useMemo(() => {
    const g = rng(33)
    const colors = ['#fff8e8', '#ffd76a', '#f4a6b8', '#c9b8ff', '#ffffff']
    const out = []
    while (out.length < 900) {
      const z = -70 + g() * 118
      const x = pathX(z) + (g() < 0.5 ? -1 : 1) * (1.6 + g() * 16)
      if (Math.abs(z - STREAM_Z) < 1.8 || avoid(x, z)) continue
      out.push({ p: [x, height(x, z) + 0.32 + g() * 0.15, z], s: 0.6 + g() * 0.6, r: g() * 6, color: colors[Math.floor(g() * 5)] })
    }
    return out
  }, [avoid])
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const b = a + Math.PI / 5
      if (i === 0) s.moveTo(Math.cos(a) * 0.03, Math.sin(a) * 0.03)
      s.quadraticCurveTo(Math.cos(a) * 0.14, Math.sin(a) * 0.14, Math.cos(b) * 0.03, Math.sin(b) * 0.03)
    }
    const g = new THREE.ShapeGeometry(s, 4)
    g.rotateX(-Math.PI / 2)
    return g
  }, [])
  const mat = useMemo(() => windify(new THREE.MeshToonMaterial({ gradientMap: GRAD, side: THREE.DoubleSide }), 0.05, '1.0'), [])
  return <Instanced items={items} geometry={geo} material={mat} />
}
