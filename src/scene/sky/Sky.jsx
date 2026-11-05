import { EnvDriver } from './EnvDriver'
import { SkyDome } from './SkyDome'
import { Lights } from './Lights'

export function Sky({ hour, rain, tier }) {
  return (
    <>
      <EnvDriver hour={hour} rain={rain} />
      <SkyDome />
      <Lights tier={tier} />
    </>
  )
}
