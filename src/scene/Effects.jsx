import { EffectComposer, Bloom, Vignette, ToneMapping, HueSaturation } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

export function Effects({ low }) {
  return (
    <EffectComposer multisampling={low ? 0 : 4} disableNormalPass>
      <Bloom mipmapBlur intensity={0.65} luminanceThreshold={0.9} luminanceSmoothing={0.2} radius={0.65} />
      <HueSaturation saturation={0.08} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  )
}
