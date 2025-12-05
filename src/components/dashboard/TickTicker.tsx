'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQubicStore } from '@/store/useQubicStore'
import { motion } from 'framer-motion'
import { Activity, Clock, Wifi, WifiOff, Zap } from 'lucide-react'
import { useEffect } from 'react'

export function TickTicker() {
    const { tickData, startPolling, stopPolling, isLive } = useQubicStore()

    useEffect(() => {
        startPolling()
        return () => stopPolling()
    }, [])

    if (!tickData) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse border-dashed">
                        <CardHeader className="pb-2">
                            <div className="h-4 w-24 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-muted rounded"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
            {/* CARD 1: CURRENT TICK */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Current Tick
                        </CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">
                            #{tickData.tick}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            {isLive ? <Wifi className="w-3 h-3 text-green-500" /> : <WifiOff className="w-3 h-3 text-orange-500" />}
                            {isLive ? 'Live Mainnet' : 'Mock Mode'}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* CARD 2: EPOCH */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Current Epoch
                        </CardTitle>
                        <Clock className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">
                            {tickData.epoch}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(tickData.timestamp || Date.now).toLocaleTimeString()}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* CARD 3: DURATION / SPEED */}
            <motion.div variants={item}>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Tick Duration
                        </CardTitle>
                        <Zap className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-mono">
                            {tickData.duration || 0}s
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Avg Network Speed
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    )
}