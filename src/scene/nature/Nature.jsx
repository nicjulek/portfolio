import { Terrain } from './Terrain'
import { Stream } from './Stream'
import { Grass } from './Grass'
import { Flowers } from './Flowers'
import { Rocks } from './Rocks'
import { Trees } from './Trees'
import { Clouds } from './Clouds'
import { Fireflies } from './Fireflies'
import { FallingLeaves } from './FallingLeaves'
import { Rain } from './Rain'
import { STOPS } from '../../data/stops'
import { OBJ } from '../../world/terrain'
import { avoid } from '../../world/avoid'

const TREE = OBJ[STOPS.findIndex((s) => s.id === 'arvore')]

export function Nature({ rain, low }) {
  return (
    <>
      <Terrain />
      <Stream />
      <Grass count={low ? 26000 : 62000} avoid={avoid} />
      <Flowers avoid={avoid} />
      <Rocks avoid={avoid} />
      <Trees avoid={avoid} />
      <Clouds />
      <Fireflies />
      <FallingLeaves center={TREE} />
      <Rain on={rain} />
    </>
  )
}
