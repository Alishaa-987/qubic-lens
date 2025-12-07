'use client'

import {
  Activity,
  BugPlay,
  Code2,
  LayoutDashboard,
  Search,
  Settings
} from 'lucide-react'
import { useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { Debugger } from '@/components/dashboard/Debugger'
import { NetworkStatsView } from '@/components/dashboard/NetworkStatsView'
import { SmartContractsView } from '@/components/dashboard/SmartContractsView'

// Store
import { useTraceStore } from '@/store/useTraceStore'

export default function QubicLensDashboard() {
  const [activeView, setActiveView] = useState<'trace' | 'contracts' | 'network'>('contracts')
  const store = useTraceStore()

  // THE MAGIC FUNCTION
  const handleTxClick = (txHash: string) => {
    store.loadTransaction(txHash)
    setActiveView('trace')
  }

  return (
    <div className='flex min-h-screen w-full bg-[#0a0a0a] font-sans selection:bg-blue-500/30'>
      <SidebarProvider>
        
        {/* SIDEBAR */}
        <Sidebar className="border-r border-border bg-[#050505]">
          <SidebarHeader className="h-16 flex items-center justify-center px-4 border-b border-border/50">
            <div className="flex items-center gap-2 w-full">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Search className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none text-foreground">
                  QUBIC <span className="text-blue-600">LENS</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  DevNet Explorer
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-4 gap-4">
            <SidebarGroup>
              <SidebarGroupLabel>Development Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                        isActive={activeView === 'trace'} 
                        onClick={() => setActiveView('trace')}
                    >
                      <BugPlay className="w-4 h-4" />
                      <span className="font-medium">Trace Debugger</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                        isActive={activeView === 'contracts'}
                        onClick={() => setActiveView('contracts')}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Smart Contracts</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
               <SidebarGroupLabel>Network</SidebarGroupLabel>
               <SidebarGroupContent>
                 <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                             isActive={activeView === 'network'}
                             onClick={() => setActiveView('network')}
                        >
                        <Activity className="w-4 h-4" />
                        <span>Network Stats</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                 </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-border">
            <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border">
              <div className="h-8 w-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 font-bold text-xs border border-blue-500/20">
                QL
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">Qubic Lens</span>
                <span className="text-[10px] text-muted-foreground">v1.0.0 Stable</span>
              </div>
              <Settings className="w-4 h-4 ml-auto text-muted-foreground cursor-pointer hover:text-foreground" />
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* MAIN CONTENT AREA */}
        <div className='flex flex-1 flex-col overflow-hidden h-screen bg-background'>
          
          <header className='bg-background/80 backdrop-blur-md sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border px-6'>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                 {activeView === 'trace' && (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">Transaction Trace</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{store.txHash}</span>
                    </div>
                 )}
                 {activeView === 'contracts' && <span className="text-sm font-bold text-foreground">Contract Management Hub</span>}
                 {activeView === 'network' && <span className="text-sm font-bold text-foreground">Network Command Center</span>}
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  Mainnet Connected
               </div>
            </div>
          </header>

          <main className='flex-1 overflow-y-auto p-6 space-y-6'>

            <section className="min-h-[600px] flex flex-col">
              {activeView === 'trace' && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                            <Code2 className="w-5 h-5 text-blue-500" />
                            Live Execution Trace
                        </h2>
                      </div>
                      <Debugger />
                  </div>
              )}

              {activeView === 'contracts' && <SmartContractsView onTxClick={handleTxClick} />}
              
               {activeView === 'network' && <NetworkStatsView onTxClick={handleTxClick} />}
            </section>

          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}