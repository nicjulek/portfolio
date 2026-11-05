import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GEO } from './parts/geometries'
import { WOOD } from './parts/palette'
import { GRAD, U } from '../core/env'
import { toon } from '../core/materials'
import { G, RB, tube } from '../core/primitives'

export function Clothesline() {
  const sheets = useRef()
  const { rope, pts } = useMemo(() => {
    const c = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-2.4, 2.25, 0), new THREE.Vector3(0, 1.75, 0), new THREE.Vector3(2.4, 2.25, 0))
    return { rope: new THREE.TubeGeometry(c, 30, 0.014, 6), pts: [0.15, 0.3, 0.45, 0.6, 0.75, 0.88].map((t) => c.getPoint(t)) }
  }, [])
  const arts = useMemo(
    () =>
      ['#86b8c9', '#e7a35a', '#9cc46a', '#d98aa0', '#7f8fd6', '#e9c34a'].map((col, i) => {
        const c = document.createElement('canvas')
        c.width = 96
        c.height = 128
        const x = c.getContext('2d')
        x.fillStyle = '#fbf3e2'
        x.fillRect(0, 0, 96, 128)
        x.fillStyle = col
        x.globalAlpha = 0.9
        x.beginPath()
        if (i % 3 === 0) x.arc(48, 60, 28, 0, Math.PI * 2)
        else if (i % 3 === 1) {
          x.moveTo(14, 100)
          x.quadraticCurveTo(48, 10, 82, 100)
        } else x.ellipse(48, 64, 30, 20, 0.5, 0, Math.PI * 2)
        x.fill()
        x.globalAlpha = 1
        x.strokeStyle = '#2f3a2c'
        x.lineWidth = 3
        x.beginPath()
        x.moveTo(20, 110)
        x.bezierCurveTo(40, 96, 60, 120, 78, 104)
        x.stroke()
        const t = new THREE.CanvasTexture(c)
        t.colorSpace = THREE.SRGBColorSpace
        return new THREE.MeshToonMaterial({ map: t, gradientMap: GRAD, side: THREE.DoubleSide })
      }),
    []
  )
  const sheetGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.6, 0.8, 4, 6)
    g.translate(0, -0.4, 0)
    return g
  }, [])
  useFrame(() => {
    const t = U.uTime.value
    sheets.current.children.forEach((c, i) => {
      c.rotation.x = Math.sin(t * 1.7 + i * 0.8) * 0.22 * U.uWind.value + 0.08
      c.rotation.y = Math.sin(t * 0.9 + i) * 0.08
    })
  })
  const post = useMemo(() => tube([[0, 0, 0], [0, 1.6, 0], [0.05, 2.3, 0], [0.2, 2.45, 0]], 0.06), [])
  return (
    <>
      <mesh geometry={post} position={[-2.45, 0, 0]} rotation={[0, Math.PI, 0]} material={toon(WOOD)} castShadow />
      <mesh geometry={post} position={[2.45, 0, 0]} material={toon(WOOD)} castShadow />
      <mesh geometry={rope} material={toon('#efe6d6')} />
      <group ref={sheets}>
        {pts.map((p, i) => (
          <group key={i} position={p}>
            <mesh geometry={sheetGeo} material={arts[i]} castShadow />
            <RB a={[0.05, 0.12, 0.05]} p={[-0.2, 0, 0]} c="#c9a774" rad={0.015} />
            <RB a={[0.05, 0.12, 0.05]} p={[0.2, 0, 0]} c="#c9a774" rad={0.015} />
          </group>
        ))}
      </group>
      <G geo={GEO.barrel} p={[1.4, 0, 1]} s={[1, 0.45, 1]} c="#c9a774" />
    </>
  )
}
