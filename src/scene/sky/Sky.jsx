import { EnvDriver } from './EnvDriver'
import { SkyDome } from './SkyDome'
import { Lights } from './Lights'

export function Sky({ hour, rain, low }) {
  return (
    <>
      <EnvDriver hour={hour} rain={rain} />
      <SkyDome />
      <Lights quality={low ? 'low' : 'high'} />
    </>
  )
}
