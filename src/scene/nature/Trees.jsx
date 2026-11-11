import { useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { GRAD, rng, windify } from '../core/env'
import { Instanced } from '../core/primitives'
import { TREES, useTier } from '../core/quality'
import { STREAM_Z, height, pathX } from '../../world/terrain'

// as arvores sao agrupadas em blocos deste tamanho (m): cada bloco tem a propria
// esfera envolvente, entao o que esta fora da camera (ou da sombra) nem e desenhado
const CHUNK = 28

const LEAF = ['#3c7a36', '#4d8c3e', '#2f6833', '#5d9c46', '#6fa84c']
const PINE = ['#2d5e3a', '#335f34', '#28543a', '#3b6b3c']
const PINK = ['#f3b4c4', '#f7c8d4', '#eaa0b6']

// sombreamento "assado" nos vertices: base da copa mais escura, topo mais claro
function shadeByHeight(g, lo, hi, dark = 0.6, light = 1.08) {
  const p = g.attributes.position
  const col = new Float32Array(p.count * 3)
  for (let i = 0; i < p.count; i++) {
    const t = THREE.MathUtils.clamp((p.getY(i) - lo) / (hi - lo), 0, 1)
    const v = dark + (light - dark) * t * t * (3 - 2 * t)
    col.set([v, v, v], i * 3)
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  return g
}

// copa arredondada e irregular: icosaedro amassado com ruido suave
function crownGeometry(detail) {
  let g = new THREE.IcosahedronGeometry(1, detail)
  g.deleteAttribute('normal')
  g.deleteAttribute('uv')
  g = mergeVertices(g)
  const p = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const n = Math.sin(v.x * 3.1 + v.y * 1.7) * Math.cos(v.z * 2.7 - v.y * 1.3) * 0.11 + Math.sin(v.x * 5.3 + v.z * 4.1) * 0.04
    v.multiplyScalar(1 + n)
    if (v.y < 0) v.y *= 0.82 // base levemente achatada, como uma copa de verdade
    p.setXYZ(i, v.x, v.y, v.z)
  }
  g.computeVertexNormals()
  return shadeByHeight(g, -0.85, 1)
}

// pinheiro: tres "saias" de cone empilhadas, com a borda ondulada
function pineGeometry(radial) {
  const tiers = [
    { r: 1, h: 1.05, y: -0.45 },
    { r: 0.78, h: 0.95, y: 0.12 },
    { r: 0.52, h: 0.8, y: 0.62 }
  ]
  const parts = tiers.map(({ r, h, y }, k) => {
    const c = new THREE.ConeGeometry(r, h, radial, 1, false)
    c.deleteAttribute('uv')
    const p = c.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i)
      const z = p.getZ(i)
      if (p.getY(i) < 0 && Math.hypot(x, z) > 0.01) {
        const a = Math.atan2(z, x)
        const s = 1 + Math.sin(a * 3 + k * 1.7) * 0.07
        p.setXYZ(i, x * s, p.getY(i) - Math.abs(Math.sin(a * radial * 0.5)) * 0.06, z * s)
      }
    }
    c.translate(0, y, 0)
    shadeByHeight(c, y - h / 2, y + h / 2, 0.58 + k * 0.06, 1.05 + k * 0.04)
    return c
  })
  const g = mergeGeometries(parts)
  g.computeVertexNormals()
  return g
}

function trunkGeometry() {
  const pts = [
    [0.36, -1.2],
    [0.25, -1.02],
    [0.19, -0.45],
    [0.16, 0.35],
    [0.12, 1.1]
  ].map(([r, y]) => new THREE.Vector2(r, y))
  const g = new THREE.LatheGeometry(pts, 7)
  g.deleteAttribute('uv')
  return shadeByHeight(g, -1.2, 1.1, 0.7, 1.05)
}

// gera todas as arvores uma vez, sempre na mesma ordem: niveis mais leves usam
// so as primeiras N, entao a paisagem nao "pula" quando a qualidade muda
function plant(avoid) {
  const g = rng(19)
  const trees = []
  let guard = 0
  while (trees.length < 120 && guard++ < 6000) {
    const x = (g() - 0.5) * 110
    const z = -82 + g() * 132
    if (Math.abs(x - pathX(z)) < 4.8 || Math.abs(z - STREAM_Z) < 3 || avoid(x, z, 3)) continue
    const roll = g()
    trees.push({
      x,
      z,
      y: height(x, z),
      s: 0.8 + g() * 0.9,
      kind: roll < 0.12 ? 'bloom' : roll < 0.4 ? 'pine' : 'round',
      lx: (g() - 0.5) * 0.1,
      lz: (g() - 0.5) * 0.1,
      hue: g(),
      seed: g()
    })
  }
  return trees
}

