'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MOCK_TRACE_DATA, SOURCE_CODE } from '@/data/mockTrace'
import { cn } from '@/lib/utils'
import {
    Box,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CornerDownRight,
    Flame,
    Pause,
    Play
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function TenderlyDebugger() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const currentFrame = MOCK_TRACE_DATA[step]

  // Auto-play logic
  useEffect(() => {
    let interval: any
    if (isPlaying) {
      interval = setInterval(() => {
        setStep(s => {
          if (s >= MOCK_TRACE_DATA.length - 1) {
            setIsPlaying(false)
            return s
          }
          return s + 1
        })
      }, 1500) // Slow enough to read
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px] font-sans">
      
      {/* 1. LEFT PANEL: CODE & CONTROLS */}
      <Card className="lg:col-span-8 flex flex-col border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden bg-[#1e1e1e]">
        
        {/* HEADER TOOLBAR */}
        <div className="h-12 bg-[#252526] flex items-center justify-between px-4 border-b border-[#3e3e42]">
          <div className="flex items-center gap-3">
             <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none">TX #0x8f...2a</Badge>
             <span className="text-xs text-slate-400">Status: <span className="text-green-500 font-bold">SUCCESS</span></span>
          </div>
          
          {/* PLAYBACK CONTROLS */}
          <div className="flex items-center gap-1 bg-[#333333] rounded p-1">
             <button onClick={() => setStep(Math.max(0, step - 1))} className="p-1 text-slate-400 hover:text-white"><ChevronLeft size={16}/></button>
             <button 
               onClick={() => setIsPlaying(!isPlaying)}
               className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold hover:bg-blue-500 mx-1"
             >
               {isPlaying ? <Pause size={12}/> : <Play size={12}/>}
               {isPlaying ? 'PAUSE' : 'DEBUG'}
             </button>
             <button onClick={() => setStep(Math.min(MOCK_TRACE_DATA.length - 1, step + 1))} className="p-1 text-slate-400 hover:text-white"><ChevronRight size={16}/></button>
          </div>
        </div>

        {/* CODE EDITOR VISUALIZATION */}
        <div className="flex-1 relative overflow-hidden">
          <SyntaxHighlighter
            language="cpp"
            style={vscDarkPlus}
            customStyle={{ margin: 0, padding: '1.5rem', height: '100%', fontSize: '14px', lineHeight: '1.5' }}
            showLineNumbers={true}
            wrapLines={true}
            lineProps={(lineNumber) => {
              const isActive = lineNumber === currentFrame.line
              return {
                style: {
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : undefined,
                  display: 'block',
                  borderLeft: isActive ? '4px solid #3b82f6' : '4px solid transparent',
                  paddingLeft: '10px'
                }
              }
            }}
          >
            {SOURCE_CODE}
          </SyntaxHighlighter>
          
          {/* OVERLAY: CURRENT INSTRUCTION */}
          <div className="absolute bottom-6 right-6 bg-[#252526] border border-[#3e3e42] p-3 rounded shadow-2xl flex items-center gap-3">
            <div className="text-xs text-slate-400 uppercase font-bold">Instruction</div>
            <div className="text-sm font-mono text-blue-400 font-bold">{currentFrame.type}</div>
            <div className="h-4 w-[1px] bg-slate-600"></div>
            <div className="text-xs text-slate-400 uppercase font-bold">Gas</div>
            <div className="text-sm font-mono text-yellow-500 font-bold">{currentFrame.gas} QU</div>
          </div>
        </div>

        {/* SCRUBBER TIMELINE */}
        <div className="h-14 bg-[#252526] border-t border-[#3e3e42] flex flex-col justify-center px-6">
          <input 
            type="range"
            min="0"
            max={MOCK_TRACE_DATA.length - 1}
            value={step}
            onChange={(e) => setStep(parseInt(e.target.value))}
            className="w-full h-1 bg-[#3e3e42] rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono uppercase">
             <span>Start: 0 QU</span>
             <span>Current: Step {step + 1}</span>
             <span>End: 510 QU</span>
          </div>
        </div>
      </Card>

      {/* 2. RIGHT PANEL: EXECUTION TRACE & STATE */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* A. CALL STACK / TRACE LIST */}
        <Card className="flex-1 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1117] flex flex-col overflow-hidden">
           <div className="p-3 border-b dark:border-slate-800 bg-slate-50 dark:bg-[#161b22] font-bold text-xs text-slate-500 uppercase tracking-wider">
             Execution Trace
           </div>
           <div className="flex-1 overflow-auto p-2 space-y-1">
             {MOCK_TRACE_DATA.map((frame, idx) => (
               <div 
                 key={idx}
                 onClick={() => setStep(idx)}
                 className={cn(
                   "p-2 rounded text-xs font-mono cursor-pointer flex items-center gap-2 transition-colors",
                   idx === step 
                     ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" 
                     : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                 )}
               >
                 <span className="text-[10px] opacity-50 w-4">{idx}</span>
                 {frame.type === 'CALL' && <CornerDownRight size={12} />}
                 {frame.type === 'EVENT' && <Flame size={12} className="text-orange-500"/>}
                 {frame.type === 'WRITE' && <Box size={12} className="text-purple-500"/>}
                 
                 <span className="truncate">{frame.label}</span>
                 
                 {idx === step && <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
               </div>
             ))}
           </div>
        </Card>

        {/* B. STATE DIFF (The "Money Shot") */}
        <Card className="h-1/3 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1117] flex flex-col overflow-hidden">
           <div className="p-3 border-b dark:border-slate-800 bg-slate-50 dark:bg-[#161b22] font-bold text-xs text-slate-500 uppercase tracking-wider flex justify-between">
             <span>State Changes</span>
             {currentFrame.diff && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none h-5 text-[10px]">1 CHANGE</Badge>}
           </div>
           
           <div className="flex-1 p-4 flex items-center justify-center">
             {!currentFrame.diff ? (
               <div className="text-center text-slate-400">
                 <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                 <p className="text-xs">No state changes in this step.</p>
               </div>
             ) : (
               <div className="w-full space-y-3">
                 <div className="flex justify-between items-center text-xs">
                   <span className="font-bold text-slate-500 uppercase">Variable</span>
                   <span className="font-mono text-slate-700 dark:text-slate-300">{currentFrame.diff.var}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-2 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded">
                      <div className="text-[10px] text-red-400 uppercase font-bold mb-1">Before</div>
                      <div className="font-mono text-red-600 dark:text-red-400 font-bold">{currentFrame.diff.old}</div>
                   </div>
                   <div className="p-2 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded">
                      <div className="text-[10px] text-green-400 uppercase font-bold mb-1">After</div>
                      <div className="font-mono text-green-600 dark:text-green-400 font-bold">{currentFrame.diff.new}</div>
                   </div>
                 </div>
               </div>
             )}
           </div>
        </Card>

      </div>
    </div>
  )
}