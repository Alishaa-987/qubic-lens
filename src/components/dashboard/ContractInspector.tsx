'use client'

import { useState } from 'react'
import { useContractStore } from '@/store/useContractStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
    Play,
    Flame,
    Database,
    Cpu,
    CheckCircle2,
    Loader2,
    Sparkles,
    Scroll
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ContractInspector() {
    const store = useContractStore()
    const [amount, setAmount] = useState('100')
    const [activeTab, setActiveTab] = useState('state')

    const handleExecute = () => {
        const val = parseInt(amount) || 0
        store.executeFunction('DEPOSIT', val)
        setActiveTab('visualization')
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] font-sans">

            {/* LEFT PANEL: THE GRIMOIRE (Code) */}
            <Card className="lg:col-span-5 flex flex-col overflow-hidden border-2 border-primary/20 shadow-md">
                <CardHeader className="bg-secondary/30 border-b border-border py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Scroll className="w-5 h-5 text-primary" />
                            <span className="font-serif font-bold text-lg text-foreground">HM25_Script.cpp</span>
                        </div>
                        <Badge variant="outline" className="border-primary text-primary bg-primary/10">
                            C++ Logic
                        </Badge>
                    </div>
                </CardHeader>
                <div className="flex-1 p-6 bg-[#fcfbf9] dark:bg-[#1a1f1a] font-mono text-xs overflow-auto relative">
                    <pre className="text-muted-foreground leading-relaxed">
                        {`#include "qubic_definitions.h"

// THE ANCIENT LAWS (State)
struct State {
    uint64_t totalDeposits;
    uint64_t balance;
    uint64_t sharePrice;
};

// PUBLIC RITUAL: DEPOSIT
// ID: 1
void deposit(uint64_t amount) {
    // 1. Check constraints
    if (amount <= 0) return;

    // 2. Transmute State
    state.balance += amount;
    state.totalDeposits += amount;
    
    // 3. Emit Energy
    emit_event(DEPOSIT_EVENT, amount);
}`}
                    </pre>
                    {/* MAGICAL HIGHLIGHT */}
                    <AnimatePresence>
                        {store.isExecuting && (
                            <motion.div
                                initial={{ opacity: 0, width: "0%" }}
                                animate={{ opacity: 1, width: "100%" }}
                                className="absolute left-0 top-[150px] h-6 bg-accent/20 border-l-4 border-accent"
                            />
                        )}
                    </AnimatePresence>
                </div>
            </Card>

            {/* RIGHT PANEL: THE CRYSTAL BALL (Visualization) */}
            <div className="lg:col-span-7 flex flex-col gap-4">

                {/* CONTROL DECK */}
                <Card className="border-2 border-primary/20 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-serif font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-accent" />
                            Cast Spell (Transaction)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-end gap-4">
                        <div className="grid gap-1.5 flex-1">
                            <label className="text-xs font-bold text-foreground/70">Ritual Type</label>
                            <select className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring">
                                <option>deposit (id: 1)</option>
                                <option>withdraw (id: 2)</option>
                            </select>
                        </div>
                        <div className="grid gap-1.5 flex-1">
                            <label className="text-xs font-bold text-foreground/70">Energy (QU)</label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="font-mono rounded-xl"
                            />
                        </div>
                        <Button
                            onClick={handleExecute}
                            disabled={store.isExecuting}
                            className={cn("w-32 rounded-xl font-bold shadow-md transition-all", store.isExecuting ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105")}
                        >
                            {store.isExecuting ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Play className="w-4 h-4 mr-2 fill-current" />
                            )}
                            {store.isExecuting ? 'Casting...' : 'Ignite'}
                        </Button>
                    </CardContent>
                </Card>

                {/* VISUALIZATION DECK */}
                <Card className="flex-1 flex flex-col overflow-hidden border-2 border-primary/20 shadow-md">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                        <div className="px-6 pt-4 border-b border-border bg-muted/20">
                            <TabsList className="grid w-full grid-cols-2 bg-transparent">
                                <TabsTrigger value="state" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-t-lg">Current Harmony</TabsTrigger>
                                <TabsTrigger value="visualization" className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-t-lg">Spell Trace</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* TAB A: RAW STATE */}
                        <TabsContent value="state" className="flex-1 p-6 bg-card/50">
                            <div className="grid grid-cols-2 gap-4">
                                <StateMetric
                                    label="Contract Balance"
                                    value={store.balance.toLocaleString()}
                                    suffix="QU"
                                    changed={store.txStep === 4}
                                />
                                <StateMetric
                                    label="Total Deposits"
                                    value={store.totalDeposits.toLocaleString()}
                                    suffix="QU"
                                    changed={store.txStep === 4}
                                />
                                <StateMetric
                                    label="Share Price"
                                    value={store.sharePrice.toFixed(4)}
                                    suffix=""
                                />
                            </div>
                        </TabsContent>

                        {/* TAB B: EXECUTION VISUALIZER */}
                        <TabsContent value="visualization" className="flex-1 p-6 flex flex-col justify-center relative bg-card/50">

                            {/* GHIBLI STYLE FLOW */}
                            <div className="flex items-center justify-between relative z-10 px-4">
                                <StepNode step={1} current={store.txStep} icon={Database} label="Origin" />
                                <Connector active={store.txStep > 1} />
                                <StepNode step={2} current={store.txStep} icon={Cpu} label="The Network" />
                                <Connector active={store.txStep > 2} />
                                <StepNode step={3} current={store.txStep} icon={Flame} label="The Core" />
                                <Connector active={store.txStep > 3} />
                                <StepNode step={4} current={store.txStep} icon={CheckCircle2} label="Harmony" />
                            </div>

                            {/* BURN CARD */}
                            <AnimatePresence>
                                {store.txStep === 4 && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                                        animate={{ scale: 1, opacity: 1, y: 0 }}
                                        className="mt-12 mx-auto bg-accent/10 border border-accent/50 rounded-2xl p-6 flex items-center gap-6 shadow-lg max-w-md"
                                    >
                                        <div className="p-4 bg-accent/20 rounded-full">
                                            <Flame className="w-8 h-8 text-accent animate-pulse" />
                                        </div>
                                        <div>
                                            <h4 className="font-serif font-bold text-lg text-foreground">Transformation Complete</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Consumed <span className="font-mono font-bold text-accent">{store.lastBurn} QU</span> essence.
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </TabsContent>
                    </Tabs>
                </Card>
            </div>
        </div>
    )
}

function StateMetric({ label, value, suffix, changed }: any) {
    return (
        <div className={cn(
            "p-5 rounded-2xl border-2 transition-all duration-500",
            changed ? "bg-primary/10 border-primary shadow-inner" : "bg-white/50 border-transparent shadow-sm"
        )}>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{label}</div>
            <div className={cn(
                "text-3xl font-mono font-bold flex items-center gap-2",
                changed ? "text-primary-foreground dark:text-primary" : "text-foreground"
            )}>
                {value} <span className="text-sm text-muted-foreground font-normal">{suffix}</span>
            </div>
        </div>
    )
}

function StepNode({ step, current, icon: Icon, label }: any) {
    const isActive = current >= step
    const isPulse = current === step

    return (
        <div className="flex flex-col items-center gap-3">
            <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all duration-500 z-10 bg-background shadow-lg",
                isActive ? "border-primary text-primary" : "border-muted text-muted-foreground",
                isPulse && "scale-110 shadow-primary/30"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <span className={cn(
                "text-xs font-bold font-serif transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
            )}>{label}</span>
        </div>
    )
}

function Connector({ active }: { active: boolean }) {
    return (
        <div className="flex-1 h-[3px] bg-muted relative -top-4 mx-2 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: "0%" }}
                animate={{ width: active ? "100%" : "0%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="h-full bg-primary"
            />
        </div>
    )
}