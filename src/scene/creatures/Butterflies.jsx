import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U, rng } from '../core/env'
import { height, pathX } from '../../world/terrain'

export function wingGeo(w, h) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(w * 0.3, h * 0.9, w, h * 0.8, w, h * 0.2)
  s.bezierCurveTo(w * 0.9, -h * 0.4, w * 0.3, -h * 0.3, 0, 0)
  return new THREE.ShapeGeometry(s, 8)
}

export function Butterflies({ count = 14 }) {
  const ref = useRef()
  const geo = useMemo(() => wingGeo(0.16, 0.12), [])
  const mats = useMemo(() => ['#ffd36b', '#ffffff', '#f4a6b8', '#9fc8ff'].map((c) => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, transparent: true })), [])
  const seeds = useMemo(() => {
    const g = rng(8)
    return Array.from({ length: count }, () => {
      const z = -60 + g() * 100
      return { z, x: pathX(z) + (g() < 0.5 ? -1 : 1) * (2 + g() * 6), ph: g() * 10, m: Math.floor(g() * 4) }
    })
  }, [count])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const vis = U.uDay.value * (1 - U.uRain.value)
    ref.current.visible = vis > 0.1
    mats.forEach((m) => (m.opacity = vis))
    ref.current.children.forEach((b, i) => {
      const s = seeds[i]
      const x = s.x + Math.sin(t * 0.4 + s.ph) * 2.2
      const z = s.z + Math.cos(t * 0.31 + s.ph * 2) * 2.2
      b.position.set(x, height(x, z) + 0.7 + Math.sin(t * 1.7 + s.ph) * 0.3, z)
      b.rotation.y = t * 0.4 + s.ph
      const f = Math.sin(t * 16 + s.ph) * 1.1
      b.children[0].rotation.y = f
      b.children[1].rotation.y = Math.PI - f
    })
  })
  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <group key={i}>
          <mesh geometry={geo} material={mats[s.m]} />
          <mesh geometry={geo} material={mats[s.m]} />
        </group>
      ))}
    </group>
  )
}
