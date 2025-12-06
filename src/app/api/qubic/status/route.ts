import { NextResponse } from 'next/server'

// Qubic Mainnet/Testnet RPC
const RPC_URL = 'https://rpc.qubic.org/v1' 

export async function GET() {
    try {
        const start = performance.now()
        
        // 1. Fetch Tick Info
        const tickRes = await fetch(`${RPC_URL}/tick-info`, { next: { revalidate: 1 } })
        const tickData = await tickRes.json()
        
        // 2. Calculate Latency
        const latency = Math.round(performance.now() - start)

        return NextResponse.json({
            tick: tickData.tick || 0,
            epoch: tickData.epoch || 0,
            duration: tickData.duration || 0,
            latency: latency,
            timestamp: Date.now()
        })
    } catch (error) {
        console.error("RPC Error:", error)
        // Fallback if RPC is down
        return NextResponse.json({ 
            tick: 1450000, 
            epoch: 112, 
            duration: 1, 
            latency: 0, 
            error: true 
        })
    }
}