// Rationale: 
// 1. Adapted your Sidebar layout to the Qubic domain.
// 2. Integrated <TickTicker> as the live header stats.
// 3. Created specific placeholders for the next components (Contract Inspector, etc.).

'use client'

import {
  Activity,
  Code2,
  Cpu,
  Flame,
  LayoutDashboard,
  Search,
  Settings,
  Terminal,
  Zap
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'

// Import our Live Component
import { TickTicker } from '@/components/dashboard/TickTicker'

export default function QubicLensDashboard() {
  return (
    <div className='flex min-h-dvh w-full bg-slate-50 dark:bg-slate-950'>
      <SidebarProvider>
        {/* 1. THE SIDEBAR NAVIGATION */}
        <Sidebar>
          <SidebarContent>
            {/* BRANDING */}
            <div className="p-4 mb-2">
              <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-blue-600" />
                QUBIC <span className="text-blue-600">LENS</span>
              </h1>
            </div>

            {/* MAIN TOOLS */}
            <SidebarGroup>
              <SidebarGroupLabel>Core Modules</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={true}>
                      <LayoutDashboard />
                      <span>Live Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Code2 />
                      <span>Contract Inspector</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Flame />
                      <span>QU Burn Tracker</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Activity />
                      <span>Tx Flow Visualizer</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* UTILITIES */}
            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Terminal />
                      <span>RPC Console</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* 2. MAIN CONTENT AREA */}
        <div className='flex flex-1 flex-col overflow-hidden'>
          {/* HEADER */}
          <header className='bg-white dark:bg-slate-900 sticky top-0 z-50 flex h-14 items-center justify-between gap-6 border-b px-4 py-2 sm:px-6'>
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm font-medium text-slate-500">Connected to: <b className="text-green-500">Mainnet</b></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 rounded text-xs font-bold">v0.1.0 ALPHA</span>
            </div>
          </header>

          {/* DASHBOARD BODY */}
          <main className='size-full flex-1 px-4 py-6 sm:px-6 overflow-y-auto'>

            {/* A. LIVE TICKER INTEGRATION */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">Network Status</h2>
              <TickTicker />
            </div>

            {/* B. MAIN WORKSPACE (The "Lens") */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">

              {/* Left Panel: Code / Input */}
              <Card className="lg:col-span-2 border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                <Code2 className="w-12 h-12 mb-2 opacity-20" />
                <p>Smart Contract Inspector (Pending Build)</p>
              </Card>

              {/* Right Panel: Analysis */}
              <div className="flex flex-col gap-6 h-full">
                <Card className="flex-1 border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                  <Flame className="w-8 h-8 mb-2 opacity-20" />
                  <p>QU Tracker</p>
                </Card>
                <Card className="flex-1 border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
                  <Zap className="w-8 h-8 mb-2 opacity-20" />
                  <p>State Diff</p>
                </Card>
              </div>

            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}