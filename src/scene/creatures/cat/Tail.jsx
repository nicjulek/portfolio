import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U } from '../../core/env'
import { Furry } from './Furry'
import { BLACK } from './markings'

export const TAIL_N = 40

export const TAIL_R = 10

export function tailCurve(t, phase, amp) {
  const pts = [
    [0.0, 0.05, -0.15],
    [0.07, 0.022, -0.17],
    [0.125, 0.016, -0.1],
    [0.135, 0.016, 0.0],
    [0.1, 0.018 + amp * 0.02, 0.085 + Math.sin(phase) * 0.012 * amp],
    [0.055 + Math.sin(phase) * 0.03 * amp, 0.03 + amp * 0.045, 0.12 + Math.cos(phase * 0.8) * 0.02 * amp]
  ].map((p) => new THREE.Vector3(...p))
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal')
}

export function Tail({ wag }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const verts = (TAIL_N + 1) * TAIL_R + 1
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts * 3), 3))
    g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(verts * 3), 3))
    const col = new Float32Array(verts * 3)
    for (let i = 0; i < verts; i++) BLACK.toArray(col, i * 3)
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const idx = []
    for (let i = 0; i < TAIL_N; i++)
      for (let j = 0; j < TAIL_R; j++) {
        const a = i * TAIL_R + j
        const b = i * TAIL_R + ((j + 1) % TAIL_R)
        const c = a + TAIL_R
        const d = b + TAIL_R
        idx.push(a, c, b, b, c, d)
      }
    const tip = (TAIL_N + 1) * TAIL_R
    for (let j = 0; j < TAIL_R; j++) idx.push(TAIL_N * TAIL_R + j, tip, TAIL_N * TAIL_R + ((j + 1) % TAIL_R))
    g.setIndex(idx)
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0.05, 0.03, -0.03), 0.3)
    return g
  }, [])
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), n: new THREE.Vector3(), b: new THREE.Vector3(), v: new THREE.Vector3() }), [])
  useFrame(() => {
    const t = U.uTime.value
    const amp = 0.4 + wag.current * 0.9
    const curve = tailCurve(t, t * (1.6 + wag.current * 3), amp)
    const fr = curve.computeFrenetFrames(TAIL_N, false)
    const pos = geo.attributes.position
    const nor = geo.attributes.normal
    for (let i = 0; i <= TAIL_N; i++) {
      const u = i / TAIL_N
      curve.getPointAt(u, tmp.p)
      const r = 0.021 * (1 - u * 0.45) * (u > 0.92 ? Math.sqrt(1 - (u - 0.92) / 0.08) * 0.9 + 0.1 : 1)
      for (let j = 0; j < TAIL_R; j++) {
        const a = (j / TAIL_R) * Math.PI * 2
        tmp.v.copy(fr.normals[i]).multiplyScalar(Math.cos(a)).addScaledVector(fr.binormals[i], Math.sin(a))
        nor.setXYZ(i * TAIL_R + j, tmp.v.x, tmp.v.y, tmp.v.z)
        pos.setXYZ(i * TAIL_R + j, tmp.p.x + tmp.v.x * r, tmp.p.y + tmp.v.y * r, tmp.p.z + tmp.v.z * r)
      }
    }
    curve.getPointAt(1, tmp.p)
    tmp.n.copy(fr.tangents[TAIL_N])
    pos.setXYZ((TAIL_N + 1) * TAIL_R, tmp.p.x + tmp.n.x * 0.004, tmp.p.y + tmp.n.y * 0.004, tmp.p.z + tmp.n.z * 0.004)
    nor.setXYZ((TAIL_N + 1) * TAIL_R, tmp.n.x, tmp.n.y, tmp.n.z)
    pos.needsUpdate = true
    nor.needsUpdate = true
  })
  return <Furry geometry={geo} len={0.009} density={650} shells={12} />
}
