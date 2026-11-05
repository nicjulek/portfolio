import { useMemo } from 'react'
import * as THREE from 'three'

export function Ear({ side, earRef }) {
  const geo = useMemo(() => {
    const g = new THREE.ConeGeometry(0.027, 0.05, 20, 4, true, Math.PI * 0.22, Math.PI * 1.56)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i)
      const k = (y + 0.025) / 0.05
      p.setZ(i, p.getZ(i) - k * k * 0.006)
    }
    g.computeVertexNormals()
    return g
  }, [])
  const tufts = useMemo(() => {
    const pts = []
    for (let i = 0; i < 9; i++) {
      const a = (i / 8 - 0.5) * 0.9
      pts.push(new THREE.Vector3(a * 0.012, -0.018, 0.004), new THREE.Vector3(a * 0.02, -0.004 + Math.random() * 0.004, 0.008))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])
  return (
    <group position={[side * 0.029, 0.038, -0.006]} rotation={[-0.12, side * 0.42, side * -0.36]} scale={1.25}>
      <group ref={earRef}>
        <mesh geometry={geo} position={[0, 0.022, 0]} castShadow>
          <meshStandardMaterial color="#1b1a1f" roughness={0.9} side={THREE.FrontSide} />
        </mesh>
        <mesh geometry={geo} position={[0, 0.022, 0]} scale={[0.96, 0.98, 0.96]}>
          <meshStandardMaterial color="#b8797f" roughness={0.75} side={THREE.BackSide} />
        </mesh>
        <lineSegments geometry={tufts} position={[0, 0.022, 0]}>
          <lineBasicMaterial color="#f2efe8" transparent opacity={0.4} />
        </lineSegments>
      </group>
    </group>
  )
}
