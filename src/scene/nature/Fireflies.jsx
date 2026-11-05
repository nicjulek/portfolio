import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U, rng } from '../core/env'
import { height, pathX } from '../../world/terrain'

export const DOT = (() => {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const x = c.getContext('2d')
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(255,255,255,0.6)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  x.fillStyle = g
  x.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
})()

export function Fireflies({ count = 220 }) {
  const ref = useRef()
  const seeds = useMemo(() => {
    const g = rng(9)
    return Array.from({ length: count }, (_, i) => {
      const atTree = i < 60
      const z = atTree ? -56 + (g() - 0.5) * 10 : -66 + g() * 110
      const x = atTree ? pathX(-56) + 12 + (g() - 0.5) * 12 : pathX(z) + (g() - 0.5) * 18
      return [x, height(x, z) + 0.4 + g() * 2.4, z, g() * 6.28]
    })
  }, [count])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    return g
  }, [count])
  const mat = useMemo(() => new THREE.PointsMaterial({ map: DOT, color: '#fff3a0', size: 0.35, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), [])
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const a = geo.attributes.position
    seeds.forEach(([x, y, z, s], i) => a.setXYZ(i, x + Math.sin(t * 0.4 + s) * 0.9, y + Math.sin(t * 0.7 + s * 2) * 0.5, z + Math.cos(t * 0.33 + s) * 0.9))
    a.needsUpdate = true
    const n = Math.max(U.uGlow.value * (1 - U.uRain.value * 0.7), 0)
    mat.opacity = n * (0.75 + Math.sin(t * 2.3) * 0.25)
    mat.color.setRGB(1.6 * n + 0.2, 1.5 * n + 0.2, 0.7 * n + 0.1)
    ref.current.visible = n > 0.02
  })
  return <points ref={ref} geometry={geo} material={mat} />
}
