import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { toon } from '../core/materials'

export const SPH = new THREE.SphereGeometry(1, 20, 14)

export function B({ p, s, c, r, mat, shadow = true }) {
  return <mesh geometry={SPH} position={p} scale={s} rotation={r} material={mat || toon(c)} castShadow={shadow} receiveShadow={shadow} />
}

export const HEART = (() => {
  const s = new THREE.Shape()
  s.moveTo(0, -0.5)
  s.bezierCurveTo(-0.1, -0.35, -0.5, -0.1, -0.5, 0.15)
  s.bezierCurveTo(-0.5, 0.45, -0.1, 0.5, 0, 0.25)
  s.bezierCurveTo(0.1, 0.5, 0.5, 0.45, 0.5, 0.15)
  s.bezierCurveTo(0.5, -0.1, 0.1, -0.35, 0, -0.5)
  return new THREE.ShapeGeometry(s, 10)
})()

export function Hearts({ trigger, y = 0.7 }) {
  const ref = useRef()
  const k = useRef(1)
  const last = useRef(trigger)
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ff7f9a', transparent: true, side: THREE.DoubleSide, depthWrite: false }), [])
  useFrame(({ camera }, dt) => {
    if (trigger !== last.current) {
      last.current = trigger
      k.current = 0
    }
    k.current = Math.min(1, k.current + dt * 0.7)
    ref.current.visible = k.current < 1
    mat.opacity = 1 - k.current
    ref.current.children.forEach((h, i) => {
      const d = k.current
      h.position.set(Math.sin(i * 2.1 + d * 4) * 0.15 * (i - 1), y + d * (0.5 + i * 0.15), 0)
      h.scale.setScalar(0.07 + 0.03 * Math.sin(d * 3.14))
      h.quaternion.copy(camera.quaternion)
    })
  })
  return (
    <group ref={ref}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} geometry={HEART} material={mat} />
      ))}
    </group>
  )
}

export function Bubble({ text, y }) {
  if (!text) return null
  return (
    <Html position={[0, y, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div className="bubble small" key={text}>
        {text}
      </div>
    </Html>
  )
}

export function useHover() {
  const [h, set] = useState(false)
  return [
    h,
    {
      onPointerOver: (e) => {
        e.stopPropagation()
        set(true)
        document.body.style.cursor = 'pointer'
      },
      onPointerOut: () => {
        set(false)
        document.body.style.cursor = ''
      }
    }
  ]
}
