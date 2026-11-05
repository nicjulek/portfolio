import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import * as THREE from 'three'
import { GRAD, rng, windify } from '../core/env'

const UP = new THREE.Vector3(0, 1, 0)

const LEAF = (() => {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.22, 0.25, 0.2, 0.7, 0, 1)
  s.bezierCurveTo(-0.2, 0.7, -0.22, 0.25, 0, 0)
  return s
})()

const PETAL = (() => {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(0.5, 0.2, 0.45, 0.9, 0, 1)
  s.bezierCurveTo(-0.45, 0.9, -0.5, 0.2, 0, 0)
  return s
})()

export const PLANT_MAT = windify(new THREE.MeshToonMaterial({ vertexColors: true, gradientMap: GRAD, side: THREE.DoubleSide }), 0.06, 'position.y * 2.5')

function colored(g, hex) {
  const c = new THREE.Color(hex)
  const n = g.attributes.position.count
  const a = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) c.toArray(a, i * 3)
  g.setAttribute('color', new THREE.BufferAttribute(a, 3))
  return g
}

const cache = new Map()

export function plantGeo(kind = 'flower', seed = 1, color = '#f4a6b8') {
  const key = `${kind}|${seed}|${color}`
  if (cache.has(key)) return cache.get(key)
  const r = rng(Math.abs(Math.round(seed)) * 97 + 13)
  const parts = []
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const tw = new THREE.Quaternion()
  const v = new THREE.Vector3()
  const sc = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const put = (g, pos, d, twist, scale, hex) => {
    q.setFromUnitVectors(UP, d.clone().normalize())
    tw.setFromAxisAngle(UP, twist)
    q.multiply(tw)
    m.compose(v.copy(pos), q, sc.set(...scale))
    g.applyMatrix4(m)
    parts.push(colored(g, hex))
  }
  const greens = kind === 'herb' ? ['#7cbf4e', '#94cf62', '#6aae42'] : ['#4f8f3a', '#5f9e44', '#3f7d33']
  const leafGeo = () => new THREE.ShapeGeometry(LEAF, 5)

  if (kind === 'flower') {
    const stems = 4 + Math.floor(r() * 2)
    for (let i = 0; i < stems; i++) {
      const yaw = (i / stems) * Math.PI * 2 + r() * 0.7
      const lean = 0.12 + r() * 0.35
      const h = 0.26 + r() * 0.14
      dir.set(Math.sin(lean) * Math.cos(yaw), Math.cos(lean), Math.sin(lean) * Math.sin(yaw))
      const stem = new THREE.CylinderGeometry(0.006, 0.009, h, 5)
      stem.translate(0, h / 2, 0)
      put(stem, new THREE.Vector3(), dir, 0, [1, 1, 1], '#4d8a37')
      for (let k = 0; k < 2; k++) {
        const t = 0.25 + k * 0.3
        const at = dir.clone().multiplyScalar(h * t)
        const ly = yaw + (k ? 2.2 : -0.6) + r() * 0.5
        const ld = new THREE.Vector3(Math.cos(ly) * 0.9, 0.55, Math.sin(ly) * 0.9)
        put(leafGeo(), at, ld, r() * 3, [0.07, 0.11, 0.07], greens[Math.floor(r() * 3)])
      }
      const tip = dir.clone().multiplyScalar(h)
      const center = new THREE.SphereGeometry(0.018, 8, 6)
      put(center, tip, dir, 0, [1, 0.7, 1], '#f2c443')
      const petals = 5 + Math.floor(r() * 2)
      for (let k = 0; k < petals; k++) {
        const a = (k / petals) * Math.PI * 2
        const pd = new THREE.Vector3(Math.cos(a), 0.35, Math.sin(a)).applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP, dir))
        const pc = i % 2 && color !== '#ffffff' ? new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.35).getHexString() : color.replace('#', '')
        put(new THREE.ShapeGeometry(PETAL, 4), tip, pd, Math.PI / 2, [0.05, 0.055, 0.05], '#' + pc)
      }
    }
    for (let i = 0; i < 6; i++) {
      const yaw = (i / 6) * Math.PI * 2 + r()
      put(leafGeo(), new THREE.Vector3(), new THREE.Vector3(Math.cos(yaw), 0.7, Math.sin(yaw)), r() * 3, [0.09, 0.14, 0.09], greens[i % 3])
    }
  } else {
    const n = kind === 'bush' ? 26 : kind === 'fern' ? 12 : 14
    for (let i = 0; i < n; i++) {
      const yaw = (i / n) * Math.PI * 2 * (kind === 'bush' ? 3 : 1) + r() * 0.6
      const up = kind === 'fern' ? 0.5 + r() * 0.6 : kind === 'herb' ? 0.4 + r() * 1.2 : 0.3 + r() * 1.8
      const base = kind === 'bush' ? new THREE.Vector3(Math.cos(yaw) * 0.04, r() * 0.18, Math.sin(yaw) * 0.04) : new THREE.Vector3()
      const len = kind === 'fern' ? 0.32 + r() * 0.12 : kind === 'herb' ? 0.14 + r() * 0.06 : 0.12 + r() * 0.06
      const wid = kind === 'fern' ? 0.06 : kind === 'herb' ? 0.13 : 0.08
      put(leafGeo(), base, new THREE.Vector3(Math.cos(yaw), up, Math.sin(yaw)), r() * 3, [wid / 0.44, len, wid / 0.44], greens[Math.floor(r() * 3)])
    }
    if (kind === 'bush') {
      for (let i = 0; i < 5; i++) {
        const a = r() * Math.PI * 2
        const b = new THREE.SphereGeometry(0.02, 6, 5)
        put(b, new THREE.Vector3(Math.cos(a) * 0.1, 0.12 + r() * 0.1, Math.sin(a) * 0.1), UP, 0, [1, 1, 1], color)
      }
    }
  }
  const g = mergeGeometries(parts.map((p) => (p.index ? p.toNonIndexed() : p)))
  g.computeBoundingSphere()
  cache.set(key, g)
  return g
}

export function Plant({ p, s = 1, kind = 'flower', seed = 1, color = '#f4a6b8', r = 0 }) {
  return <mesh geometry={plantGeo(kind, seed, color)} material={PLANT_MAT} position={p} rotation={[0, r, 0]} scale={s} castShadow />
}
