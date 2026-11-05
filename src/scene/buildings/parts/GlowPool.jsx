import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U } from '../../core/env'

export function GlowPool({ p, r = 2.4, color = '#ffb85c' }) {
  const mat = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const x = c.getContext('2d')
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
    g.addColorStop(0, 'rgba(255,255,255,0.9)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = g
    x.fillRect(0, 0, 64, 64)
    return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })
  }, [color])
  useFrame(() => (mat.opacity = U.uGlow.value * 0.32))
  return (
    <mesh position={p} rotation={[-Math.PI / 2, 0, 0]} material={mat}>
      <planeGeometry args={[r * 2, r * 2]} />
    </mesh>
  )
}
