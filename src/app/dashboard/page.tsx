'use client'

import {
  Activity,
  Code2,
  Flame,
  Layers,
  LayoutDashboard,
  Search,
  Settings,
  Terminal
} from 'lucide-react'

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

// Custom Components
import { TenderlyDebugger } from '@/components/dashboard/TenderlyDebugger'
import { TickTicker } from '@/components/dashboard/TickTicker'
import { TimeTravelDebugger } from '@/components/dashboard/TimeTravelDebugger'

export default function QubicLensDashboard() {
  return (
    <div className='flex min-h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans'>
      <SidebarProvider>

        {/* ==============================================
            1. LEFT SIDEBAR NAVIGATION
           ============================================== */}
        <Sidebar className="border-r border-slate-200 dark:border-slate-800">

          {/* SIDEBAR HEADER: LOGO */}
          <SidebarHeader className="h-16 flex items-center justify-center px-4 border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2 w-full">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Search className="w-5 h-5 text-white" strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight leading-none text-slate-900 dark:text-white">
                  QUBIC <span className="text-blue-600">LENS</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  DevNet Explorer
                </span>
              </div>
            </div>
          </SidebarHeader>

          {/* SIDEBAR CONTENT: MENUS */}
          <SidebarContent className="px-2 py-4 gap-4">

            {/* GROUP 1: CORE APP */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Inspector Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={true} className="data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700">
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="font-medium">Live Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 dark:text-slate-400 hover:text-slate-900">
                      <Code2 className="w-4 h-4" />
                      <span>Smart Contracts</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 dark:text-slate-400 hover:text-slate-900">
                      <Flame className="w-4 h-4" />
                      <span>QU Burn Tracker</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 dark:text-slate-400 hover:text-slate-900">
                      <Layers className="w-4 h-4" />
                      <span>State Diff Engine</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="bg-slate-100 dark:bg-slate-800" />

            {/* GROUP 2: NETWORK */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                Network Layer
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 dark:text-slate-400 hover:text-slate-900">
                      <Activity className="w-4 h-4" />
                      <span>Network Stats</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="text-slate-600 dark:text-slate-400 hover:text-slate-900">
                      <Terminal className="w-4 h-4" />
                      <span>RPC Console</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

          </SidebarContent>

          {/* SIDEBAR FOOTER */}
          <SidebarFooter className="p-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-xs">
                QL
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Qubic Lens</span>
                <span className="text-[10px] text-slate-500">v0.1.0 Alpha</span>
              </div>
              <Settings className="w-4 h-4 ml-auto text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        {/* ==============================================
            2. MAIN CONTENT AREA
           ============================================== */}
        <div className='flex flex-1 flex-col overflow-hidden h-screen'>

          {/* TOP HEADER */}
          <header className='bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6'>
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2" />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">Environment:</span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Mainnet Connected
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Documentation</button>
              <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">Support</button>
            </div>
          </header>

          {/* SCROLLABLE DASHBOARD CONTENT */}
          <main className='flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-6 space-y-8'>

            {/* SECTION A: NETWORK HEALTH (TICKER) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  Network Pulse
                </h2>
                <span className="text-xs text-slate-400 font-mono">Real-time RPC Feed</span>
              </div>
              <TickTicker />
            </section>

            {/* SECTION B: THE MAIN INSPECTOR (Contract X-Ray) */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-purple-500" />
                  Smart Contract Inspector
                </h2>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-white border rounded text-xs text-slate-500 font-mono shadow-sm">Contract: HM25_Demo</span>
                </div>
              </div>

              {/* This is the component we built in Stage 4 */}
              <TimeTravelDebugger />
              
            </section>

            <div className="mb-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
       <Code2 className="w-5 h-5 text-purple-500" />
       Transaction Trace
    </h2>
    <div className="flex gap-2">
       <span className="px-2 py-1 bg-white border rounded text-xs text-slate-500 font-mono shadow-sm">Simulating: 0x8f...2a</span>
    </div>
  </div>
  
  <TenderlyDebugger />
</div>

          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}