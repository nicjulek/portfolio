export let sharedAudio

export function audioCtx() {
  try {
    sharedAudio = sharedAudio || new (window.AudioContext || window.webkitAudioContext)()
    sharedAudio.resume()
    return sharedAudio
  } catch {
    return null
  }
}

export function meow() {
  const a = audioCtx()
  if (!a) return
  const t = a.currentTime
  const o = a.createOscillator()
  o.type = 'sawtooth'
  o.frequency.setValueAtTime(520, t)
  o.frequency.linearRampToValueAtTime(820, t + 0.18)
  o.frequency.linearRampToValueAtTime(600, t + 0.55)
  const f = a.createBiquadFilter()
  f.type = 'bandpass'
  f.Q.value = 3
  f.frequency.setValueAtTime(900, t)
  f.frequency.linearRampToValueAtTime(1900, t + 0.2)
  f.frequency.linearRampToValueAtTime(1100, t + 0.55)
  const g = a.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.06)
  g.gain.setValueAtTime(0.22, t + 0.35)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6)
  o.connect(f).connect(g).connect(a.destination)
  o.start(t)
  o.stop(t + 0.65)
}
