import { CREATURES } from '../../data/i18n'
import { avoid } from '../../world/avoid'
import { CatOnRock } from './CatOnRock'
import { Rabbits } from './Rabbits'
import { Ducks } from './Ducks'
import { Birds } from './Birds'
import { Butterflies } from './Butterflies'

export function Creatures({ muted, lang = 'pt' }) {
  const lines = CREATURES[lang]
  return (
    <>
      <CatOnRock muted={muted} lines={lines.cat} />
      <Rabbits avoid={avoid} />
      <Ducks />
      <Birds />
      <Butterflies />
    </>
  )
}
