
import { create } from 'zustand'

type FunctionName = 'DEPOSIT' | 'WITHDRAW' | 'TRANSFER'

interface ContractState {
    // Virtual Contract Memory
    balance: number
    totalDeposits: number
    sharePrice: number

    // Execution State
    isExecuting: boolean
    txStep: number // 0=Idle, 1=Signing, 2=Routing, 3=Executing, 4=Finalizing
    lastBurn: number

    // Actions
    executeFunction: (fn: FunctionName, amount: number) => Promise<void>
    reset: () => void
}

export const useContractStore = create<ContractState>((set, get) => ({
    // Initial Contract State (Mocking HM25)
    balance: 1000000,
    totalDeposits: 5000,
    sharePrice: 1.05,

    isExecuting: false,
    txStep: 0,
    lastBurn: 0,

    executeFunction: async (fn, amount) => {
        if (get().isExecuting) return

        set({ isExecuting: true, txStep: 1, lastBurn: 0 })

        // STEP 1: Signing (Simulated Delay)
        await new Promise(r => setTimeout(r, 800))
        set({ txStep: 2 })

        // STEP 2: Network Routing
        await new Promise(r => setTimeout(r, 1200))
        set({ txStep: 3 })

        // STEP 3: Execution & State Update (The "Deep Tech" Logic)
        await new Promise(r => setTimeout(r, 600))

        set((state) => {
            let newBalance = state.balance
            let newDeposits = state.totalDeposits
            let burn = 0

            // Simulate specific function logic
            if (fn === 'DEPOSIT') {
                newBalance += amount
                newDeposits += amount
                burn = 1000 + (amount * 0.1) // Simple burn formula
            } else if (fn === 'WITHDRAW') {
                newBalance -= amount
                newDeposits -= amount
                burn = 800
            }

            return {
                balance: newBalance,
                totalDeposits: newDeposits,
                lastBurn: burn,
                txStep: 4
            }
        })

        // STEP 4: Finalization
        await new Promise(r => setTimeout(r, 1000))
        set({ isExecuting: false, txStep: 0 })
    },

    reset: () => set({
        balance: 1000000,
        totalDeposits: 5000,
        txStep: 0,
        isExecuting: false
    })
}))