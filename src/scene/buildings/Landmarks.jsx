import { STOPS } from '../../data/stops'
import { AntennaHouse } from './AntennaHouse'
import { Atelie } from './Atelie'
import { Bridge } from './Bridge'
import { BusStop } from './BusStop'
import { Clothesline } from './Clothesline'
import { GiantTree } from './GiantTree'
import { Hall } from './Hall'
import { Shed } from './Shed'
import { OBJ } from '../../world/terrain'

export const MODELS = { ponto: BusStop, antena: AntennaHouse, prefeitura: Hall, galpao: Shed, atelie: Atelie, varal: Clothesline, arvore: GiantTree }

export function Landmarks() {
  return (
    <>
      {STOPS.map((s, i) => {
        const M = MODELS[s.id]
        const [x, y, z] = OBJ[i]
        return (
          <group key={s.id} position={[x, y - 0.06, z]} rotation={[0, s.side > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
            <M />
          </group>
        )
      })}
      <Bridge />
    </>
  )
}
