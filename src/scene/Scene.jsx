import { useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { Sky } from './sky/Sky'
import { Nature } from './nature/Nature'
import { Buildings } from './buildings/Buildings'
import { Creatures } from './creatures/Creatures'
import { Lume } from './lume/Lume'
import { CameraWalker } from './CameraWalker'
import { Effects } from './Effects'
import { DPR, detectTier, rememberTier } from './core/quality'

export function Scene({ progress, rain, hour, stop, muted, lang, onStop, onMove }) {
  const [tier, setTier] = useState(detectTier)
  const decline = useCallback(() => {
    setTier((t) => {
      const next = Math.max(0, t - 1)
      rememberTier(next)
      return next
    })
  }, [])
  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      dpr={DPR[tier]}
      camera={{ fov: 55, near: 0.1, far: 400 }}
      gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
    >
      <PerformanceMonitor bounds={() => [38, 200]} flipflops={Infinity} onDecline={decline} />
      <Sky hour={hour} rain={rain} tier={tier} />
      <Nature rain={rain} tier={tier} />
      <Buildings />
      <Creatures muted={muted} lang={lang} />
      <Lume stop={stop} hour={hour} lang={lang} />
      <CameraWalker progress={progress} onStop={onStop} onMove={onMove} />
      <Effects tier={tier} />
    </Canvas>
  )
}
