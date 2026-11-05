import { useMemo } from 'react'
import * as THREE from 'three'
import { GRAD, rng } from '../core/env'
import { Instanced } from '../core/primitives'
import { height, pathX } from '../../world/terrain'

export function Rocks({ avoid }) {
  const items = useMemo(() => {
    const g = rng(55)
    const out = []
    while (out.length < 70) {
      const z = -72 + g() * 120
      const x = pathX(z) + (g() < 0.5 ? -1 : 1) * (1.4 + g() * 20)
      if (avoid(x, z)) continue
      const s = 0.15 + Math.pow(g(), 3) * 0.9
      out.push({ p: [x, height(x, z) + s * 0.2, z], s: [s * 1.3, s * 0.8, s], r: g() * 6, color: g() < 0.5 ? '#9a9a8c' : '#85877a' })
    }
    return out
  }, [avoid])
  const geo = useMemo(() => new THREE.DodecahedronGeometry(1, 1), [])
  const mat = useMemo(() => new THREE.MeshToonMaterial({ gradientMap: GRAD }), [])
  return <Instanced items={items} geometry={geo} material={mat} castShadow receiveShadow />
}
