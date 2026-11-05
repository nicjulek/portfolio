import { useEffect, useRef, useState } from 'react'
import { Lullaby } from '../audio/Lullaby'

const KEY = 'trilha-mudo'

const readMuted = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function useMusic({ night, rain }) {
  const music = useRef(null)
  const [muted, setMuted] = useState(readMuted)

  useEffect(() => {
    try {
      music.current = new Lullaby()
    } catch {
      return
    }
    music.current.setMood({ night, rain })
    if (!readMuted()) music.current.start()
    const unlock = () => music.current?.unlock()
    const events = ['pointerdown', 'keydown', 'touchend', 'click']
    events.forEach((e) => window.addEventListener(e, unlock, { passive: true }))
    return () => {
      events.forEach((e) => window.removeEventListener(e, unlock))
      music.current?.dispose()
    }
  }, [])

  useEffect(() => {
    music.current?.setMood({ night, rain })
  }, [night, rain])

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    try {
      localStorage.setItem(KEY, next ? '1' : '0')
    } catch {}
    if (!music.current) return
    if (next) music.current.stop()
    else music.current.start()
  }

  return [muted, toggleMute]
}
