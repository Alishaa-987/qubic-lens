'use client'

import { Card } from '@/components/ui/card'
import { Bot, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AIInsightPanel({ analysis, isActive }: { analysis: string, isActive: boolean }) {
  const [displayedText, setDisplayedText] = useState('')

  // Typing effect logic
  useEffect(() => {
    setDisplayedText('')
    if (!analysis) return

    let i = 0
    const speed = 30 // ms per char
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
       <div className="p-4 font-mono text-sm leading-relaxed text-blue-100/90 h-full relative">
         {/* Background Grid */}
         <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_14px]"></div>
         
         {displayedText}
         <span className="animate-pulse inline-block w-2 h-4 bg-blue-500 ml-1 align-middle"></span>
       </div>
    </Card>
  )
}