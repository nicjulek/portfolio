import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GEO } from './geometries'
import { GRAD, U } from '../../core/env'

export function Smoke({ p }) {
  const ref = useRef()
  const mat = useMemo(() => new THREE.MeshToonMaterial({ gradientMap: GRAD, color: '#e9e6df', transparent: true, opacity: 0.5, depthWrite: false }), [])
  const seeds = useMemo(() => Array.from({ length: 9 }, (_, i) => i / 9), [])
  useFrame(() => {
    const t = U.uTime.value
    mat.color.set('#f2efe8').multiplyScalar(0.35 + U.uDay.value * 0.65)
    ref.current.children.forEach((m, i) => {
      const k = (t * 0.16 + seeds[i]) % 1
      m.position.set(Math.sin(k * 6 + i) * 0.25 + k * 1.2, k * 3.4, Math.cos(k * 5 + i) * 0.15)
      m.scale.setScalar(0.12 + k * 0.45)
      m.visible = U.uRain.value < 0.8
    })
    mat.opacity = 0.45 * (1 - U.uRain.value)
  })
  return (
    <group ref={ref} position={p}>
      {seeds.map((_, i) => (
        <mesh key={i} geometry={GEO.sphere} material={mat} />
      ))}
    </group>
  )
}
