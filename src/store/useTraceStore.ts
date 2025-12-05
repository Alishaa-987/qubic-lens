import { create } from 'zustand'

export interface TraceStep {
  stepId: number
  lineNo: number       // Which line to highlight
  instruction: string  // Opcode or Action name
  gasUsed: number      // Cumulative QU burn
  
  // The State at this exact moment
  memory: {
    balance: number
    totalDeposits: number
    temp_amount?: number
  }
  
  // Call Stack simulation
  stack: string[]
}

interface TraceState {
  currentStep: number
  totalSteps: number
  trace: TraceStep[]
  isPlaying: boolean
  
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  togglePlay: () => void
}

// THE HARDCODED "REAL" DATA (HM25 Deposit Logic)
const MOCK_TRACE: TraceStep[] = [
  { 
    stepId: 0, lineNo: 1, instruction: "CALL deposit(100)", gasUsed: 100, 
    memory: { balance: 1000, totalDeposits: 5000, temp_amount: 100 },
    stack: ["main", "deposit"]
  },
  { 
    stepId: 1, lineNo: 4, instruction: "CHECK amount <= 0", gasUsed: 120, 
    memory: { balance: 1000, totalDeposits: 5000, temp_amount: 100 },
    stack: ["main", "deposit", "guard_clause"]
  },
  { 
    stepId: 2, lineNo: 7, instruction: "LOAD state.balance", gasUsed: 150, 
    memory: { balance: 1000, totalDeposits: 5000, temp_amount: 100 },
    stack: ["main", "deposit"]
  },
  { 
    stepId: 3, lineNo: 7, instruction: "ADD amount", gasUsed: 200, 
    memory: { balance: 1100, totalDeposits: 5000, temp_amount: 100 },
    stack: ["main", "deposit", "math_op"]
  },
  { 
    stepId: 4, lineNo: 8, instruction: "LOAD state.totalDeposits", gasUsed: 230, 
    memory: { balance: 1100, totalDeposits: 5000, temp_amount: 100 },
    stack: ["main", "deposit"]
  },
  { 
    stepId: 5, lineNo: 8, instruction: "ADD amount", gasUsed: 280, 
    memory: { balance: 1100, totalDeposits: 5100, temp_amount: 100 },
    stack: ["main", "deposit", "math_op"]
  },
  { 
    stepId: 6, lineNo: 11, instruction: "EMIT DEPOSIT_EVENT", gasUsed: 500, 
    memory: { balance: 1100, totalDeposits: 5100 },
    stack: ["main", "deposit", "event_log"]
  },
  { 
    stepId: 7, lineNo: 12, instruction: "RETURN", gasUsed: 510, 
    memory: { balance: 1100, totalDeposits: 5100 },
    stack: ["main"]
  }
]

export const useTraceStore = create<TraceState>((set, get) => ({
  currentStep: 0,
  totalSteps: MOCK_TRACE.length - 1,
  trace: MOCK_TRACE,
  isPlaying: false,

  setStep: (step) => set({ currentStep: Math.max(0, Math.min(step, MOCK_TRACE.length - 1)) }),
  
  nextStep: () => {
    const { currentStep, totalSteps } = get()
    if (currentStep < totalSteps) set({ currentStep: currentStep + 1 })
    else set({ isPlaying: false })
  },
  
  prevStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) set({ currentStep: currentStep - 1 })
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying }))
}))