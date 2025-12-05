// Rationale:
// 1. Switched to MAINNET (Testnet is down).
// 2. Added MOCK FALLBACK so development is never blocked.
// 3. This ensures you can build the UI even if the entire Qubic network is offline.

import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

// STRATEGY: Try Mainnet, Fallback to Mock
const MAINNET_RPC = 'https://rpc.qubic.org/v1'

// Mock Data for when RPC fails
const MOCK_TICK = {
    "tick": 12456789,
    "duration": 2,
    "epoch": 105,
    "initialTick": 12000000,
    "timestamp": Date.now()
}

app.get('/tick', async (c) => {
    const start = Date.now()
    console.log(`[OBSERVER] 🔵 Request received: /api/tick`)

    try {
        // Attempt 1: Fetch from Mainnet
        console.log(`[OBSERVER] 📡 Attempting Mainnet Connection...`)

        // Set a short timeout (3s) so we don't wait forever
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000)

        const response = await fetch(`${MAINNET_RPC}/tick-info`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
            signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.ok) {
            const data = await response.json()
            console.log(`[OBSERVER] 🟢 SUCCESS: Fetched from Mainnet in ${Date.now() - start}ms`)
            return c.json(data)
        }

        throw new Error(`Upstream Error: ${response.status}`)

    } catch (error: any) {
        // Attempt 2: Fallback to Mock
        console.warn(`[OBSERVER] ⚠️ RPC FAILED (${error.message}). Switching to MOCK MODE.`)

        return c.json({
            ...MOCK_TICK,
            _isMock: true, // Flag to show in UI
            timestamp: Date.now()
        })
    }
})

export const GET = handle(app)
export const POST = handle(app)