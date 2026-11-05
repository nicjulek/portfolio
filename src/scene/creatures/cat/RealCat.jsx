import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { U } from '../../core/env'
import { Ear } from './Ear'
import { Eye } from './Eye'
import { Furry } from './Furry'
import { Mouth } from './Mouth'
import { Tail } from './Tail'
import { Whiskers } from './Whiskers'
import { bodyColor, headColor } from './markings'
import { bodyRough, bodySdf, clamp, headSdf } from './sdf'
import { surface } from './surface'

export function RealCat({ onPet, happy }) {
  const body = useMemo(() => surface(bodySdf, [0, 0.15, -0.02], 0.19, 80, bodyColor, bodyRough), [])
  const headGeo = useMemo(() => surface(headSdf, [0, -0.002, 0.008], 0.07, 64, headColor), [])
  const nose = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, -0.0045)
    s.quadraticCurveTo(0.0075, 0.001, 0.0062, 0.0035)
    s.quadraticCurveTo(0, 0.005, -0.0062, 0.0035)
    s.quadraticCurveTo(-0.0075, 0.001, 0, -0.0045)
    return new THREE.ExtrudeGeometry(s, { depth: 0.002, bevelEnabled: true, bevelSize: 0.0012, bevelThickness: 0.0015, bevelSegments: 3 })
  }, [])
  const bodyRef = useRef()
  const head = useRef()
  const eyeL = useRef()
  const eyeR = useRef()
  const earL = useRef()
  const earR = useRef()
  const wag = useRef(0)
  const blink = useRef({ next: 2.5, t: 1 })
  const local = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }, dt) => {
    const t = U.uTime.value
    const joy = clamp(happy.current, 0, 1)
    wag.current += (joy - wag.current) * (1 - Math.exp(-dt * 3))
    bodyRef.current.scale.set(1 + Math.sin(t * 1.7) * 0.008, 1 + Math.sin(t * 1.7) * 0.012, 1)
    local.copy(camera.position)
    head.current.parent.worldToLocal(local)
    local.sub(head.current.position)
    const yaw = clamp(Math.atan2(local.x, local.z), -0.85, 0.85)
    const pitch = clamp(-Math.atan2(local.y, Math.hypot(local.x, local.z)) * 0.7, -0.35, 0.3)
    const k = 1 - Math.exp(-dt * 2.5)
    head.current.rotation.y += (yaw - head.current.rotation.y) * k
    head.current.rotation.x += (pitch - head.current.rotation.x) * k
    head.current.rotation.z += (Math.sin(t * 0.6) * 0.04 + joy * 0.22 - head.current.rotation.z) * k
    const b = blink.current
    b.next -= dt
    if (b.next < 0) {
      b.t = 0
      b.next = 2.5 + Math.random() * 4
    }
    b.t = Math.min(1, b.t + dt * 6)
    const lid = Math.max(joy > 0.25 ? 0.9 : 0, b.t < 1 ? Math.sin(b.t * Math.PI) : 0)
    const dil = 0.16 + U.uGlow.value * 0.55 + joy * 0.1
    for (const e of [eyeL.current, eyeR.current]) {
      e.scale.y = 0.82 * (1 - lid * 0.93)
      const p = e.getObjectByName('pupil')
      p.scale.x += (dil - p.scale.x) * k
    }
    const tw = (Math.sin(t * 7.3) > 0.992 ? 0.35 : 0) + joy * 0.15
    earL.current.rotation.y += (-tw - earL.current.rotation.y) * 0.3
    earR.current.rotation.y += (tw * (Math.sin(t * 3.1) > 0.6 ? 1 : 0) - earR.current.rotation.y) * 0.3
  })

  return (
    <group onClick={onPet}>
      <group ref={bodyRef}>
        <Furry geometry={body} len={0.0075} density={720} />
      </group>
      <Tail wag={wag} />
      <group ref={head} position={[0, 0.308, 0.058]} scale={1.2}>
        <Furry geometry={headGeo} len={0.0042} density={950} shells={10} />
        <Eye side={-1} eyeRef={eyeL} />
        <Eye side={1} eyeRef={eyeR} />
        <Ear side={-1} earRef={earL} />
        <Ear side={1} earRef={earR} />
        <mesh geometry={nose} position={[0, -0.0035, 0.0565]} rotation={[-0.35, 0, 0]}>
          <meshStandardMaterial color="#231b1d" roughness={0.35} />
        </mesh>
        <Mouth />
        <Whiskers />
      </group>
    </group>
  )
}
