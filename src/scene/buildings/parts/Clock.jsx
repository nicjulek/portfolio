import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GEO } from './geometries'
import { MAT, toon } from '../../core/materials'
import { RB } from '../../core/primitives'

export function Clock({ p }) {
  const hr = useRef()
  const mn = useRef()
  const face = useMemo(() => new THREE.CircleGeometry(0.42, 36), [])
  const rim = useMemo(() => new THREE.TorusGeometry(0.44, 0.05, 10, 36), [])
  useFrame(() => {
    const d = new Date()
    const m = d.getMinutes() + d.getSeconds() / 60
    const h = (d.getHours() % 12) + m / 60
    mn.current.rotation.z = -(m / 60) * Math.PI * 2
    hr.current.rotation.z = -(h / 12) * Math.PI * 2
  })
  return (
    <group position={p}>
      <mesh geometry={face} material={MAT.clockFace} />
      <mesh geometry={rim} material={toon('#d9b45a')} />
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} geometry={GEO.sphere} scale={0.025} position={[Math.sin((i / 12) * Math.PI * 2) * 0.34, Math.cos((i / 12) * Math.PI * 2) * 0.34, 0.01]} material={toon('#3a2a20')} />
      ))}
      <group ref={hr} position={[0, 0, 0.02]}>
        <RB a={[0.05, 0.22, 0.02]} p={[0, 0.09, 0]} c="#2a1d14" rad={0.01} />
      </group>
      <group ref={mn} position={[0, 0, 0.03]}>
        <RB a={[0.035, 0.33, 0.02]} p={[0, 0.14, 0]} c="#2a1d14" rad={0.01} />
      </group>
    </group>
  )
}
