// Rationale: Centralized state management for Qubic data. 

import { create } from 'zustand'
import axios from 'axios'

interface QubicState {
    tickData: any | null
    isLoading: boolean
    isLive: boolean // True if real RPC, False if Mock
    lastUpdated: number
    fetchTick: () => Promise<void>
    startPolling: () => void
    stopPolling: () => void
}

let intervalId: NodeJS.Timeout

export const useQubicStore = create<QubicState>((set, get) => ({
    tickData: null,
    isLoading: false,
    isLive: false,
    lastUpdated: 0,

    fetchTick: async () => {
        set({ isLoading: true })
        try {
            const response = await axios.get('/api/tick')
            set({
                tickData: response.data,
                isLive: !response.data._isMock, // Check for our mock flag
                lastUpdated: Date.now(),
                isLoading: false
            })
        } catch (error) {
            console.error('Failed to fetch tick', error)
            set({ isLoading: false })
        }
    },

    startPolling: () => {
        // Poll every 1 second (approx tick time)
        get().fetchTick()
        intervalId = setInterval(() => {
            get().fetchTick()
        }, 1000)
    },

    stopPolling: () => {
        clearInterval(intervalId)
    }
}))