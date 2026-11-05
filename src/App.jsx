import { useRef, useState } from 'react'
import { STOPS } from './data/stops'
import { LangContext } from './data/i18n'
import { useLanguage } from './hooks/useLanguage'
import { useClock } from './hooks/useClock'
import { useMusic } from './hooks/useMusic'
import { useTrailControls } from './hooks/useTrailControls'
import { Scene } from './scene/Scene'
import { TopBar } from './components/ui/TopBar'
import { TrailNav } from './components/ui/TrailNav'
import { Hint } from './components/ui/Hint'
import { StopCard } from './components/card/StopCard'

export default function App() {
  const [lang, toggleLang] = useLanguage()
  const clock = useClock()
  const [rain, setRain] = useState(false)
  const [muted, toggleMute] = useMusic({ night: clock.isNight, rain })
  const { progress, moved, goTo, jump } = useTrailControls()
  const [stop, setStop] = useState(-1)
  const marker = useRef()

  const onMove = (t) => {
    if (marker.current) marker.current.style.left = `${t * 100}%`
  }

  const current = stop >= 0 ? STOPS[stop] : null

  return (
    <LangContext.Provider value={lang}>
      <div className={`app${rain ? ' rainy' : ''}${clock.isNight ? ' night' : ''}`}>
        <Scene progress={progress} rain={rain} hour={clock.hour} stop={stop} muted={muted} lang={lang} onStop={setStop} onMove={onMove} />
        <TopBar lang={lang} onToggleLang={toggleLang} clock={clock} muted={muted} onToggleMute={toggleMute} rain={rain} onToggleRain={() => setRain((r) => !r)} />
        {!moved && <Hint />}
        {current && <StopCard s={current} index={stop} key={current.id} />}
        <TrailNav stop={stop} markerRef={marker} onGo={goTo} onJump={jump} />
      </div>
    </LangContext.Provider>
  )
}
