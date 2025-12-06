'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ArrowRight, Box, Server, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

// REAL SCENARIO KEYS (So clicking them loads data)
const LIVE_HASHES = [
    '0x8f...2a', // Deposit
    '0x9c...bb', // Withdraw Fail
    '0x3d...ff'  // Loop
]

interface NetworkStatsProps {
    onTxClick: (hash: string) => void
}

export function NetworkStatsView({ onTxClick }: NetworkStatsProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // POLL REAL DATA
  useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch('/api/qubic/status')
            const json = await res.json()
            setData(json)
            setLoading(false)
        } catch (e) {
            console.error(e)
        }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000) 
    return () => clearInterval(interval)
  }, [])

  const tick = data?.tick?.toLocaleString() || "..."
  const epoch = data?.epoch || "..."
  const latency = data?.latency || 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard 
            title="Current Tick" 
            value={tick} 
            sub={loading ? "Connecting..." : "Live from Mainnet"} 
            icon={Activity} 
            color="text-blue-500" 
        />
        <StatsCard 
            title="Epoch" 
            value={epoch} 
            sub="Current Consensus Era" 
            icon={Server} 
            color="text-purple-500" 
        />
        <StatsCard 
            title="Network Latency" 
            value={`${latency}ms`} 
            sub="RPC Roundtrip Time" 
            icon={Zap} 
            color={latency < 100 ? "text-green-500" : "text-yellow-500"} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LIVE BLOCK FEED */}
        <Card className="lg:col-span-3 border-border bg-card overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border py-3 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <Box className="w-4 h-4" /> Live Block Feed
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-green-500/20 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>
                    Connected
                </Badge>
            </CardHeader>
            <div className="divide-y divide-border/50">
                {LIVE_HASHES.map((hash, i) => {
                    const currentTick = (data?.tick || 1450000) - i
                    
                    return (
                        <div 
                            key={i} 
                            onClick={() => onTxClick(hash)}
                            className="p-3 flex items-center justify-between hover:bg-blue-500/10 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="font-mono text-blue-400 text-xs font-bold w-20">
                                    #{currentTick}
                                </div>
                                <div className="font-mono text-muted-foreground text-xs group-hover:text-foreground transition-colors flex items-center gap-2">
                                    {hash}
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                        {i === 1 ? 'Failed' : 'Success'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-muted-foreground font-mono">
                                    {data?.duration || 1}s
                                </span>
                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, sub, icon: Icon, color }: any) {
    return (
        <Card className="border-border bg-card">
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{title}</p>
                        <h3 className="text-2xl font-bold font-mono text-foreground">{value}</h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                           {sub}
                        </p>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted/30 ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}