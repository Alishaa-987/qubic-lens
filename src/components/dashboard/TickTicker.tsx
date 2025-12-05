'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Activity, Clock, Server, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export function TickTicker() {
    // Local state for "fake" live data
    const [tick, setTick] = useState(1459200)
    const [epoch, setEpoch] = useState(112)
    const [latency, setLatency] = useState(45)

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(prev => prev + 1)
            setLatency(Math.floor(Math.random() * (120 - 30 + 1) + 30)) // Random 30-120ms
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const stats = [
        { label: "Current Tick", value: `#${tick}`, icon: Activity, color: "text-blue-500" },
        { label: "Epoch", value: epoch, icon: Clock, color: "text-purple-500" },
        { label: "Latency", value: `${latency}ms`, icon: Zap, color: "text-yellow-500" },
        { label: "Peers", value: "24/24", icon: Server, color: "text-green-500" },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <Card key={i} className="bg-card border-border shadow-sm hover:border-blue-500/30 transition-colors">
                    <CardContent className="p-4 flex flex-col justify-between h-full">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</span>
                            <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <div className="text-2xl font-mono font-bold text-foreground">
                            {stat.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}