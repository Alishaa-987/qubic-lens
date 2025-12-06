'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useTraceStore } from '@/store/useTraceStore'
import {
  AlertCircle,
  Box,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CornerDownRight,
  Cpu,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Search
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { AIInsightPanel } from './AIInsightPanel'

export function Debugger() {
  const store = useTraceStore()
  const frame = store.currentComputedFrame()
  const session = store.session
  const isLoaded = store.isLoaded()

  // Local state for the search bar
  const [inputHash, setInputHash] = useState('')

  // Auto-play Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (store.isPlaying) {
      interval = setInterval(() => {
        store.nextStep()
      }, 1000) // 1 second per step
    }
    return () => clearInterval(interval)
  }, [store, store.isPlaying, store.nextStep])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[750px] font-sans">
      
      {/* =========================================
          LEFT PANEL: CODE EDITOR & CONTROLS
         ========================================= */}
      <Card className="lg:col-span-8 flex flex-col border-border shadow-2xl overflow-hidden bg-[#0a0a0a] text-white">
        
        {/* TOOLBAR */}
        <div className="h-14 bg-muted/20 backdrop-blur flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-4 flex-1">
             
             {/* SEARCH BAR (Dynamic Cartridge Loader) */}
             <div className="relative group w-64 hidden sm:block">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search Tx (e.g. 0x9c...bb)"
                    className="w-full bg-background/50 border border-border rounded pl-8 pr-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:border-blue-500 transition-all placeholder:text-muted-foreground/50"
                    value={inputHash}
                    onChange={(e) => setInputHash(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            store.loadTraceByHash(inputHash)
                            setInputHash('')
                        }
                    }}
                />
             </div>

             {isLoaded && (
                <div className="flex items-center gap-2">
                    <Badge className="bg-blue-900/20 text-blue-400 border-blue-500/50 font-mono text-[10px] hidden md:flex">
                        {session?.txHash}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Cpu size={14} />
                        <span>Gas: <span className="text-zinc-200 font-mono">{frame.gasTotal} QU</span></span>
                    </div>
                </div>
             )}
          </div>
          
          {/* PLAYBACK CONTROLS (VCR Style) */}
          <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-md p-1.5 border border-border">
             <button 
                onClick={() => store.setStep(0)} 
                title="Reset"
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isLoaded}
             >
                <RotateCcw size={14}/>
             </button>
             <Separator orientation="vertical" className="h-4 bg-[#333]" />
             <button 
                onClick={store.prevStep} 
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isLoaded}
             ><ChevronLeft size={16}/></button>
             <button 
               onClick={store.togglePlay}
               disabled={!isLoaded}
               className={cn(
                   "flex items-center gap-2 px-4 py-1 rounded text-xs font-bold transition-all mx-1 disabled:opacity-50 disabled:cursor-not-allowed",
                   store.isPlaying 
                    ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30" 
                    : "bg-blue-600 text-white hover:bg-blue-500"
               )}
             >
               {store.isPlaying ? <Pause size={12}/> : <Play size={12}/>}
               {store.isPlaying ? 'PAUSE' : 'DEBUG'}
             </button>
             <button 
                onClick={store.nextStep} 
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isLoaded}
             ><ChevronRight size={16}/></button>
          </div>
        </div>

        {/* CODE VISUALIZATION */}
        <div className="flex-1 relative overflow-hidden font-mono text-sm">
          <SyntaxHighlighter
            language="cpp"
            style={vscDarkPlus}
            customStyle={{ 
                margin: 0, 
                padding: '1.5rem', 
                height: '100%', 
                fontSize: '14px', 
                lineHeight: '1.6',
                backgroundColor: '#0a0a0a' 
            }}
            showLineNumbers={true}
            wrapLines={true}
            lineProps={(lineNumber) => {
              const isActive = isLoaded && lineNumber === frame.line
              const isError = isLoaded && frame.isError && isActive
              return {
                style: {
                  backgroundColor: isError ? 'rgba(239, 68, 68, 0.2)' : isActive ? 'rgba(59, 130, 246, 0.15)' : undefined,
                  display: 'block',
                  borderLeft: isError ? '4px solid #ef4444' : isActive ? '4px solid #3b82f6' : '4px solid transparent',
                  paddingLeft: isActive ? '12px' : '16px',
                  width: '100%'
                }
              }
            }}
          >
            {session?.artifact.code ?? "// Load a transaction trace to begin debugging..."}
          </SyntaxHighlighter>
          
          {/* FLOATING OP-CODE CARD */}
          {isLoaded && (
            <div className="absolute bottom-6 right-8 bg-card/90 backdrop-blur-md border border-border p-4 rounded-lg shadow-2xl flex flex-col gap-2 min-w-[200px] animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Current Opcode</div>
              <div className={cn("text-sm font-mono font-bold flex items-center gap-2", frame.isError ? "text-red-500" : "text-blue-400")}>
                  {frame.isError ? <AlertCircle size={14}/> : <CornerDownRight size={14} />}
                  {frame.type}
              </div>
            </div>
          )}
        </div>

        {/* SCRUBBER TIMELINE */}
        <div className="bg-muted/10 border-t border-border px-6 py-4">
          <input 
            type="range"
            min="0"
            max={(session?.frames.length ?? 1) - 1}
            value={store.stepIndex}
            onChange={(e) => store.setStep(parseInt(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all disabled:bg-muted/50 disabled:accent-muted"
            disabled={!isLoaded}
          />
          <div className="flex justify-between mt-3 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
             <span>Start</span>
             {isLoaded ? (
                <span className="text-blue-400">Step {store.stepIndex + 1} / {session?.frames.length}</span>
             ) : (
                <span>- / -</span>
             )}
             <span>End</span>
          </div>
        </div>
      </Card>

      {/* =========================================
          RIGHT PANEL: DATA & STATE (DAP INTEGRATED)
         ========================================= */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* A. MEMORY DELTA (Diff View) */}
        <Card className="flex flex-col overflow-hidden border-border bg-card shadow-lg min-h-[160px]">
           <div className="p-3 border-b border-border bg-muted/20 font-bold text-xs text-muted-foreground uppercase tracking-wider flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Box size={14} /> Memory Delta
             </div>
             {frame.diff && <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200 text-[10px] px-1.5">Active Write</Badge>}
           </div>
           
           <div className="flex-1 p-4 flex items-center justify-center bg-card/50">
             {!frame.diff || !isLoaded ? (
               <div className="text-center text-muted-foreground/50">
                 <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                 <p className="text-xs font-medium">State remains stable</p>
               </div>
             ) : (
               <div className="w-full space-y-3 animate-in zoom-in-95 duration-200">
                 <div className="flex justify-between items-center text-xs pb-2 border-b border-border/50">
                   <span className="font-bold text-muted-foreground uppercase">Target</span>
                   <span className="font-mono text-foreground font-bold bg-muted px-2 py-0.5 rounded">{frame.diff.var}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2">
                   <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Old</div>
                      <div className="font-mono text-red-400 font-bold text-sm">{frame.diff.old}</div>
                   </div>
                   <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-[10px] text-green-400 uppercase font-bold mb-1">New</div>
                      <div className="font-mono text-green-400 font-bold text-sm">{frame.diff.new}</div>
                   </div>
                 </div>
               </div>
             )}
           </div>
        </Card>

        {/* B. CALL STACK (DAP Feature) */}
        <Card className="border-border bg-card shadow-sm p-0 overflow-hidden">
            <div className="p-2 border-b border-border bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Layers size={14} /> Call Stack
            </div>
            <div className="p-0">
                {store.getDAPStackFrames().map((stackFrame) => (
                    <div key={stackFrame.id} className="flex justify-between items-center p-2 px-4 hover:bg-muted/10 border-b border-border/40 last:border-0 text-xs font-mono transition-colors">
                        <span className="text-blue-400 font-bold">{stackFrame.name}</span>
                        <span className="text-muted-foreground">{stackFrame.source?.name}:{stackFrame.line}</span>
                    </div>
                ))}
            </div>
        </Card>

        {/* C. MULTI-TOOL PANEL (State + AI) */}
        <div className="flex-1 flex flex-col shadow-lg overflow-hidden">
            <Tabs defaultValue="state" className="h-full flex flex-col">
                <TabsList className="w-full bg-muted/20 border-b border-border p-0 justify-start h-9 rounded-t-lg rounded-b-none">
                    <TabsTrigger value="state" className="text-xs font-mono h-full rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent">
                       GLOBAL STATE
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="text-xs font-mono h-full rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 data-[state=active]:bg-transparent text-purple-400">
                       AI INSIGHT
                    </TabsTrigger>
                </TabsList>

                {/* TAB 1: RAW STATE (Using DAP Protocol) */}
                <TabsContent value="state" className="flex-1 mt-0 border border-t-0 border-border bg-card rounded-b-lg overflow-hidden">
                    <div className="h-full overflow-auto p-0">
                        <div className="divide-y divide-border/50">
                            {/* Fetch Variables for Scope Ref 2 (Global) */}
                            {store.getDAPVariables(2).map((variable) => (
                                <div key={variable.name} className="flex justify-between items-center p-2 px-4 hover:bg-muted/10 transition-colors text-xs">
                                    <span className="font-mono text-muted-foreground">{variable.name}</span>
                                    <span className="font-mono font-bold text-blue-400">{variable.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: AI ANALYST */}
                <TabsContent value="ai" className="flex-1 mt-0">
                    <AIInsightPanel analysis={frame.aiAnalysis || "Analysis pending..."} isActive={true} isError={frame.isError} />
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  )
}