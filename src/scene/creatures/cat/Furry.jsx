import { useMemo } from 'react'
import { furMaterial } from './fur'

export function Furry({ geometry, len, density, shells = 12, castShadow = true }) {
  const base = useMemo(() => furMaterial({ len, density, shells }), [len, density, shells])
  const shell = useMemo(() => furMaterial({ len, density, shells }), [len, density, shells])
  return (
    <>
      <mesh geometry={geometry} material={base} castShadow={castShadow} receiveShadow />
      <instancedMesh args={[geometry, shell, shells]} receiveShadow frustumCulled={false} />
    </>
  )
}
