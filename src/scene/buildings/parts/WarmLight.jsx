import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { U } from '../../core/env'

export function WarmLight({ p, intensity = 6, distance = 9 }) {
  const ref = useRef()
  const seed = useMemo(() => Math.random() * 10, [])
  useFrame(() => {
    const t = U.uTime.value
    const flick = 1 + Math.sin(t * 9 + seed) * 0.04 + Math.sin(t * 23 + seed) * 0.03
    ref.current.intensity = U.uGlow.value * intensity * flick
  })
  return <pointLight ref={ref} position={p} color="#ffb766" distance={distance} decay={1.6} />
}
