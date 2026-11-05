import { useMemo } from 'react'
import * as THREE from 'three'
import { GRAD, rng, windify } from '../core/env'
import { Instanced } from '../core/primitives'
import { STREAM_Z, height, pathX } from '../../world/terrain'

export function Trees({ avoid }) {
  const { trunks, blobs, blossoms } = useMemo(() => {
    const g = rng(19)
    const trees = []
    let guard = 0
    while (trees.length < 120 && guard++ < 6000) {
      const x = (g() - 0.5) * 110
      const z = -82 + g() * 132
      if (Math.abs(x - pathX(z)) < 4.8 || Math.abs(z - STREAM_Z) < 3 || avoid(x, z, 3)) continue
      trees.push({ x, z, y: height(x, z), s: 0.8 + g() * 0.9, bloom: g() < 0.12 })
    }
    const leaf = ['#3c7a36', '#4d8c3e', '#2f6833', '#5d9c46', '#6fa84c']
    const pink = ['#f3b4c4', '#f7c8d4', '#eaa0b6']
    const trunks = trees.map((t) => ({ p: [t.x, t.y + 1.15 * t.s, t.z], s: t.s, r: g() * 6, rz: (g() - 0.5) * 0.12, color: '#6a4a33' }))
    const blobs = []
    const blossoms = []
    trees.forEach((t) => {
      const n = 5
      for (let j = 0; j < n; j++) {
        const a = (j / n) * Math.PI * 2 + g()
        const top = j === n - 1
        const r = top ? 0 : 0.9 * t.s
        const it = {
          p: [t.x + Math.cos(a) * r, t.y + (top ? 3.6 : 2.5 + g() * 0.7) * t.s, t.z + Math.sin(a) * r],
          s: [(1.15 + g() * 0.35) * t.s, (1.0 + g() * 0.3) * t.s, (1.15 + g() * 0.35) * t.s],
          r: g() * 6,
          color: t.bloom ? pink[Math.floor(g() * 3)] : leaf[Math.floor(g() * 5)]
        }
        ;(t.bloom ? blossoms : blobs).push(it)
      }
    })
    return { trunks, blobs, blossoms }
  }, [avoid])
  const trunkGeo = useMemo(() => {
    const pts = [
      [0.34, -1.2],
      [0.24, -1.0],
      [0.19, -0.4],
      [0.16, 0.4],
      [0.12, 1.1]
    ].map(([r, y]) => new THREE.Vector2(r, y))
    return new THREE.LatheGeometry(pts, 8)
  }, [])
  const blobGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 2), [])
  const trunkMat = useMemo(() => new THREE.MeshToonMaterial({ gradientMap: GRAD }), [])
  const leafMat = useMemo(() => windify(new THREE.MeshToonMaterial({ gradientMap: GRAD }), 0.07), [])
  return (
    <>
      <Instanced items={trunks} geometry={trunkGeo} material={trunkMat} castShadow />
      <Instanced items={blobs} geometry={blobGeo} material={leafMat} castShadow receiveShadow />
      {blossoms.length > 0 && <Instanced items={blossoms} geometry={blobGeo} material={leafMat} castShadow receiveShadow />}
    </>
  )
}
