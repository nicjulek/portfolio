import { useMemo } from 'react'
import * as THREE from 'three'
import { U, rng } from '../core/env'
import { STREAM_Z, height, pathX } from '../../world/terrain'

const vert = `
attribute vec3 aOffset;
attribute vec4 aParams;
uniform float uTime; uniform float uWind; uniform vec3 uPlayer;
varying float vH; varying float vVar; varying float vFogDepth; varying vec3 vN;
void main() {
  float t = position.y;
  float hgt = aParams.x;
  vec3 p = vec3(position.x * aParams.w, position.y * hgt, 0.0);
  float c = cos(aParams.y), s = sin(aParams.y);
  p.xz = mat2(c, -s, s, c) * p.xz;
  vec3 w = aOffset + p;
  float gust = sin(uTime * 0.45 + aOffset.x * 0.05 + aOffset.z * 0.08) * 0.5 + 0.5;
  float wave = sin(uTime * 1.9 + aOffset.x * 0.42 + aOffset.z * 0.31 + aParams.z * 3.0) * 0.55
             + sin(uTime * 3.3 + aOffset.x * 1.7 + aOffset.z * 0.9) * 0.18;
  vec2 dir = normalize(vec2(1.0, 0.4));
  float bend = (0.18 + wave * 0.22 + gust * 0.35) * uWind * t * t * hgt;
  w.xz += dir * bend;
  w.y -= bend * bend * 0.35;
  vec2 dp = w.xz - uPlayer.xz;
  float dist = length(dp);
  float push = smoothstep(1.8, 0.2, dist) * t * t;
  w.xz += normalize(dp + 0.0001) * push * 0.55;
  w.y -= push * 0.3 * hgt;
  vH = t;
  vVar = aParams.z;
  vN = normalize(vec3(-s, 0.6, c));
  vec4 mv = viewMatrix * vec4(w, 1.0);
  vFogDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`

const frag = `
uniform vec3 uLightColor; uniform vec3 uLightDir; uniform vec3 uHemiSky; uniform vec3 uHemiGround;
uniform vec3 uFogColor; uniform float uFogNear; uniform float uFogFar; uniform float uDay; uniform float uNight;
varying float vH; varying float vVar; varying float vFogDepth; varying vec3 vN;
void main() {
  vec3 base = mix(vec3(0.025, 0.07, 0.012), vec3(0.045, 0.1, 0.018), vVar);
  vec3 tip = mix(vec3(0.2, 0.36, 0.05), vec3(0.34, 0.44, 0.09), vVar);
  vec3 albedo = mix(base, tip, smoothstep(0.0, 1.0, vH));
  float ndl = clamp(dot(normalize(vN), uLightDir) * 0.5 + 0.5, 0.0, 1.0);
  vec3 amb = mix(uHemiGround, uHemiSky, 0.35 + vH * 0.5) * 0.55;
  vec3 lit = albedo * (amb + uLightColor * ndl * (0.35 + 0.75 * uDay) * mix(0.55, 1.0, vH));
  lit += uLightColor * pow(vH, 3.0) * 0.05 * uDay;
  gl_FragColor = vec4(lit, 1.0);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, smoothstep(uFogNear, uFogFar, vFogDepth));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

function blade() {
  const g = new THREE.InstancedBufferGeometry()
  const ys = [0, 0.3, 0.58, 0.82, 1]
  const ws = [1, 0.85, 0.62, 0.36, 0]
  const pos = []
  ys.forEach((y, i) => {
    if (i === ys.length - 1) pos.push(0, y, 0)
    else pos.push(-0.5 * ws[i], y, 0, 0.5 * ws[i], y, 0)
  })
  const idx = []
  for (let i = 0; i < 3; i++) {
    const a = i * 2
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  idx.push(6, 7, 8)
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  return g
}

// a grama e dividida em faixas ao longo da trilha (eixo z). Cada faixa tem a
// propria esfera envolvente, entao o que fica atras da camera nem vai para a GPU.
const Z0 = -70
const Z_LEN = 118
const BAND = 10
// folga para a altura da lamina, o vento (inclusive na chuva) e o empurrao do jogador
const PAD = 2

export function Grass({ count = 60000, avoid }) {
  const geos = useMemo(() => {
    const base = blade()
    const r = rng(12)
    const bands = Array.from({ length: Math.ceil(Z_LEN / BAND) }, () => ({ off: [], par: [] }))
    let n = 0
    let guard = 0
    while (n < count && guard++ < count * 6) {
      const z = Z0 + r() * Z_LEN
      const side = r() < 0.5 ? -1 : 1
      const dist = 1.15 + Math.pow(r(), 1.6) * 34
      const x = pathX(z) + side * dist
      if (Math.abs(z - STREAM_Z) < 1.5) continue
      if (avoid(x, z)) continue
      if (dist > 14 && r() < 0.45) continue
      const b = bands[Math.min(bands.length - 1, Math.floor((z - Z0) / BAND))]
      b.off.push(x, height(x, z) - 0.02, z)
      const edge = dist < 1.9 ? 0.55 : 1
      b.par.push((0.35 + r() * 0.55) * edge, r() * Math.PI * 2, r(), 0.07 + r() * 0.06)
      n++
    }
    const box = new THREE.Box3()
    const v = new THREE.Vector3()
    return bands
      .filter((b) => b.off.length > 0)
      .map((b) => {
        const g = new THREE.InstancedBufferGeometry()
        // a lamina em si e compartilhada; so os dados por instancia mudam
        g.setAttribute('position', base.attributes.position)
        g.setIndex(base.index)
        const off = new Float32Array(b.off)
        g.setAttribute('aOffset', new THREE.InstancedBufferAttribute(off, 3))
        g.setAttribute('aParams', new THREE.InstancedBufferAttribute(new Float32Array(b.par), 4))
        g.instanceCount = off.length / 3
        box.makeEmpty()
        for (let i = 0; i < off.length; i += 3) box.expandByPoint(v.fromArray(off, i))
        box.expandByScalar(PAD)
        g.boundingBox = box.clone()
        g.boundingSphere = box.getBoundingSphere(new THREE.Sphere())
        return g
      })
  }, [count, avoid])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          uTime: U.uTime,
          uWind: U.uWind,
          uPlayer: U.uPlayer,
          uLightColor: U.uLightColor,
          uLightDir: U.uLightDir,
          uHemiSky: U.uHemiSky,
          uHemiGround: U.uHemiGround,
          uFogColor: U.uFogColor,
          uFogNear: U.uFogNear,
          uFogFar: U.uFogFar,
          uDay: U.uDay,
          uNight: U.uNight
        },
        vertexShader: vert,
        fragmentShader: frag
      }),
    []
  )
  return geos.map((g, i) => <mesh key={`${count}-${i}`} geometry={g} material={mat} />)
}
