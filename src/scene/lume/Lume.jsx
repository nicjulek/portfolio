import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { LUME } from '../../data/i18n'
import { STOPS } from '../../data/stops'
import { U } from '../core/env'
import { Burst } from './Burst'
import { Trail } from './Trail'
import { greet, lumeLines } from './dialogue'
import { bodyFrag, bodyVert, wingFrag } from './shaders'
import { wingShape } from './wingShape'

export function Lume({ stop, hour, lang = 'pt' }) {
  const L = LUME[lang]
  const root = useRef()
  const face = useRef()
  const eyes = useRef()
  const wings = useRef()
  const light = useRef()
  const halo = useRef()
  const smile = useRef()
  const mouth = useRef()
  const talkAmt = useRef(0)
  const posRef = useRef(new THREE.Vector3())
  const [hover, setHover] = useState(false)
  const [say, setSay] = useState(null)
  const [pops, setPops] = useState(0)
  const spin = useRef(1)
  const lineIdx = useRef(0)
  const told = useRef(new Set())
  const timer = useRef()

  const speak = (text) => {
    setSay(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSay(null), 4800)
  }

  useEffect(() => {
    if (stop < 0) return
    const id = STOPS[stop].id
    if (told.current.has(id)) return
    const t = setTimeout(() => {
      told.current.add(id)
      speak(L.stops[id])
    }, 1400)
    return () => clearTimeout(t)
  }, [stop])

  useEffect(() => {
    const t = setTimeout(() => speak(greet(hour, L)), 1800)
    return () => clearTimeout(t)
  }, [])

  const click = (e) => {
    e.stopPropagation()
    spin.current = 0
    setPops((p) => p + 1)
    const all = lumeLines(hour, L)
    speak(all[lineIdx.current % all.length])
    lineIdx.current++
  }

  const bodyMat = useMemo(() => new THREE.ShaderMaterial({ uniforms: { uGlow: U.uGlow, uHappy: { value: 0 } }, vertexShader: bodyVert, fragmentShader: bodyFrag }), [])
  const wingMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: { uTime: U.uTime, uHappy: bodyMat.uniforms.uHappy },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: wingFrag
      }),
    [bodyMat]
  )
  const geos = useMemo(() => {
    const ant = (s) =>
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(s * 0.04, 0.12, 0), new THREE.Vector3(s * 0.07, 0.24, 0.02), new THREE.Vector3(s * 0.13, 0.3, 0.04)]), 12, 0.008, 6)
    const leaf = new THREE.Shape()
    leaf.moveTo(0, 0)
    leaf.bezierCurveTo(0.06, 0.04, 0.07, 0.12, 0, 0.17)
    leaf.bezierCurveTo(-0.07, 0.12, -0.06, 0.04, 0, 0)
    return {
      body: new THREE.SphereGeometry(0.16, 32, 24),
      eye: new THREE.SphereGeometry(1, 16, 12),
      happy: new THREE.TorusGeometry(0.022, 0.007, 6, 14, Math.PI),
      smile: new THREE.TorusGeometry(0.02, 0.006, 6, 14, Math.PI),
      blush: new THREE.CircleGeometry(0.022, 16),
      antL: ant(-1),
      antR: ant(1),
      tip: new THREE.SphereGeometry(0.022, 10, 8),
      leaf: new THREE.ExtrudeGeometry(leaf, { depth: 0.01, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005, bevelSegments: 2 }),
      wingA: wingShape(0.34, 0.24),
      wingB: wingShape(0.24, 0.15),
      hit: new THREE.SphereGeometry(0.42, 12, 8)
    }
  }, [])
  const haloTex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const x = c.getContext('2d')
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(255,230,160,0.55)')
    g.addColorStop(0.35, 'rgba(255,190,100,0.35)')
    g.addColorStop(1, 'rgba(255,160,60,0)')
    x.fillStyle = g
    x.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])

  const fwd = useMemo(() => new THREE.Vector3(), [])
  const side = useMemo(() => new THREE.Vector3(), [])
  const goal = useMemo(() => new THREE.Vector3(), [])
  const happy = useRef(0)

  useFrame(({ camera, pointer, size }, dt) => {
    const t = U.uTime.value
    camera.getWorldDirection(fwd)
    side.crossVectors(fwd, camera.up).normalize()
    const near = hover ? 2.6 : 3.2
    goal
      .copy(camera.position)
      .addScaledVector(fwd, near)
      .addScaledVector(side, (0.95 + Math.sin(t * 0.6) * 0.35) * Math.min(1, size.width / size.height / 1.3))
    goal.y += -0.3 + Math.sin(t * 1.2) * Math.cos(t * 0.6) * 0.18 + (hover ? Math.abs(Math.sin(t * 7)) * 0.08 : 0)
    goal.addScaledVector(camera.up, say ? 0.05 : 0)
    root.current.position.lerp(goal, 1 - Math.exp(-dt * 2.4))
    posRef.current.copy(root.current.position)

    face.current.lookAt(camera.position)
    spin.current = Math.min(1, spin.current + dt * 1.6)
    const e = 1 - Math.pow(1 - spin.current, 3)
    face.current.rotateY(e * Math.PI * 2 * (spin.current < 1 ? 1 : 0))
    face.current.rotateZ(Math.sin(t * 1.5) * 0.08)

    happy.current += ((hover || say ? 1 : 0) - happy.current) * (1 - Math.exp(-dt * 6))
    bodyMat.uniforms.uHappy.value = happy.current
    eyes.current.position.set(pointer.x * 0.014, pointer.y * 0.01, 0)
    eyes.current.children[0].visible = happy.current < 0.5
    eyes.current.children[1].visible = happy.current >= 0.5
    eyes.current.children[2].children.forEach((m) => (m.material.opacity = 0.25 + happy.current * 0.6))
    talkAmt.current += ((say ? 1 : 0) - talkAmt.current) * (1 - Math.exp(-dt * 10))
    const open = say ? (0.3 + 0.7 * Math.abs(Math.sin(t * 11))) * (0.75 + 0.25 * Math.sin(t * 3.3)) : 0 // abre e fecha tipo silabas
    smile.current.visible = talkAmt.current < 0.5
    mouth.current.visible = talkAmt.current >= 0.5
    mouth.current.scale.set(1, 0.2 + open * 0.8, 1)

    const speed = hover ? 30 : 20
    const f = Math.sin(t * speed)
    wings.current.children.forEach((w, i) => {
      const s = i % 2 ? -1 : 1
      const big = i < 2
      w.rotation.y = s * (0.35 + f * (big ? 0.75 : 0.6))
    })

    const pulse = 1 + Math.sin(t * 2.4) * 0.08
    halo.current.scale.setScalar((0.55 + U.uGlow.value * 0.75 + happy.current * 0.15) * pulse)
    light.current.intensity = (0.8 + U.uGlow.value * 4) * pulse
  })

  return (
    <>
      <group ref={root}>
        <sprite ref={halo}>
          <spriteMaterial map={haloTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        <pointLight ref={light} color="#ffcf7a" distance={6} decay={1.8} />
        <group ref={face}>
          <mesh geometry={geos.body} material={bodyMat} />
          <group ref={wings} position={[0, 0.03, -0.05]}>
            <mesh geometry={geos.wingA} material={wingMat} position={[0.06, 0, 0]} rotation={[0.2, 0, 0.35]} />
            <mesh geometry={geos.wingA} material={wingMat} position={[-0.06, 0, 0]} rotation={[0.2, 0, Math.PI - 0.35]} scale={[1, -1, 1]} />
            <mesh geometry={geos.wingB} material={wingMat} position={[0.05, -0.05, 0]} rotation={[0.2, 0, -0.45]} />
            <mesh geometry={geos.wingB} material={wingMat} position={[-0.05, -0.05, 0]} rotation={[0.2, 0, Math.PI + 0.45]} scale={[1, -1, 1]} />
          </group>
          <mesh geometry={geos.antL} material={bodyMat} />
          <mesh geometry={geos.antR} material={bodyMat} />
          <mesh geometry={geos.tip} material={bodyMat} position={[-0.13, 0.3, 0.04]} />
          <mesh geometry={geos.tip} material={bodyMat} position={[0.13, 0.3, 0.04]} />
          <mesh position={[0, 0.17, 0.01]}>
            <cylinderGeometry args={[0.006, 0.008, 0.05, 6]} />
            <meshBasicMaterial color="#5aa83c" />
          </mesh>
          <mesh geometry={geos.leaf} position={[0.004, 0.19, 0.01]} rotation={[0.25, 0.3, -1.05]} scale={0.75}>
            <meshBasicMaterial color="#8fd16a" />
          </mesh>
          <mesh geometry={geos.leaf} position={[-0.004, 0.19, 0.01]} rotation={[0.25, -0.3, 1.05]} scale={0.6}>
            <meshBasicMaterial color="#6fbf4c" />
          </mesh>
          <group ref={eyes}>
            <group>
              {[-1, 1].map((s) => (
                <group key={s}>
                  <mesh geometry={geos.eye} position={[s * 0.052, 0.018, 0.148]} scale={[0.022, 0.032, 0.012]}>
                    <meshBasicMaterial color="#2b1d14" />
                  </mesh>
                  <mesh geometry={geos.eye} position={[s * 0.052 + 0.008, 0.03, 0.158]} scale={0.007}>
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                </group>
              ))}
            </group>
            <group>
              {[-1, 1].map((s) => (
                <mesh key={s} geometry={geos.happy} position={[s * 0.052, 0.012, 0.152]}>
                  <meshBasicMaterial color="#2b1d14" />
                </mesh>
              ))}
            </group>
            <group>
              {[-1, 1].map((s) => (
                <mesh key={s} geometry={geos.blush} position={[s * 0.088, -0.022, 0.13]} rotation={[0, s * 0.5, 0]}>
                  <meshBasicMaterial color="#ff7f9a" transparent opacity={0.3} depthWrite={false} />
                </mesh>
              ))}
            </group>
            <mesh ref={smile} geometry={geos.smile} position={[0, -0.03, 0.155]} rotation={[0, 0, Math.PI]}>
              <meshBasicMaterial color="#2b1d14" />
            </mesh>
            <group ref={mouth} position={[0, -0.036, 0.149]} visible={false}>
              <mesh geometry={geos.eye} scale={[0.019, 0.017, 0.009]}>
                <meshBasicMaterial color="#3a1c16" />
              </mesh>
              <mesh geometry={geos.eye} position={[0, -0.008, 0.004]} scale={[0.011, 0.006, 0.006]}>
                <meshBasicMaterial color="#ff8a9a" />
              </mesh>
            </group>
          </group>
          <Burst trigger={pops} />
        </group>
        <mesh
          geometry={geos.hit}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHover(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHover(false)
            document.body.style.cursor = ''
          }}
          onClick={click}
        >
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {say && (
          <Html position={[0, 0.42, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
            <div className="bubble" key={say}>
              {say}
            </div>
          </Html>
        )}
      </group>
      <Trail source={posRef} />
    </>
  )
}
