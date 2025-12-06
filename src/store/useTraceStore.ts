import { SCENARIOS } from '@/data/mockScenarios'
import { DAP } from '@/lib/dap'
import { ExecutionFrame, TraceSession } from '@/types/engine'
import { create } from 'zustand'

// --- ADAPTER: Converts old mock data to the new TraceSession format ---
// This is temporary and will be removed when we have a real data source.
const convertMockToSession = (hash: string): TraceSession | null => {
    const scenario = SCENARIOS[hash]
    if (!scenario) return null

    // The old mock used a different shape, we adapt it here.
    const frames: ExecutionFrame[] = scenario.trace.map(f => ({
        id: f.id,
        line: f.line,
        type: f.type,
        label: f.label,
        gasTotal: f.gas, // Old 'gas' was cumulative
        depth: f.depth,
        memory: f.memory,
        stack: f.stack,
        aiAnalysis: f.aiAnalysis,
        isError: f.isError,
    }));

    const lastFrame = frames[frames.length - 1];
    return {
        txHash: hash,
        timestamp: Date.now(),
        artifact: {
            fileName: 'contract.cpp',
            code: scenario.code,
        },
        frames,
        totalGas: lastFrame.gasTotal,
        status: lastFrame.isError ? 'REVERT' : 'SUCCESS',
    }
}
// --- END ADAPTER ---

// An empty frame to return when no session is loaded, preventing UI errors.
const EMPTY_FRAME: ExecutionFrame = {
    id: 0, line: 0, type: 'IDLE', label: 'No Trace Loaded', gasTotal: 0,
    depth: 0, memory: {}, stack: [], aiAnalysis: 'Load a transaction to begin.'
}

// A computed frame with additional UI-specific data.
export interface ComputedFrame extends ExecutionFrame {
    diff: { var: string; old: any; new: any } | null;
}
const EMPTY_COMPUTED_FRAME: ComputedFrame = { ...EMPTY_FRAME, diff: null };


interface TraceState {
  session: TraceSession | null
  stepIndex: number
  isPlaying: boolean

  // Selectors
  isLoaded: () => boolean
  currentFrame: () => ExecutionFrame
  currentComputedFrame: () => ComputedFrame

  // DAP Selectors
  getDAPStackFrames: () => DAP.StackFrame[]
  getDAPScopes: () => DAP.Scope[]
  getDAPVariables: (reference: number) => DAP.Variable[]

  // Actions
  loadTraceByHash: (hash: string) => void
  loadTraceSession: (session: TraceSession) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  togglePlay: () => void
}

const DEFAULT_HASH = '0x8f...2a'

export const useTraceStore = create<TraceState>((set, get) => ({
  session: convertMockToSession(DEFAULT_HASH),
  stepIndex: 0,
  isPlaying: false,

  isLoaded: () => get().session !== null,

  currentFrame: () => {
    const { session, stepIndex } = get()
    return session?.frames[stepIndex] ?? EMPTY_FRAME
  },

  currentComputedFrame: () => {
    const { session, stepIndex } = get()
    if (!session) return EMPTY_COMPUTED_FRAME;

    const current = session.frames[stepIndex];
    const prev = session.frames[stepIndex - 1];
    
    // Compute diff on the fly
    let diff: ComputedFrame['diff'] = null;
    if (prev) {
        const memoryKeys = Object.keys(current.memory);
        for(const key of memoryKeys) {
            if (current.memory[key] !== prev.memory[key]) {
                diff = { var: key, old: prev.memory[key], new: current.memory[key] };
                break;
            }
        }
    }
    return { ...current, diff };
  },

  // --- DAP ADAPTER IMPLEMENTATION (Updated) ---
  getDAPStackFrames: () => {
    const frame = get().currentFrame()
    if (frame.type === 'IDLE') return [];
    return [
      { id: 1, name: frame.label, line: frame.line, column: 1, source: { name: get().session?.artifact.fileName } },
      { id: 2, name: 'main()', line: 1, column: 1, source: { name: 'system' } }
    ]
  },

  getDAPScopes: () => {
    if (!get().isLoaded()) return [];
    return [
      { name: 'Locals', variablesReference: 1, expensive: false },
      { name: 'Global State', variablesReference: 2, expensive: false }
    ]
  },

  getDAPVariables: (ref: number) => {
    const frame = get().currentFrame()
    if (frame.type === 'IDLE') return [];
    // This logic can be refined, but demonstrates the principle
     if (ref === 2) { // GLOBALS
        return Object.entries(frame.memory).map(([key, val]) => ({
            name: `state.${key}`, value: String(val), type: 'uint64', variablesReference: 0
        }));
    }
    return []
  },

  // --- ACTIONS (Updated) ---
  loadTraceByHash: (hash: string) => {
    const session = convertMockToSession(hash)
    if (session) {
      set({ session, stepIndex: 0, isPlaying: false })
    } else {
      console.warn(`No mock scenario found for hash: ${hash}`)
    }
  },

  loadTraceSession: (session: TraceSession) => {
      set({ session, stepIndex: 0, isPlaying: false });
  },

  setStep: (step) => {
    const session = get().session
    if (!session) return
    const safeStep = Math.max(0, Math.min(step, session.frames.length - 1))
    set({ stepIndex: safeStep })
  },
  
  nextStep: () => {
    const { stepIndex, session } = get()
    if (!session || stepIndex >= session.frames.length - 1) {
      set({ isPlaying: false })
    } else {
      set({ stepIndex: stepIndex + 1 })
    }
  },
  
  prevStep: () => {
    const { stepIndex } = get()
    if (stepIndex > 0) set({ stepIndex: stepIndex - 1 })
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying }))
}))