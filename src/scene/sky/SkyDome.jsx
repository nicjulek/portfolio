import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U, rng } from '../core/env'

export const skyVert = `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`

export const skyFrag = `
uniform vec3 uSkyTop; uniform vec3 uHorizon; uniform vec3 uSunDir; uniform vec3 uMoonDir; uniform vec3 uLightColor;
uniform float uNight; uniform float uRain; uniform float uDay;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col = mix(uHorizon, uSkyTop, smoothstep(-0.02, 0.55, h));
  col = mix(col, uHorizon * 0.75, smoothstep(0.0, -0.25, h));
  float sd = max(dot(d, uSunDir), 0.0);
  float sunVis = smoothstep(-0.12, 0.02, uSunDir.y) * (1.0 - uRain * 0.85);
  col += vec3(1.0, 0.85, 0.6) * pow(sd, 6.0) * 0.35 * sunVis;
  col += vec3(1.0, 0.95, 0.85) * smoothstep(0.9988, 0.9994, sd) * 6.0 * sunVis;
  float md = max(dot(d, uMoonDir), 0.0);
  float moonVis = uNight * (1.0 - uRain);
  col += vec3(0.8, 0.88, 1.0) * (smoothstep(0.9991, 0.9995, md) * 2.4 + pow(md, 40.0) * 0.15) * moonVis;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

export function Stars() {
  const ref = useRef()
  const geo = useMemo(() => {
    const g = rng(91)
    const n = 1400
    const p = new Float32Array(n * 3)
    const s = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const th = g() * Math.PI * 2
      const y = 0.08 + g() * 0.92
      const r = Math.sqrt(1 - y * y)
      p.set([Math.cos(th) * r * 160, y * 160, Math.sin(th) * r * 160], i * 3)
      s[i] = g()
    }
    const b = new THREE.BufferGeometry()
    b.setAttribute('position', new THREE.BufferAttribute(p, 3))
    b.setAttribute('aSeed', new THREE.BufferAttribute(s, 1))
    return b
  }, [])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: U.uTime, uNight: U.uNight, uRain: U.uRain },
        vertexShader: `attribute float aSeed; uniform float uTime; varying float vA;
          void main(){ vA = 0.55 + 0.45 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 40.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = 1.2 + aSeed * 2.2; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform float uNight; uniform float uRain; varying float vA;
          void main(){ float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA * uNight * (1.0 - uRain);
          gl_FragColor = vec4(vec3(1.0, 0.97, 0.9) * a, a); }`
      }),
    []
  )
  useFrame(({ camera }) => ref.current.position.copy(camera.position))
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />
}

export function SkyDome() {
  const ref = useRef()
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uSkyTop: U.uSkyTop,
          uHorizon: U.uHorizon,
          uSunDir: U.uSunDir,
          uMoonDir: U.uMoonDir,
          uLightColor: U.uLightColor,
          uNight: U.uNight,
          uRain: U.uRain,
          uDay: U.uDay
        },
        vertexShader: skyVert,
        fragmentShader: skyFrag
      }),
    []
  )
  useFrame(({ camera }) => ref.current.position.copy(camera.position))
  return (
    <>
      <mesh ref={ref} material={mat} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[170, 48, 24]} />
      </mesh>
      <Stars />
    </>
  )
}
