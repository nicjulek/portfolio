import { useMemo } from 'react'
import * as THREE from 'three'
import { GEO } from './geometries'
import { MAT, toon } from '../../core/materials'

export function StringLights({ a, b, sag = 0.4, n = 9 }) {
  const { geo, bulbs } = useMemo(() => {
    const A = new THREE.Vector3(...a)
    const B = new THREE.Vector3(...b)
    const mid = A.clone().lerp(B, 0.5)
    mid.y -= sag
    const curve = new THREE.QuadraticBezierCurve3(A, mid, B)
    return { geo: new THREE.TubeGeometry(curve, 30, 0.012, 6), bulbs: Array.from({ length: n }, (_, i) => curve.getPoint((i + 0.5) / n)) }
  }, [a, b, sag, n])
  return (
    <>
      <mesh geometry={geo} material={toon('#2d2d2d')} />
      {bulbs.map((p, i) => (
        <mesh key={i} geometry={GEO.sphere} scale={0.06} position={[p.x, p.y - 0.05, p.z]} material={i % 2 ? MAT.lanternPaper : MAT.lanternRed} />
      ))}
    </>
  )
}
