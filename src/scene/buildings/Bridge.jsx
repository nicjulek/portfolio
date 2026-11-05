import { useMemo } from 'react'
import * as THREE from 'three'
import { Lantern } from './parts/Lantern'
import { toon } from '../core/materials'
import { RB } from '../core/primitives'
import { STREAM_Z, baseHeight, pathX } from '../../world/terrain'

export function Bridge() {
  const z = STREAM_Z
  const x = pathX(z)
  const y = baseHeight(x, z)
  const { planks, rails } = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 2.6), new THREE.Vector3(0, 1.1, 0), new THREE.Vector3(0, 0, -2.6))
    const planks = Array.from({ length: 15 }, (_, i) => {
      const t = i / 14
      const p = curve.getPoint(t)
      const tan = curve.getTangent(t)
      return { p, a: Math.atan2(tan.y, -tan.z) }
    })
    const rails = [-1.15, 1.15].map((s) => {
      const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(s, 0.8, 2.6), new THREE.Vector3(s, 1.9, 0), new THREE.Vector3(s, 0.8, -2.6))
      return { s, geo: new THREE.TubeGeometry(c, 32, 0.06, 8), posts: [0, 0.25, 0.5, 0.75, 1].map((t) => ({ top: c.getPoint(t), base: curve.getPoint(t) })) }
    })
    return { planks, rails }
  }, [])
  return (
    <group position={[x, y + 0.02, z]}>
      {planks.map((pl, i) => (
        <RB key={i} a={[2.3, 0.1, 0.36]} p={[pl.p.x, pl.p.y, pl.p.z]} r={[pl.a, 0, 0]} c={i % 2 ? '#9c6b45' : '#a87650'} rad={0.03} />
      ))}
      {rails.map((r) => (
        <group key={r.s}>
          <mesh geometry={r.geo} material={toon('#c9563b')} castShadow />
          {r.posts.map((pp, i) => (
            <mesh key={i} position={[r.s, (pp.top.y + pp.base.y) / 2, pp.top.z]} material={toon('#c9563b')} castShadow>
              <cylinderGeometry args={[0.06, 0.07, pp.top.y - pp.base.y + 0.1, 8]} />
            </mesh>
          ))}
        </group>
      ))}
      <Lantern p={[1.15, 2.1, 0]} red s={0.8} />
    </group>
  )
}
