import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GRAD, U, rng } from '../core/env'

export function FallingLeaves({ center, count = 36 }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.1)
    s.quadraticCurveTo(0.08, 0, 0, 0.1)
    s.quadraticCurveTo(-0.08, 0, 0, -0.1)
    return new THREE.ShapeGeometry(s, 6)
  }, [])
  const mats = useMemo(() => ['#e0a53a', '#c9692f', '#7fae4a', '#f3b4c4'].map((c) => new THREE.MeshToonMaterial({ color: c, gradientMap: GRAD, side: THREE.DoubleSide })), [])
  const seeds = useMemo(() => {
    const g = rng(5)
    return Array.from({ length: count }, () => ({ x: (g() - 0.5) * 12, z: (g() - 0.5) * 12, y: g() * 12, sp: 0.5 + g() * 0.6, ph: g() * 10, m: Math.floor(g() * 4) }))
  }, [count])
  useFrame((_, dt) => {
    const t = U.uTime.value
    ref.current.children.forEach((l, i) => {
      const s = seeds[i]
      s.y -= dt * s.sp * (1 + U.uRain.value)
      if (s.y < 0) s.y = 12
      l.position.set(center[0] + s.x + Math.sin(t * 1.2 + s.ph) * 0.8, center[1] + s.y, center[2] + s.z + Math.cos(t + s.ph) * 0.5)
      l.rotation.set(t * 1.3 + s.ph, t * 0.9, Math.sin(t * 2 + s.ph))
    })
  })
  return (
    <group ref={ref}>
      {seeds.map((s, i) => (
        <mesh key={i} geometry={geo} material={mats[s.m]} />
      ))}
    </group>
  )
}
