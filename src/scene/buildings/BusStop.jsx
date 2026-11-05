import { useMemo } from 'react'
import * as THREE from 'three'
import { GlowPool } from './parts/GlowPool'
import { Lantern } from './parts/Lantern'
import { WarmLight } from './parts/WarmLight'
import { GEO, useRoof } from './parts/geometries'
import { WOOD, WOOD_DARK } from './parts/palette'
import { toon } from '../core/materials'
import { RB } from '../core/primitives'

export function BusStop() {
  const roof = useRoof({ w: 3, d: 1.7, wallH: 2.35, h: 0.75, over: 0.35, side: 0.3, t: 0.12 })
  const signRim = useMemo(() => new THREE.TorusGeometry(0.36, 0.04, 10, 32), [])
  const sign = useMemo(() => new THREE.CircleGeometry(0.36, 32), [])
  return (
    <>
      {[-1.25, 1.25].map((x) => (
        <group key={x}>
          <RB a={[0.16, 2.4, 0.16]} p={[x, 1.2, -0.6]} c={WOOD} rad={0.05} />
          <RB a={[0.16, 2.4, 0.16]} p={[x, 1.2, 0.6]} c={WOOD} rad={0.05} />
        </group>
      ))}
      <mesh geometry={roof.roof} material={toon('#b5523b')} castShadow receiveShadow />
      <mesh position={[0, roof.ridge + 0.03, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={toon('#8e3d2c')}>
        <cylinderGeometry args={[0.09, 0.09, roof.depth + 0.1, 10]} />
      </mesh>
      {[0.3, 0.75, 1.2, 1.65].map((y) => (
        <RB key={y} a={[2.5, 0.38, 0.08]} p={[0, y, -0.62]} c={y > 1 ? '#a77a55' : '#946a48'} rad={0.04} />
      ))}
      <RB a={[2.2, 0.12, 0.5]} p={[0, 0.55, -0.3]} c={WOOD} rad={0.05} />
      <RB a={[2.2, 0.4, 0.08]} p={[0, 0.82, -0.52]} r={[-0.15, 0, 0]} c={WOOD} rad={0.04} />
      {[-0.9, 0.9].map((x) => (
        <RB key={x} a={[0.1, 0.5, 0.4]} p={[x, 0.25, -0.3]} c={WOOD_DARK} rad={0.04} />
      ))}
      <mesh position={[2.1, 1.25, 0.8]} castShadow material={toon('#7b8a8f')}>
        <cylinderGeometry args={[0.05, 0.06, 2.5, 10]} />
      </mesh>
      <group position={[2.1, 2.55, 0.8]}>
        <mesh geometry={sign} material={toon('#e9d8a6')} />
        <mesh geometry={sign} material={toon('#e9d8a6')} rotation={[0, Math.PI, 0]} />
        <mesh geometry={signRim} material={toon('#c9563b')} castShadow />
        <mesh geometry={GEO.sphere} scale={[0.2, 0.2, 0.02]} material={toon('#c9563b')} />
      </group>
      <Lantern p={[0, 2.05, 0.75]} red />
      <WarmLight p={[0, 2, 1.4]} intensity={4} />
      <GlowPool p={[0, 0.06, 0.6]} r={2.6} />
    </>
  )
}
