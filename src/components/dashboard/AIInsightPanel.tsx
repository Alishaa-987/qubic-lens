'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bot, Check, Sparkles, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AIInsightPanel({ analysis, isActive, isError }: { analysis: string, isActive: boolean, isError?: boolean }) {
  const [displayedText, setDisplayedText] = useState('')
  const [showFix, setShowFix] = useState(false)

  // Typing effect
  useEffect(() => {
    setShowFix(false)
    setDisplayedText('')
    if (!analysis) return

    let i = 0
    const speed = 20
    const interval = setInterval(() => {
      setDisplayedText(analysis.slice(0, i))
      i++
      if (i > analysis.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [analysis])

  return (
    <Card className="h-full border-border bg-card overflow-hidden flex flex-col relative">
       {/* HEADER */}
       <div className="p-3 border-b border-border bg-blue-950/20 flex items-center gap-2">
         <Bot className="w-4 h-4 text-blue-400" />
         <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">Qubic AI Analyst</span>
         <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse ml-auto" />
       </div>

       {/* CONTENT */}
       <div className="p-4 flex-1 font-mono text-sm leading-relaxed text-blue-100/90 relative overflow-y-auto">
         <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none"></div>
         
         <p>{displayedText}
         <span className="animate-pulse inline-block w-2 h-4 bg-blue-500 ml-1 align-middle"></span>
         </p>

         {/* THE FIX BUTTON (Only shows on error frames) */}
         {isError && displayedText.length >= analysis.length && (
             <div className="mt-6 animate-in slide-in-from-bottom-2 fade-in duration-500">
                {!showFix ? (
                    <Button 
                        onClick={() => setShowFix(true)}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50"
                    >
                        <Wrench className="w-4 h-4 mr-2" /> Generate Security Patch
                    </Button>
                ) : (
                    <div className="rounded border border-green-500/30 bg-green-900/10 p-3">
                        <div className="flex items-center gap-2 text-green-400 text-xs font-bold mb-2 uppercase">
                            <Check className="w-3 h-3" /> Patch Proposed
                        </div>
                        <div className="bg-black/40 p-2 rounded text-xs font-mono text-zinc-300">
                            <span className="text-red-400">- if (amount &gt; state.balance)</span><br/>
                            <span className="text-green-400">+ if (amount &gt; state.balance || amount == 0)</span>
                        </div>
                        <Button className="w-full mt-2 h-7 text-xs bg-green-600 hover:bg-green-500 text-white">
                            Apply Fix
                        </Button>
                    </div>
                )}
             </div>
         )}
       </div>
    </Card>
  )
}