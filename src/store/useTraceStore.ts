import { SCENARIOS, TraceFrame } from '@/data/mockScenarios'
import { create } from 'zustand'

interface TraceState {
  // Data
  txHash: string
  code: string
  data: TraceFrame[]
  traceLength: number
  
  // Playback State
  stepIndex: number
  isPlaying: boolean
  
  // Computed
  currentFrame: () => TraceFrame
  
  // Actions
  loadTransaction: (hash: string) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  togglePlay: () => void
}

// Default to the first scenario
const DEFAULT_HASH = '0x8f...2a' 

export const useTraceStore = create<TraceState>((set, get) => ({
  txHash: DEFAULT_HASH,
  code: SCENARIOS[DEFAULT_HASH].code,
  data: SCENARIOS[DEFAULT_HASH].trace,
  traceLength: SCENARIOS[DEFAULT_HASH].trace.length,
  
  stepIndex: 0,
  isPlaying: false,

  currentFrame: () => {
    const { data, stepIndex } = get()
    return data[stepIndex] || data[0]
  },

  // THE NEW FUNCTION: LOADS A NEW CARTRIDGE
  loadTransaction: (hash: string) => {
    const scenario = SCENARIOS[hash]
    if (!scenario) {
        console.warn("Tx Hash not found in mock DB")
        return
    }
    
    set({
        txHash: hash,
        code: scenario.code,
        data: scenario.trace,
        traceLength: scenario.trace.length,
        stepIndex: 0, // Reset to start
        isPlaying: false
    })
  },

  setStep: (step) => {
    const { traceLength } = get()
    const safeStep = Math.max(0, Math.min(step, traceLength - 1))
    set({ stepIndex: safeStep })
  },
  
  nextStep: () => {
    const { stepIndex, traceLength } = get()
    if (stepIndex < traceLength - 1) {
      set({ stepIndex: stepIndex + 1 })
    } else {
      set({ isPlaying: false })
    }
  },
  
  prevStep: () => {
    const { stepIndex } = get()
    if (stepIndex > 0) set({ stepIndex: stepIndex - 1 })
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying }))
}))