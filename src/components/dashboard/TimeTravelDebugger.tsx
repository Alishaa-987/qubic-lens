'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useTraceStore } from '@/store/useTraceStore'
import {
    Box,
    ChevronRight,
    Cpu,
    Layers,
    Pause,
    Play,
    SkipBack, SkipForward
} from 'lucide-react'
import { useEffect } from 'react'

// THE CONTRACT CODE DISPLAY
const CODE_LINES = [
  /* 1 */ `void deposit(uint64_t amount) {`,
  /* 2 */ `    // 1. Check constraints`,
  /* 3 */ `    if (amount <= 0) return;`,
  /* 4 */ ``,
  /* 5 */ `    // 2. Transmute State`,
  /* 6 */ `    state.balance += amount;`,
  /* 7 */ `    state.totalDeposits += amount;`,
  /* 8 */ `    `,
  /* 9 */ `    // 3. Emit Energy`,
  /* 10 */`    emit_event(DEPOSIT_EVENT, amount);`,
  /* 11 */`}`
]

export function TimeTravelDebugger() {
  const { currentStep, trace, isPlaying, setStep, nextStep, prevStep, togglePlay } = useTraceStore()
  const activeStepData = trace[currentStep]

  // Auto-play logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => nextStep(), 1000) // 1 second per step
    }
    return () => clearInterval(interval)
  }, [isPlaying, nextStep])

  return (
    <div className="grid grid-cols-12 gap-4 h-[600px] font-sans text-sm">
      
      {/* 1. LEFT: CODE VIEWER (IDE STYLE) */}
      <Card className="col-span-8 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white font-mono text-xs">HM25.cpp</Badge>
            <span className="text-xs text-slate-400">Read-Only</span>
          </div>
          <div className="flex items-center gap-1">
             <button onClick={() => setStep(0)} className="p-1 hover:bg-slate-200 rounded"><SkipBack size={14}/></button>
             <button onClick={prevStep} className="p-1 hover:bg-slate-200 rounded"><ChevronRight className="rotate-180" size={14}/></button>
             <button onClick={togglePlay} className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-700">
                {isPlaying ? <Pause size={12}/> : <Play size={12}/>}
                {isPlaying ? 'PAUSE' : 'PLAY TRACE'}
             </button>
             <button onClick={nextStep} className="p-1 hover:bg-slate-200 rounded"><ChevronRight size={14}/></button>
             <button onClick={() => setStep(trace.length-1)} className="p-1 hover:bg-slate-200 rounded"><SkipForward size={14}/></button>
          </div>
        </div>

        {/* Code Area */}
        <div className="flex-1 bg-white dark:bg-[#0d1117] overflow-auto font-mono text-[13px] relative">
           {CODE_LINES.map((line, idx) => {
             const lineNum = idx + 1
             const isActive = activeStepData.lineNo === lineNum
             
             return (
               <div 
                 key={idx} 
                 className={cn(
                   "flex items-center px-4 py-0.5",
                   isActive ? "bg-blue-50 dark:bg-blue-900/30 border-l-2 border-blue-500" : ""
                 )}
               >
                 <span className="w-8 text-slate-300 select-none text-right mr-4">{lineNum}</span>
                 <span className={cn(
                   isActive ? "text-slate-900 dark:text-slate-100" : "text-slate-500"
                 )}>{line}</span>
               </div>
             )
           })}
        </div>

        {/* Scrubber Footer */}
        <div className="bg-slate-50 border-t p-4">
          <input 
            type="range" 
            min="0" 
            max={trace.length - 1} 
            value={currentStep} 
            onChange={(e) => setStep(parseInt(e.target.value))}
            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
            <span>START</span>
            <span>STEP {currentStep} / {trace.length - 1}</span>
            <span>END</span>
          </div>
        </div>
      </Card>

      {/* 2. RIGHT: INSPECTOR PANEL (Tenderly Sidebar) */}
      <div className="col-span-4 flex flex-col gap-4">
        
        {/* A. CURRENT OPCODE / STEP INFO */}
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-xs font-bold text-slate-400 uppercase mb-1">Current Instruction</div>
          <div className="font-mono text-lg font-bold text-purple-700 dark:text-purple-300">
            {activeStepData.instruction}
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
             <Cpu size={12} />
             <span>Gas Used: </span>
             <span className="font-bold text-slate-700">{activeStepData.gasUsed} QU</span>
          </div>
        </Card>

        {/* B. MEMORY STATE (Variables) */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
            <Box size={12} /> Memory State
          </div>
          <ScrollArea className="flex-1 p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {Object.entries(activeStepData.memory).map(([key, value]) => (
                <div key={key} className="p-3 flex items-center justify-between hover:bg-slate-50 group transition-colors">
                  <span className="font-mono text-xs text-slate-500">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 group-hover:text-blue-700">
                      {value}
                    </span>
                    {/* Visual indicator of change could go here */}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* C. CALL STACK */}
        <Card className="h-1/3 flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
            <Layers size={12} /> Call Stack
          </div>
          <div className="p-2 space-y-1">
            {activeStepData.stack.map((frame, i) => (
              <div key={i} className="text-xs font-mono px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-600 flex items-center gap-2">
                <span className="text-slate-300">{i}:</span>
                {frame}
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  )
}