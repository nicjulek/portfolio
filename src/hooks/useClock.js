import { useEffect, useState } from 'react'
import { hourNow } from '../scene/core/env'

export const PRESETS = ['agora', '6.3', '12', '17.9', '21.5']

export function useClock() {
  const [now, setNow] = useState(hourNow)
  const [preset, setPreset] = useState('agora')
  useEffect(() => {
    const id = setInterval(() => setNow(hourNow()), 15000)
    return () => clearInterval(id)
  }, [])
  const hour = preset === 'agora' ? now : parseFloat(preset)
  return { hour, preset, setPreset, isLive: preset === 'agora', isNight: hour >= 18.6 || hour < 5.6 }
}
