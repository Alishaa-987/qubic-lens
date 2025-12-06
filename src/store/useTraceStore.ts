import { SCENARIOS, TraceFrame } from '@/data/mockScenarios'
import { DAP } from '@/lib/dap'
import { create } from 'zustand'

interface TraceState {
  // Core Data
  txHash: string
  code: string
  data: TraceFrame[]
  traceLength: number
  
  // Playback State
  stepIndex: number
  isPlaying: boolean
  
  // Computed (Helper to get current frame data)
  currentFrame: () => TraceFrame
  
  // DAP ADAPTER SELECTORS (The "God Mode" conversions)
  getDAPStackFrames: () => DAP.StackFrame[]
  getDAPScopes: () => DAP.Scope[]
  getDAPVariables: (reference: number) => DAP.Variable[]
  
  // Actions
  loadTransaction: (hash: string) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  togglePlay: () => void
}

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

  // ----------------------------------------------
  // DAP ADAPTER IMPLEMENTATION
  // ----------------------------------------------
  
  // Convert our custom "stack" array into DAP StackFrames
  getDAPStackFrames: () => {
    const frame = get().currentFrame()
    
    // We assume the last item in our mock stack is the top frame
    // In a real debugger, we'd have full stack data.
    // Here we simulate it based on the mock data.
    return [
        {
            id: 1, // Top frame
            name: frame.label, // e.g. "deposit(100)"
            line: frame.line,
            column: 1,
            source: { name: 'contract.cpp' }
        },
        {
            id: 2, // Caller
            name: 'main()',
            line: 1,
            column: 1,
            source: { name: 'system' }
        }
    ]
  },

  // Define Scopes (Local, Global)
  getDAPScopes: () => {
    return [
        { name: 'Locals', variablesReference: 1, expensive: false },
        { name: 'Global State', variablesReference: 2, expensive: false }
    ]
  },

  // Get Variables based on the Scope Reference
  getDAPVariables: (ref: number) => {
    const frame = get().currentFrame()
    
    if (ref === 1) { // LOCALS
        // Extract arguments from memory (simplified logic)
        return Object.entries(frame.memory)
            .filter(([key]) => key !== 'balance' && key !== 'deposits') // Exclude globals
            .map(([key, val], i) => ({
                name: key,
                value: String(val),
                type: 'uint64',
                variablesReference: 0
            }))
    }
    
    if (ref === 2) { // GLOBALS
        return [
            { name: 'state.balance', value: String(frame.memory.balance), type: 'uint64', variablesReference: 0 },
            { name: 'state.totalDeposits', value: String(frame.memory.deposits || 0), type: 'uint64', variablesReference: 0 }
        ]
    }

    return []
  },

  // ----------------------------------------------
  // ACTIONS
  // ----------------------------------------------

  loadTransaction: (hash: string) => {
    const scenario = SCENARIOS[hash]
    if (!scenario) {
        console.warn("Tx Hash not found")
        return
    }
    
    set({
        txHash: hash,
        code: scenario.code,
        data: scenario.trace,
        traceLength: scenario.trace.length,
        stepIndex: 0,
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