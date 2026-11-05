import { useLayoutEffect, useRef } from 'react'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { toon } from './materials'

export function RB({ a, p, r, c, rad = 0.05, mat }) {
  return (
    <RoundedBox args={a} radius={rad} smoothness={3} position={p} rotation={r} material={mat || toon(c)} castShadow receiveShadow />
  )
}

export function G({ geo, p, r, s, c, mat, shadow = true }) {
  return <mesh geometry={geo} position={p} rotation={r} scale={s} material={mat || toon(c)} castShadow={shadow} receiveShadow={shadow} />
}

export const lathe = (pts, seg = 20) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg)

export function tube(points, r = 0.03, seg = 40) {
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), seg, r, 8)
}

export function Instanced({ items, geometry, material, castShadow, receiveShadow }) {
  const ref = useRef()
  useLayoutEffect(() => {
    const m = new THREE.Object3D()
    const c = new THREE.Color()
    items.forEach((it, i) => {
      m.position.set(...it.p)
      m.rotation.set(it.rx || 0, it.r || 0, it.rz || 0)
      m.scale.set(...(Array.isArray(it.s) ? it.s : [it.s, it.s, it.s]))
      m.updateMatrix()
      ref.current.setMatrixAt(i, m.matrix)
      if (it.color) ref.current.setColorAt(i, c.set(it.color))
    })
    ref.current.instanceMatrix.needsUpdate = true
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true
    ref.current.computeBoundingSphere()
  }, [items])
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow={castShadow} receiveShadow={receiveShadow} />
}
