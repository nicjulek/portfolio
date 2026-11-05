import * as THREE from 'three'

export const U = {
  uTime: { value: 0 },
  uSunDir: { value: new THREE.Vector3(0.4, 0.8, -0.3) },
  uMoonDir: { value: new THREE.Vector3(-0.4, 0.6, 0.3) },
  uLightDir: { value: new THREE.Vector3(0.4, 0.8, -0.3) },
  uLightColor: { value: new THREE.Color() },
  uSkyTop: { value: new THREE.Color() },
  uHorizon: { value: new THREE.Color() },
  uHemiSky: { value: new THREE.Color() },
  uHemiGround: { value: new THREE.Color() },
  uFogColor: { value: new THREE.Color() },
  uFogNear: { value: 30 },
  uFogFar: { value: 120 },
  uDay: { value: 1 },
  uNight: { value: 0 },
  uGlow: { value: 0 },
  uRain: { value: 0 },
  uWind: { value: 1 },
  uPlayer: { value: new THREE.Vector3() }
}

export const LIVE = { lightIntensity: 2, hemiIntensity: 1 }

const C = (h) => new THREE.Color(h)

const DAY = {
  top: C('#4f9ee0'),
  horizon: C('#f2ead2'),
  fog: C('#dfe6dc'),
  light: C('#fff0d6'),
  hemiSky: C('#dcecff'),
  hemiGround: C('#6e8f4c'),
  li: 2.6,
  hi: 1.05,
  near: 40,
  far: 135
}

const GOLD = {
  top: C('#5d73b5'),
  horizon: C('#ffb072'),
  fog: C('#f1bf96'),
  light: C('#ff9550'),
  hemiSky: C('#ffd0b0'),
  hemiGround: C('#6a6a46'),
  li: 2.1,
  hi: 0.75,
  near: 32,
  far: 115
}

const NIGHT = {
  top: C('#070d24'),
  horizon: C('#1f3260'),
  fog: C('#16223f'),
  light: C('#a9bfff'),
  hemiSky: C('#3f5694'),
  hemiGround: C('#14221d'),
  li: 0.55,
  hi: 0.42,
  near: 22,
  far: 90
}

const RAIN = {
  top: C('#6c7988'),
  horizon: C('#b2bcbf'),
  fog: C('#a7b2b6'),
  light: C('#dfe6ee'),
  hemiSky: C('#c5ced6'),
  hemiGround: C('#4f5f48'),
  li: 0.7,
  hi: 0.95,
  near: 12,
  far: 62
}

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const tmp = {}

const keys = ['top', 'horizon', 'fog', 'light', 'hemiSky', 'hemiGround']
keys.forEach((k) => (tmp[k] = new THREE.Color()))

export function hourNow() {
  const d = new Date()
  return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600
}

export function phaseOf(h) {
  if (h < 5) return 0
  if (h < 6.8) return 1
  if (h < 11.5) return 2
  if (h < 16.3) return 3
  if (h < 18.6) return 4
  if (h < 19.4) return 5
  return 6
}

export function applyTime(hour, rain) {
  const a = ((hour - 6) / 12) * Math.PI
  const sun = U.uSunDir.value.set(Math.cos(a) * 0.85, Math.sin(a), -0.45).normalize()
  const ma = ((hour - 18) / 12) * Math.PI
  U.uMoonDir.value.set(-Math.cos(ma) * 0.7, Math.max(Math.sin(ma), -0.2) * 0.9 + 0.15, 0.5).normalize()

  const day = smooth(-0.1, 0.22, sun.y)
  const gold = Math.exp(-((sun.y - 0.06) ** 2) / 0.012) * smooth(-0.16, -0.02, sun.y)
  const night = 1 - smooth(-0.14, 0.04, sun.y)
  const glow = 1 - smooth(-0.02, 0.2, sun.y)

  const set = (k) => tmp[k].copy(NIGHT[k]).lerp(DAY[k], day).lerp(GOLD[k], gold * 0.85).lerp(RAIN[k], rain * 0.75 * (0.35 + day * 0.65))
  keys.forEach(set)

  U.uSkyTop.value.copy(tmp.top)
  U.uHorizon.value.copy(tmp.horizon)
  U.uFogColor.value.copy(tmp.fog)
  U.uLightColor.value.copy(tmp.light)
  U.uHemiSky.value.copy(tmp.hemiSky)
  U.uHemiGround.value.copy(tmp.hemiGround)

  const mix = (k) => {
    let v = NIGHT[k] + (DAY[k] - NIGHT[k]) * day
    v += (GOLD[k] - v) * gold * 0.85
    v += (RAIN[k] - v) * rain * 0.75
    return v
  }
  LIVE.lightIntensity = mix('li')
  LIVE.hemiIntensity = mix('hi')
  U.uFogNear.value = mix('near')
  U.uFogFar.value = mix('far')

  U.uLightDir.value.copy(sun.y > -0.04 ? sun : U.uMoonDir.value)
  if (U.uLightDir.value.y < 0.12) U.uLightDir.value.y = 0.12
  U.uLightDir.value.normalize()

  U.uDay.value = day
  U.uNight.value = night
  U.uGlow.value = glow
  U.uRain.value = rain
  U.uWind.value = 1 + rain * 1.4
}

export function fogChunk() {
  return {
    pars: 'uniform vec3 uFogColor; uniform float uFogNear; uniform float uFogFar; varying float vFogDepth;',
    apply: 'gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, smoothstep(uFogNear, uFogFar, vFogDepth));'
  }
}

export const GRAD = (() => {
  const t = new THREE.DataTexture(new Uint8Array([70, 70, 70, 255, 140, 140, 140, 255, 205, 205, 205, 255, 255, 255, 255, 255]), 4, 1)
  t.minFilter = t.magFilter = THREE.NearestFilter
  t.needsUpdate = true
  return t
})()

export function windify(mat, amount = 0.08, axis = 'position.y + 1.0') {
  mat.onBeforeCompile = (s) => {
    s.uniforms.uTime = U.uTime
    s.uniforms.uWind = U.uWind
    s.vertexShader = s.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime; uniform float uWind;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vec3 wp = vec3(0.0);
        #ifdef USE_INSTANCING
          wp = instanceMatrix[3].xyz;
        #else
          wp = modelMatrix[3].xyz;
        #endif
        float sway = sin(uTime * 1.3 + wp.x * 0.27 + wp.z * 0.19) + 0.4 * sin(uTime * 2.9 + wp.x * 1.1);
        transformed.x += sway * ${amount.toFixed(3)} * uWind * (${axis});
        transformed.z += cos(uTime * 1.1 + wp.z * 0.23) * ${(amount * 0.6).toFixed(3)} * uWind * (${axis});`
      )
  }
  return mat
}

export function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
