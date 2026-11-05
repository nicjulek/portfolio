import { useMemo } from 'react'
import * as THREE from 'three'

export function Whiskers() {
  const geo = useMemo(() => {
    const pts = []
    const curve = (o, d, len, droop) => {
      let prev = null
      for (let i = 0; i <= 10; i++) {
        const t = i / 10
        const p = new THREE.Vector3(o[0] + d[0] * len * t, o[1] + d[1] * len * t - droop * t * t, o[2] + d[2] * len * t)
        if (prev) pts.push(prev, p)
        prev = p
      }
    }
    for (const s of [-1, 1]) {
      for (let i = 0; i < 7; i++) {
        const a = -0.35 + i * 0.12
        curve([s * 0.016, -0.02 - i * 0.0012, 0.052], [s * Math.cos(a) * 0.95, Math.sin(a) * 0.5, 0.25], 0.048 + (i % 3) * 0.005, 0.005 + i * 0.0015)
      }
      for (let i = 0; i < 3; i++) curve([s * (0.016 + i * 0.005), 0.02, 0.042], [s * 0.6, 0.75, 0.35], 0.03, -0.004)
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.5} />
    </lineSegments>
  )
}
