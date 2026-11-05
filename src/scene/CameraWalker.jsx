import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { STOPS } from '../data/stops'
import { OBJ, STREAM_Z, baseHeight, pathX, stopT, zOfT } from '../world/terrain'
import { U } from './core/env'

const STOP_TS = STOPS.map(stopT)
const EYE_HEIGHT = 1.72

export function CameraWalker({ progress, onStop, onMove }) {
  const cur = useRef(progress.current)
  const look = useMemo(() => new THREE.Vector3(), [])
  const ahead = useMemo(() => new THREE.Vector3(), [])
  const focus = useMemo(() => new THREE.Vector3(), [])
  const last = useRef(-2)
  const first = useRef(true)
  const sway = useRef(0)
  useFrame(({ camera, pointer }, dt) => {
    const before = cur.current
    cur.current += (progress.current - cur.current) * (1 - Math.exp(-dt * 2.4))
    const speed = Math.abs(cur.current - before) / Math.max(dt, 0.001)
    sway.current += dt * (1 + speed * 60)
    const t = cur.current
    const z = zOfT(t)
    const x = pathX(z)
    const bob = Math.sin(sway.current * 4) * 0.035 * Math.min(1, speed * 30) + Math.sin(U.uTime.value * 0.8) * 0.02
    let y = baseHeight(x, z)
    if (Math.abs(z - STREAM_Z) < 2.6) y += Math.cos(((z - STREAM_Z) / 2.6) * (Math.PI / 2)) * 1.1
    camera.position.set(x, Math.max(y, 0.2) + EYE_HEIGHT + bob, z)
    U.uPlayer.value.set(x, 0, z - 1.2)
    const za = z - 7
    ahead.set(pathX(za), baseHeight(pathX(za), za) + 1.5, za)
    let best = -1
    let bw = 0
    STOP_TS.forEach((st, i) => {
      const w = Math.exp(-(((t - st) / 0.03) ** 2))
      if (w > bw) {
        bw = w
        best = i
      }
    })
    if (best >= 0) {
      const [ox, oy, oz] = OBJ[best]
      focus.set(ox, oy + (STOPS[best].id === 'arvore' ? 3.6 : 1.8), oz)
      ahead.lerp(focus, bw * 0.8)
    }
    ahead.x += pointer.x * 0.9
    ahead.y += pointer.y * 0.5
    if (first.current) {
      look.copy(ahead)
      first.current = false
    } else look.lerp(ahead, 1 - Math.exp(-dt * 3))
    camera.lookAt(look)
    const idx = bw > 0.45 ? best : -1
    if (idx !== last.current) {
      last.current = idx
      onStop(idx)
    }
    onMove(t)
  })
  return null
}
