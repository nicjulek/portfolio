import { useMemo } from 'react'
import * as THREE from 'three'

export function Mouth() {
  const geo = useMemo(() => {
    const pts = []
    const add = (s) => {
      let prev = new THREE.Vector3(0, -0.0105, 0.0575)
      for (let i = 1; i <= 8; i++) {
        const t = i / 8
        const p = new THREE.Vector3(s * 0.008 * t, -0.0125 - Math.sin(t * Math.PI) * 0.0028 - t * 0.0015, 0.0572 - t * 0.0035)
        pts.push(prev, p)
        prev = p
      }
    }
    pts.push(new THREE.Vector3(0, -0.0085, 0.0585), new THREE.Vector3(0, -0.0105, 0.0575))
    add(-1)
    add(1)
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#2a2023" />
    </lineSegments>
  )
}
