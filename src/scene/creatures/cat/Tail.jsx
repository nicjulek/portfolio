import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Furry } from './Furry'
import { BLACK } from './markings'
import { createTailGeometry, createTailRig, poseTail } from './tailGeometry'

export function Tail({ wag }) {
  const geo = useMemo(() => createTailGeometry(BLACK), [])
  const rig = useMemo(createTailRig, [])
  useFrame((_, dt) => poseTail(geo, rig, dt, wag.current))
  return <Furry geometry={geo} len={0.009} density={650} shells={12} rest />
}
