import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Burst({ trigger }) {
  const ref = useRef()
  const k = useRef(1)
  const last = useRef(trigger)
  const dirs = useMemo(() => Array.from({ length: 18 }, (_, i) => new THREE.Vector3(Math.cos(i * 2.4), Math.sin(i * 1.7) * 0.8, Math.sin(i * 2.4)).normalize()), [])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(dirs.length * 3), 3))
    return g
  }, [dirs])
  const mat = useMemo(() => new THREE.PointsMaterial({ color: '#fff0a8', size: 0.07, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), [])
  useFrame((_, dt) => {
    if (trigger !== last.current) {
      last.current = trigger
      k.current = 0
    }
    k.current = Math.min(1, k.current + dt * 1.3)
    const r = 0.15 + (1 - Math.pow(1 - k.current, 3)) * 0.9
    const a = geo.attributes.position
    dirs.forEach((d, i) => a.setXYZ(i, d.x * r, d.y * r - k.current * 0.3, d.z * r))
    a.needsUpdate = true
    mat.opacity = 1 - k.current
    ref.current.visible = k.current < 1
  })
  return <points ref={ref} geometry={geo} material={mat} />
}
