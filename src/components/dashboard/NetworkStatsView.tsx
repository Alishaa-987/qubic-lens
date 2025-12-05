'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Box, Server, Zap } from 'lucide-react'

// FAKE DATA FOR CHARTS
const HASHRATE_BARS = [40, 60, 45, 70, 85, 60, 75, 50, 65, 90, 80, 70, 95, 85, 60, 75, 80, 90, 100, 85, 70, 60, 75, 80]

export function NetworkStatsView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Global Hashrate" value="45.2 Mh/s" sub="+5.2% vs 1h ago" icon={Zap} color="text-yellow-500" />
        <StatsCard title="Active Computors" value="676 Nodes" sub="98.2% Uptime" icon={Server} color="text-blue-500" />
        <StatsCard title="Avg Block Time" value="0.92s" sub="Epoch 112" icon={Activity} color="text-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART AREA (CSS Only to keep it light) */}
        <Card className="lg:col-span-2 border-border bg-card">
            <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Real-time Network Load
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 flex items-end gap-2 pt-4">
                    {HASHRATE_BARS.map((h, i) => (
                        <div 
                            key={i} 
                            className="flex-1 bg-blue-600/20 hover:bg-blue-500/50 transition-all rounded-t-sm relative group"
                            style={{ height: `${h}%` }}
                        >
                            {/* Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {h * 12} Tx/s
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-muted-foreground font-mono">
                    <span>-60s</span>
                    <span>-30s</span>
                    <span>Now</span>
                </div>
            </CardContent>
        </Card>

        {/* RECENT BLOCKS */}
        <Card className="border-border bg-card overflow-hidden">
            <CardHeader className="bg-muted/20 border-b border-border py-3">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                    <Box className="w-4 h-4" /> Latest Blocks
                </CardTitle>
            </CardHeader>
            <div className="divide-y divide-border/50">
                {[1,2,3,4,5,6].map((_, i) => (
                    <div key={i} className="p-3 flex items-center justify-between hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-900/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                                BK
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-foreground">Block #{1459200 - i}</span>
                                <span className="text-[10px] text-muted-foreground">Miner: 0x8f...2a</span>
                            </div>
                        </div>
                        <Badge variant="outline" className="border-border text-muted-foreground text-[10px] font-mono">
                            {0.8 + (i * 0.1)}s
                        </Badge>
                    </div>
                ))}
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
                        <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted/30 ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}