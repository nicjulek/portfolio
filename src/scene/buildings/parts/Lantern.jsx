import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { GEO } from './geometries'
import { WOOD_DARK } from './palette'
import { U } from '../../core/env'
import { MAT } from '../../core/materials'
import { G } from '../../core/primitives'

export function Lantern({ p, red, s = 1 }) {
  const ref = useRef()
  const seed = useMemo(() => Math.random() * 10, [])
  useFrame(() => {
    ref.current.rotation.z = Math.sin(U.uTime.value * 1.4 + seed) * 0.06 * U.uWind.value
  })
  return (
    <group ref={ref} position={p} scale={s}>
      <mesh geometry={GEO.lantern} material={red ? MAT.lanternRed : MAT.lanternPaper} />
      <G geo={GEO.lanternCap} p={[0, 0.19, 0]} c={WOOD_DARK} shadow={false} />
      <G geo={GEO.lanternCap} p={[0, -0.19, 0]} r={[Math.PI, 0, 0]} c={WOOD_DARK} shadow={false} />
    </group>
  )
}
