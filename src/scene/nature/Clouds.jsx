import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GRAD, U, rng } from '../core/env'

export function Clouds() {
  const ref = useRef()
  const mat = useMemo(() => new THREE.MeshToonMaterial({ gradientMap: GRAD, color: '#ffffff', fog: false, transparent: true, opacity: 0.95 }), [])
  const list = useMemo(() => {
    const g = rng(77)
    return Array.from({ length: 14 }, () => ({
      p: [(g() - 0.5) * 160, 30 + g() * 16, -100 + g() * 160],
      parts: Array.from({ length: 6 }, (_, j) => [j * 2 - 5 + g(), g() * 1.4 + (j > 1 && j < 4 ? 1 : 0), g() * 1.8, 2 + g() * 1.8])
    }))
  }, [])
  const geo = useMemo(() => new THREE.SphereGeometry(1, 16, 12), [])
  const tint = useMemo(() => new THREE.Color(), [])
  useFrame((_, dt) => {
    ref.current.children.forEach((c) => {
      c.position.x += dt * (0.5 + U.uRain.value * 1.5)
      if (c.position.x > 90) c.position.x = -90
    })
    tint.set('#ffffff').lerp(U.uHorizon.value, 0.35).multiplyScalar(0.35 + U.uDay.value * 0.75)
    mat.color.copy(tint)
    mat.opacity = 0.5 + U.uDay.value * 0.45 + U.uRain.value * 0.2
  })
  return (
    <group ref={ref}>
      {list.map((c, i) => (
        <group key={i} position={c.p}>
          {c.parts.map(([x, y, z, r], j) => (
            <mesh key={j} geometry={geo} material={mat} position={[x, y, z]} scale={[r, r * 0.8, r]} />
          ))}
        </group>
      ))}
    </group>
  )
}
