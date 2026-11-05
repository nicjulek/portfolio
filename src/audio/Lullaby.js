const ARPS = {
  F: [53, 60, 65, 69],
  Dm: [50, 57, 62, 65],
  Bb: [46, 53, 58, 62],
  C: [48, 55, 60, 64],
  Am: [45, 52, 57, 60]
}

const PADS = {
  F: [57, 60, 65],
  Dm: [57, 62, 65],
  Bb: [58, 62, 65],
  C: [55, 60, 64],
  Am: [57, 60, 64]
}

const PROGRESSION = ['F', 'Dm', 'Bb', 'C', 'F', 'Am', 'Bb', 'C', 'Dm', 'Bb', 'F', 'C', 'Bb', 'C', 'F', 'F']

const MELODY = [
  [[69, 2], [72, 1]],
  [[74, 1.5], [72, 0.5], [69, 1]],
  [[70, 2], [74, 1]],
  [[72, 3]],
  [[69, 1], [65, 1], [69, 1]],
  [[72, 2], [76, 1]],
  [[74, 1], [72, 1], [70, 1]],
  [[67, 3]],
  [[77, 2], [76, 1]],
  [[74, 2], [70, 1]],
  [[72, 1.5], [69, 0.5], [65, 1]],
  [[67, 2], [64, 1]],
  [[65, 1], [67, 1], [69, 1]],
  [[70, 1], [69, 1], [67, 1]],
  [[65, 3]],
  []
]

const ARP_PATTERN = [0, 1, 2, 3, 2, 1]

const hz = (m) => 440 * Math.pow(2, (m - 69) / 12)

function impulse(ctx, seconds = 3.2, decay = 2.6) {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

export class Lullaby {
  constructor() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = 0
    this.tone = ctx.createBiquadFilter()
    this.tone.type = 'lowpass'
    this.tone.frequency.value = 9000
    this.tone.Q.value = 0.3
    this.dry = ctx.createGain()
    this.dry.gain.value = 0.85
    this.wet = ctx.createGain()
    this.wet.gain.value = 0.42
    this.verb = ctx.createConvolver()
    this.verb.buffer = impulse(ctx)
    this.bus = ctx.createGain()
    this.bus.connect(this.dry)
    this.bus.connect(this.verb)
    this.verb.connect(this.wet)
    this.dry.connect(this.tone)
    this.wet.connect(this.tone)
    this.tone.connect(this.master)
    this.master.connect(ctx.destination)
    this.bar = 0
    this.next = 0
    this.night = false
    this.rain = false
    this.timer = null
    this.playing = false
  }

  harp(m, t, g = 0.16, decay = 2.2) {
    const { ctx } = this
    const f = hz(m)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(g, t + 0.006)
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(Math.min(f * 9, 9000), t)
    lp.frequency.exponentialRampToValueAtTime(Math.max(f * 1.6, 400), t + decay * 0.6)
    const a = ctx.createOscillator()
    a.type = 'triangle'
    a.frequency.value = f
    const b = ctx.createOscillator()
    b.type = 'sine'
    b.frequency.value = f * 2.002
    const bg = ctx.createGain()
    bg.gain.value = 0.25
    a.connect(lp)
    b.connect(bg).connect(lp)
    lp.connect(env).connect(this.bus)
    a.start(t)
    b.start(t)
    a.stop(t + decay + 0.05)
    b.stop(t + decay + 0.05)
  }

  bell(m, t, g = 0.13, decay = 1.8) {
    const { ctx } = this
    const f = hz(m)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(g, t + 0.004)
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay)
    env.connect(this.bus)
    ;[
      [1, 1],
      [2.756, 0.22],
      [5.404, 0.07]
    ].forEach(([ratio, amp], i) => {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = f * ratio
      const og = ctx.createGain()
      og.gain.setValueAtTime(amp, t)
      if (i) og.gain.exponentialRampToValueAtTime(0.0001, t + decay * 0.35)
      o.connect(og).connect(env)
      o.start(t)
      o.stop(t + decay + 0.05)
    })
  }

  pad(notes, t, len) {
    const { ctx } = this
    const env = ctx.createGain()
    const g = this.night ? 0.035 : 0.025
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(g, t + len * 0.35)
    env.gain.setValueAtTime(g, t + len * 0.7)
    env.gain.exponentialRampToValueAtTime(0.0001, t + len + 1.4)
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 900
    lp.connect(env).connect(this.bus)
    notes.forEach((m) => {
      ;[-4, 4].forEach((cents) => {
        const o = ctx.createOscillator()
        o.type = 'triangle'
        o.frequency.value = hz(m - 12)
        o.detune.value = cents
        o.connect(lp)
        o.start(t)
        o.stop(t + len + 1.5)
      })
    })
  }

  scheduleBar(i, t) {
    const spb = this.night ? 1.05 : 0.82
    const chord = PROGRESSION[i]
    const arp = ARPS[chord]
    this.harp(arp[0] - 12, t, 0.2, 3)
    ARP_PATTERN.forEach((k, j) => {
      if (j === 0) return
      this.harp(arp[k], t + j * spb * 0.5, this.night ? 0.075 : 0.09, 1.8)
    })
    this.pad(PADS[chord], t, spb * 3)
    let at = t
    MELODY[i].forEach(([m, beats]) => {
      const human = (Math.random() - 0.5) * 0.012
      if (this.night) this.harp(m - 12, at + human, 0.16, 2.6)
      else this.bell(m, at + human, 0.12, 1.9)
      at += beats * spb
    })
    if (i === 15 && !this.night) this.bell(84, t + spb, 0.04, 2.6)
    return spb * 3
  }

  tick = () => {
    const ahead = document.hidden ? 4 : 1.5
    while (this.next < this.ctx.currentTime + ahead) {
      this.next += this.scheduleBar(this.bar, this.next)
      this.bar = (this.bar + 1) % PROGRESSION.length
    }
  }

  setMood({ night, rain }) {
    this.night = night
    this.rain = rain
    const cut = rain ? 1500 : night ? 3200 : 9000
    this.tone.frequency.setTargetAtTime(cut, this.ctx.currentTime, 0.8)
    this.wet.gain.setTargetAtTime(night ? 0.55 : 0.42, this.ctx.currentTime, 0.8)
  }

  start() {
    if (this.playing) return
    this.playing = true
    this.ctx.resume().catch(() => {})
    const now = this.ctx.currentTime
    this.next = now + 0.15
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now)
    this.master.gain.exponentialRampToValueAtTime(1.2, now + 2.5)
    this.tick()
    this.timer = setInterval(this.tick, 120)
  }

  unlock() {
    if (this.playing && this.ctx.state !== 'running') this.ctx.resume().catch(() => {})
  }

  get blocked() {
    return this.playing && this.ctx.state !== 'running'
  }

  stop() {
    if (!this.playing) return
    this.playing = false
    clearInterval(this.timer)
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now)
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 1.2)
    setTimeout(() => !this.playing && this.ctx.suspend(), 1400)
  }

  dispose() {
    clearInterval(this.timer)
    this.ctx.close()
  }
}
