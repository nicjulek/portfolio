import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { U } from '../core/env'
import { toon } from '../core/materials'
import { B } from './common'
import { STREAM_Z, pathX } from '../../world/terrain'

export function Duck({ kid }) {
  const s = kid ? 0.55 : 1
  const c = kid ? '#f3d35a' : '#f4f1e8'
  return (
    <group scale={s}>
      <B p={[0, 0.06, 0]} s={[0.1, 0.07, 0.15]} c={c} />
      <B p={[0, 0.09, -0.12]} s={[0.05, 0.05, 0.05]} r={[0.6, 0, 0]} c={c} />
      <B p={[0, 0.17, 0.09]} s={0.06} c={c} />
      <mesh position={[0, 0.16, 0.16]} rotation={[Math.PI / 2, 0, 0]} material={toon('#f0973a')} castShadow>
        <coneGeometry args={[0.025, 0.07, 8]} />
      </mesh>
      <B p={[-0.032, 0.185, 0.13]} s={0.009} c="#1a1715" shadow={false} />
      <B p={[0.032, 0.185, 0.13]} s={0.009} c="#1a1715" shadow={false} />
    </group>
  )
}

export function Ducks() {
  const ref = useRef()
  const x0 = pathX(STREAM_Z)
  useFrame(() => {
    const t = U.uTime.value * 0.12
    ref.current.children.forEach((d, i) => {
      const k = t - i * 0.045
      const x = x0 + 6 + Math.sin(k) * 9
      const dx = Math.cos(k)
      d.position.set(x, -0.42 + Math.sin(U.uTime.value * 2 + i) * 0.012, STREAM_Z + Math.sin(k * 3 + i) * 0.35)
      d.rotation.y = dx > 0 ? Math.PI / 2 : -Math.PI / 2
      d.rotation.z = Math.sin(U.uTime.value * 1.7 + i) * 0.05
    })
  })
  return (
    <group ref={ref}>
      <Duck />
      <Duck kid />
      <Duck kid />
      <Duck kid />
    </group>
  )
}
