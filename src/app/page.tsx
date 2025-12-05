import { ArrowRight, Bug, Cpu, ShieldCheck, Zap } from 'lucide-react';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans overflow-hidden relative">
      
      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>

      {/* NAVBAR */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Cpu className="text-white w-5 h-5" />
          </div>
          QUBIC LENS
        </div>
        <div className="flex gap-6 text-sm text-zinc-400 font-medium">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">RPC Nodes</a>
          <a href="#" className="hover:text-white transition-colors">Github</a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-32 px-4 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-800 text-blue-400 text-xs font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          LIVE ON DEVNET
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000">
          X-Ray Vision for <br/>
          <span className="text-blue-500">Smart Contracts</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Stop debugging with <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300 text-sm">printf</code>. 
          Qubic Lens provides frame-by-frame execution tracing, memory state inspection, and time-travel debugging for C++ contracts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
          <Link href="/dashboard" className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Launch Dashboard <ArrowRight size={18} />
          </Link>
          <button className="h-12 px-8 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-lg font-bold transition-all">
            View Demo Video
          </button>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full text-left">
           <FeatureCard 
             icon={Bug} 
             title="Time Travel Debugging" 
             desc="Step backward and forward through transaction execution. Isolate exactly where the state corruption occurred."
           />
           <FeatureCard 
             icon={Zap} 
             title="Gas Profiling" 
             desc="Visualize QU consumption per opcode. Optimize your heavy loops and reduce execution costs by up to 40%."
           />
           <FeatureCard 
             icon={ShieldCheck} 
             title="State Diff Engine" 
             desc="See exactly which memory slots changed during execution. No more guessing about side effects."
           />
        </div>

      </main>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-6 rounded-2xl bg-[#111] border border-zinc-800 hover:border-blue-500/50 transition-colors group">
      <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-900/20 transition-colors">
        <Icon className="text-zinc-400 group-hover:text-blue-400" />
      </div>
      <h3 className="text-lg font-bold mb-2 text-zinc-200">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  )
}