import { useMemo } from 'react'
import * as THREE from 'three'
import { EYE, EYE_POS } from './sdf'

export function irisTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const x = c.getContext('2d')
  const g = x.createRadialGradient(128, 128, 10, 128, 128, 128)
  g.addColorStop(0, '#9c8a1c')
  g.addColorStop(0.35, '#d9c13e')
  g.addColorStop(0.75, '#c7a92c')
  g.addColorStop(0.93, '#7d6a19')
  g.addColorStop(1, '#3a3010')
  x.fillStyle = g
  x.fillRect(0, 0, 256, 256)
  x.globalAlpha = 0.25
  for (let i = 0; i < 180; i++) {
    const a = Math.random() * Math.PI * 2
    const r0 = 30 + Math.random() * 30
    const r1 = 90 + Math.random() * 30
    x.strokeStyle = Math.random() > 0.5 ? '#f1df74' : '#6e5c14'
    x.lineWidth = 1 + Math.random() * 2
    x.beginPath()
    x.moveTo(128 + Math.cos(a) * r0, 128 + Math.sin(a) * r0)
    x.lineTo(128 + Math.cos(a) * r1, 128 + Math.sin(a) * r1)
    x.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function Eye({ side, eyeRef }) {
  const mats = useMemo(() => {
    const iris = new THREE.MeshStandardMaterial({ map: irisTexture(), roughness: 0.4, emissive: '#c9b030', emissiveIntensity: 0.12 })
    const pupil = new THREE.MeshBasicMaterial({ color: '#050405' })
    const cornea = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transparent: true, opacity: 0.18, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, depthWrite: false })
    return { iris, pupil, cornea }
  }, [])
  const geos = useMemo(
    () => ({
      iris: new THREE.SphereGeometry(EYE, 32, 24),
      pupil: new THREE.CircleGeometry(EYE * 0.85, 32),
      cornea: new THREE.SphereGeometry(EYE * 1.04, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.42),
      spec: new THREE.SphereGeometry(EYE * 0.14, 10, 8)
    }),
    []
  )
  return (
    <group position={[side * EYE_POS[0], EYE_POS[1], EYE_POS[2]]} rotation={[0.05, side * 0.38, side * -0.16]}>
      <group ref={eyeRef} scale={[1, 0.82, 1]}>
        <mesh geometry={geos.iris} material={mats.iris} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={geos.pupil} material={mats.pupil} position={[0, 0, EYE * 1.0]} scale={[0.16, 1, 1]} name="pupil" />
        <mesh geometry={geos.cornea} material={mats.cornea} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={geos.spec} position={[side * -0.003, 0.0035, EYE * 1.02]}>
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  )
}