function build(tree, g, out) {
  const { x, y, z, s, kind, lx, lz } = tree
  // inclinacao: desloca a copa para acompanhar o tronco torto
  const lean = (h) => [x - Math.sin(lz) * h, z + Math.sin(lx) * h]
  const trunkS = kind === 'pine' ? [0.75 * s, s, 0.75 * s] : [s, s, s]
  out.trunks.push({ p: [x, y + 1.15 * s, z], s: trunkS, r: g() * 6, rx: lx, rz: lz, color: '#6a4a33' })

  if (kind === 'pine') {
    const hgt = 2.4 * s
    const [px, pz] = lean(hgt)
    const sx = (1.25 + g() * 0.25) * s
    out.pines.push({ p: [px, y + hgt, pz], s: [sx, (1.8 + g() * 0.35) * s, sx], r: g() * 6, rx: lx, rz: lz, color: PINE[Math.floor(tree.hue * PINE.length)] })
    return
  }

  // copa redonda: uma bola grande no alto e 4-5 menores ao redor, todas do mesmo
  // tom base com pequenas variacoes, para cada arvore parecer uma coisa so
  const palette = kind === 'bloom' ? PINK : LEAF
  const tone = new THREE.Color(palette[Math.floor(tree.hue * palette.length)])
  const n = 4 + Math.floor(tree.seed * 2)
  for (let j = 0; j <= n; j++) {
    const top = j === n
    const a = (j / n) * Math.PI * 2 + g()
    const r = top ? 0.15 * s : (0.85 + g() * 0.2) * s
    const h = (top ? 3.55 : 2.45 + g() * 0.6) * s
    const [cx, cz] = lean(h)
    const k = top ? 1.25 : 1.0 + g() * 0.3
    const c = tone.clone().offsetHSL((g() - 0.5) * 0.03, (g() - 0.5) * 0.08, (g() - 0.5) * 0.06 + (top ? 0.03 : 0))
    out.crowns.push({
      p: [cx + Math.cos(a) * r, y + h, cz + Math.sin(a) * r],
      s: [k * s, k * (0.85 + g() * 0.2) * s, k * s],
      r: g() * 6,
      color: '#' + c.getHexString()
    })
  }
}

export function Trees({ avoid }) {
  const tier = useTier()
  const cfg = TREES[tier]
  const all = useMemo(() => plant(avoid), [avoid])

  const chunks = useMemo(() => {
    const g = rng(7)
    const map = new Map()
    all.slice(0, cfg.count).forEach((t) => {
      const key = `${Math.floor(t.x / CHUNK)},${Math.floor(t.z / CHUNK)}`
      if (!map.has(key)) map.set(key, { key, trunks: [], crowns: [], pines: [] })
      build(t, g, map.get(key))
    })
    return [...map.values()]
  }, [all, cfg.count])

  const geo = useMemo(
    () => ({ trunk: trunkGeometry(), crown: crownGeometry(cfg.detail), pine: pineGeometry(cfg.detail > 1 ? 9 : 7) }),
    [cfg.detail]
  )
  const mats = useMemo(() => {
    const m = (wind) => {
      const mat = new THREE.MeshToonMaterial({ gradientMap: GRAD, vertexColors: true })
      return wind ? windify(mat, wind) : mat
    }
    return { trunk: m(0), leaf: m(0.07), pine: m(0.035) }
  }, [])

  const shadow = cfg.shadow
  return chunks.map((c) => (
    <group key={`${c.key}-${tier}`}>
      <Instanced items={c.trunks} geometry={geo.trunk} material={mats.trunk} castShadow={shadow} receiveShadow={shadow} />
      {c.crowns.length > 0 && <Instanced items={c.crowns} geometry={geo.crown} material={mats.leaf} castShadow={shadow} receiveShadow={shadow} />}
      {c.pines.length > 0 && <Instanced items={c.pines} geometry={geo.pine} material={mats.pine} castShadow={shadow} receiveShadow={shadow} />}
    </group>
  ))
}
