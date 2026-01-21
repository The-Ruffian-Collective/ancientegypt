import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'egyptian-adventure-sound-enabled'

// Create audio context lazily to comply with browser autoplay policies
let audioContext = null

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioContext
}

// Resume audio context if suspended (required after user interaction)
async function resumeAudioContext() {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
  return ctx
}

// Generate white noise buffer for wind effect
function createNoiseBuffer(ctx, duration = 2) {
  const sampleRate = ctx.sampleRate
  const bufferSize = sampleRate * duration
  const buffer = ctx.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  return buffer
}

// Synthesize a gentle "pop" sound for button taps
function playTapSound(ctx, volume = 0.3) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.setValueAtTime(400, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08)

  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.1)
}

// Synthesize a magical "whoosh" sound for location selection
function playWhooshSound(ctx, volume = 0.25) {
  const osc = ctx.createOscillator()
  const osc2 = ctx.createOscillator()
  const gain = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  osc.type = 'sine'
  osc2.type = 'triangle'

  osc.connect(filter)
  osc2.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(800, ctx.currentTime)
  filter.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15)
  filter.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.4)

  osc.frequency.setValueAtTime(300, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.2)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4)

  osc2.frequency.setValueAtTime(450, ctx.currentTime)
  osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2)
  osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.4)

  gain.gain.setValueAtTime(0.001, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(volume, ctx.currentTime + 0.1)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)

  osc.start(ctx.currentTime)
  osc2.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.4)
  osc2.stop(ctx.currentTime + 0.4)
}

// Synthesize a celebratory chime for treasure collection
function playChimeSound(ctx, volume = 0.3) {
  const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    const startTime = ctx.currentTime + i * 0.1
    gain.gain.setValueAtTime(0.001, startTime)
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5)

    osc.start(startTime)
    osc.stop(startTime + 0.5)
  })
}

// Create ambient wind sound that loops
function createWindSound(ctx, volume = 0.08) {
  const noiseBuffer = createNoiseBuffer(ctx, 3)
  const source = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  source.buffer = noiseBuffer
  source.loop = true

  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(400, ctx.currentTime)

  // Add subtle modulation to the filter for natural variation
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.setValueAtTime(0.2, ctx.currentTime)
  lfoGain.gain.setValueAtTime(100, ctx.currentTime)
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  gain.gain.setValueAtTime(volume, ctx.currentTime)

  source.start()

  return {
    source,
    gain,
    lfo,
    stop: () => {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      setTimeout(() => {
        source.stop()
        lfo.stop()
      }, 500)
    },
    setVolume: (v) => {
      gain.gain.setValueAtTime(v, ctx.currentTime)
    }
  }
}

export function useSound() {
  // Load initial state from localStorage, default to false (muted)
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'true'
  })

  const windRef = useRef(null)
  const isInitializedRef = useRef(false)

  // Persist sound preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(isSoundEnabled))
  }, [isSoundEnabled])

  // Handle ambient wind sound
  useEffect(() => {
    if (!isSoundEnabled) {
      // Stop wind if sound is disabled
      if (windRef.current) {
        windRef.current.stop()
        windRef.current = null
      }
      return
    }

    // Start wind when sound is enabled
    const startWind = async () => {
      try {
        const ctx = await resumeAudioContext()
        if (!windRef.current) {
          windRef.current = createWindSound(ctx, 0.06)
        }
      } catch (e) {
        console.warn('Could not start ambient sound:', e)
      }
    }

    startWind()

    return () => {
      if (windRef.current) {
        windRef.current.stop()
        windRef.current = null
      }
    }
  }, [isSoundEnabled])

  // Toggle sound on/off
  const toggleSound = useCallback(async () => {
    // Resume audio context on user interaction
    await resumeAudioContext()
    setIsSoundEnabled(prev => !prev)
  }, [])

  // Play tap sound (for button clicks)
  const playTap = useCallback(async () => {
    if (!isSoundEnabled) return
    try {
      const ctx = await resumeAudioContext()
      playTapSound(ctx, 0.25)
    } catch (e) {
      console.warn('Could not play tap sound:', e)
    }
  }, [isSoundEnabled])

  // Play whoosh sound (for location selection)
  const playWhoosh = useCallback(async () => {
    if (!isSoundEnabled) return
    try {
      const ctx = await resumeAudioContext()
      playWhooshSound(ctx, 0.2)
    } catch (e) {
      console.warn('Could not play whoosh sound:', e)
    }
  }, [isSoundEnabled])

  // Play chime sound (for treasure collection)
  const playChime = useCallback(async () => {
    if (!isSoundEnabled) return
    try {
      const ctx = await resumeAudioContext()
      playChimeSound(ctx, 0.25)
    } catch (e) {
      console.warn('Could not play chime sound:', e)
    }
  }, [isSoundEnabled])

  return {
    isSoundEnabled,
    toggleSound,
    playTap,
    playWhoosh,
    playChime
  }
}

export default useSound
