import { useMemo } from 'react'
import { FUR, useTier } from '../../core/quality'
import { furMaterial } from './fur'

export function Furry({ geometry, len, density, shells = 12, rest = false, castShadow = true }) {
  const tier = useTier()
  // em aparelhos fracos desenha menos camadas; o comprimento total do pelo
  // continua o mesmo, so fica um pouco menos macio
  const n = Math.max(4, Math.round(shells * FUR[tier]))
  const base = useMemo(() => furMaterial({ len, density, shells: n, rest }), [len, density, n, rest])
  const shell = useMemo(() => furMaterial({ len, density, shells: n, rest }), [len, density, n, rest])
  return (
    <>
      <mesh geometry={geometry} material={base} castShadow={castShadow} receiveShadow />
      <instancedMesh key={n} args={[geometry, shell, n]} receiveShadow frustumCulled={false} />
    </>
  )
}
