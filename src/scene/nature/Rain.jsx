import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U, rng } from '../core/env'

export function Rain({ on }) {
  const ref = useRef()
  const N = 2400
  const data = useMemo(() => {
    const g = rng(4)
    return Array.from({ length: N }, () => [(g() - 0.5) * 44, g() * 22, (g() - 0.5) * 44, 16 + g() * 6])
  }, [])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 6), 3))
    return g
  }, [])
  useFrame(({ camera }, dt) => {
    const k = U.uRain.value
    ref.current.visible = k > 0.02
    ref.current.material.opacity = 0.42 * k
    if (!ref.current.visible) return
    const a = geo.attributes.position
    data.forEach((d, i) => {
      d[1] -= d[3] * dt
      if (d[1] < -2) d[1] += 24
      const x = camera.position.x + d[0]
      const y = camera.position.y + d[1] - 7
      const z = camera.position.z + d[2]
      a.setXYZ(i * 2, x, y, z)
      a.setXYZ(i * 2 + 1, x + 0.06, y - 0.5, z + 0.02)
    })
    a.needsUpdate = true
  })
  return (
    <lineSegments ref={ref} geometry={geo} frustumCulled={false}>
      <lineBasicMaterial color="#dbe6f0" transparent depthWrite={false} />
    </lineSegments>
  )
}
