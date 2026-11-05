import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GlowPool } from './parts/GlowPool'
import { Lantern } from './parts/Lantern'
import { WarmLight } from './parts/WarmLight'
import { GEO } from './parts/geometries'
import { WOOD } from './parts/palette'
import { GRAD, U, rng, windify } from '../core/env'
import { toon } from '../core/materials'
import { RB, lathe, tube } from '../core/primitives'

export function GiantTree() {
  const swing = useRef()
  const trunk = useMemo(
    () =>
      lathe(
        [
          [2.6, 0],
          [1.9, 0.25],
          [1.45, 0.8],
          [1.25, 2],
          [1.15, 4],
          [1.05, 6.5],
          [1.15, 8],
          [0.8, 9.6],
          [0.0001, 10]
        ],
        14
      ),
    []
  )
  const branches = useMemo(
    () => [
      tube([[-0.4, 7, 0], [-2.2, 8.2, 0.3], [-4, 8.6, 0], [-5.4, 9.6, -0.3]], 0.32, 30),
      tube([[0.4, 7.6, 0.2], [2.2, 9, 1], [3.8, 10, 1.2]], 0.3, 30),
      tube([[0, 8.4, -0.3], [0.6, 10, -2.4], [0.4, 11.2, -3.6]], 0.28, 30),
      tube([[0.2, 8.8, 0.4], [-0.8, 10.4, 2.6], [-1.6, 11.4, 3.4]], 0.26, 30)
    ],
    []
  )
  const roots = useMemo(
    () =>
      [0, 1.25, 2.5, 3.8, 5.0].map((a) =>
        tube(
          [
            [Math.cos(a) * 1.4, 1.2, Math.sin(a) * 1.4],
            [Math.cos(a) * 2.6, 0.4, Math.sin(a) * 2.6],
            [Math.cos(a) * 3.6, -0.15, Math.sin(a) * 3.6]
          ],
          0.32,
          20
        )
      ),
    []
  )
  const leaves = useMemo(() => {
    const g = rng(31)
    const c = ['#2f6534', '#3f7a3a', '#4f8f40', '#356d36', '#5d9c46']
    return Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2
      const r = i < 11 ? 3.8 + g() * 2 : g() * 2
      return { p: [Math.cos(a) * r - 0.6, 10.2 + g() * 2.6 + (i >= 11 ? 2.4 : 0), Math.sin(a) * r], s: [2.9 + g() * 1.4, 2.3 + g(), 2.9 + g() * 1.4], c: c[i % 5] }
    })
  }, [])
  const leafMats = useMemo(() => ['#2f6534', '#3f7a3a', '#4f8f40', '#356d36', '#5d9c46'].reduce((o, c) => ((o[c] = windify(new THREE.MeshToonMaterial({ color: c, gradientMap: GRAD }), 0.05)), o), {}), [])
  const ropes = useMemo(() => [-0.45, 0.45].map((z) => tube([[0, 0, z], [0.02, -3, z], [0, -6.4, z]], 0.025, 16)), [])
  useFrame(() => {
    swing.current.rotation.z = Math.sin(U.uTime.value * 0.9) * 0.16 * U.uWind.value
  })
  const bark = toon('#6b4a32')
  return (
    <>
      <mesh geometry={trunk} material={bark} castShadow receiveShadow />
      {branches.map((g, i) => (
        <mesh key={i} geometry={g} material={bark} castShadow />
      ))}
      {roots.map((g, i) => (
        <mesh key={i} geometry={g} material={toon('#5e3f2b')} castShadow receiveShadow />
      ))}
      {leaves.map((l, i) => (
        <mesh key={i} geometry={GEO.sphere} position={l.p} scale={l.s} material={leafMats[l.c]} castShadow receiveShadow />
      ))}
      <group ref={swing} position={[-3.8, 8.5, 0]}>
        {ropes.map((g, i) => (
          <mesh key={i} geometry={g} material={toon('#d8c8a8')} />
        ))}
        <RB a={[0.5, 0.08, 1.15]} p={[0, -6.4, 0]} c={WOOD} rad={0.03} />
      </group>
      {[
        [2.6, 8.7, 1.2],
        [-2.6, 8.1, 0.25],
        [0.5, 9.5, -2.2]
      ].map((p, i) => (
        <Lantern key={i} p={p} red={i === 1} />
      ))}
      <WarmLight p={[0, 6, 4]} intensity={7} distance={14} />
      <GlowPool p={[0, 0.08, 3]} r={5} />
    </>
  )
}
