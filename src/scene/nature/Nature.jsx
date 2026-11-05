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
import { GRASS } from '../core/quality'

const TREE = OBJ[STOPS.findIndex((s) => s.id === 'arvore')]

export function Nature({ rain, tier }) {
  return (
    <>
      <Terrain />
      <Stream />
      <Grass count={GRASS[tier]} avoid={avoid} />
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
