import React from "react";
import { ArrowRight, BellRing, Clock3, Sparkles } from "lucide-react";

const liveQueues = [
  { name: "Student Services", wait: "12 min", load: "High", trend: "up" },
  { name: "Health Center", wait: "8 min", load: "Moderate", trend: "stable" },
  { name: "Cafeteria Pickup", wait: "4 min", load: "Low", trend: "down" },
];

const metrics = [
  { value: "68%", label: "Crowding Reduction" },
  { value: "3.2x", label: "Visibility Increase" },
  { value: "< 2m", label: "Avg. Response Time" },
];

export default function UniqProLanding() {
  return (
    <div className="min-h-screen bg-[#0f0a07] text-[#ece2d0] font-sans selection:bg-[#c4a67a]/30">
      {/* Sophisticated Ambient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[#3d2616] opacity-20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0f0a07]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[#c4a67a] rounded-sm" />
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-white">Uniq</span>
          </div>
          
          <div className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.2em] text-white/50 md:flex">
            <a href="#" className="hover:text-[#c4a67a] transition-colors">Platform</a>
            <a href="#" className="hover:text-[#c4a67a] transition-colors">Solutions</a>
            <a href="#" className="hover:text-[#c4a67a] transition-colors">Documentation</a>
          </div>

          <button className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:bg-white/10 transition-all">
            Sign In
          </button>
        </div>
      </nav>

      <main className="relative z-10 pt-32">
        {/* Hero Section */}
        <section className="px-6 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
              
              <div className="flex flex-col justify-center">
                <div className="mb-6 flex items-center gap-2 text-[#c4a67a]">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Infrastructure for Flow</span>
                </div>
                
                <h1 className="text-5xl font-medium leading-[1.1] tracking-tight text-white sm:text-7xl">
                  Enterprise Queue <br /> 
                  <span className="text-[#c4a67a]">Management.</span>
                </h1>
                
                <p className="mt-8 max-w-lg text-lg leading-relaxed text-white/60">
                  Uniq provides high-fidelity visibility into physical campus traffic. 
                  Synchronize your service points and reduce site-wide congestion with a single API.
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <button className="flex items-center gap-3 rounded-md bg-[#c4a67a] px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-[#0f0a07] hover:bg-[#d9bc91] transition-all shadow-lg shadow-[#c4a67a]/10">
                    Deploy Platform <ArrowRight className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-3 rounded-md border border-white/10 bg-white/5 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:border-white/20 transition-all">
                    View Demo
                  </button>
                </div>

                {/* Metric Grid */}
                <div className="mt-20 grid grid-cols-3 gap-8 border-t border-white/5 pt-10">
                  {metrics.map((m) => (
                    <div key={m.label}>
                      <p className="font-mono text-2xl font-light text-white">{m.value}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-widest text-white/30">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Console/UI Mockup */}
              <div className="relative">
                <div className="rounded-xl border border-white/10 bg-[#16110e] p-1 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/5 bg-[#1c1612] px-4 py-3 rounded-t-lg">
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-white/10" />
                      <div className="h-2 w-2 rounded-full bg-white/10" />
                      <div className="h-2 w-2 rounded-full bg-white/10" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/40">Live Monitor — V1.0.4</span>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {liveQueues.map((q) => (
                      <div key={q.name} className="flex items-center justify-between rounded-lg border border-white/5 bg-[#1a1411] p-4 hover:border-white/10 transition-colors cursor-default">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-white/90">{q.name}</p>
                          <div className="mt-1.5 flex items-center gap-3">
                            <span className="flex items-center gap-1 text-[10px] text-white/40">
                              <span className={`h-1.5 w-1.5 rounded-full ${q.load === 'High' ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                              {q.load} Load
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-xl font-medium text-[#c4a67a]">{q.wait}</p>
                          <p className="text-[9px] uppercase tracking-tighter text-white/20">Estimated Wait</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="rounded-lg border border-dashed border-white/10 p-4 flex flex-col items-center justify-center gap-2 opacity-50">
                        <Clock3 className="h-4 w-4" />
                        <span className="text-[9px] uppercase tracking-widest text-center">Predictive Analysis</span>
                      </div>
                      <div className="rounded-lg border border-dashed border-white/10 p-4 flex flex-col items-center justify-center gap-2 opacity-50 text-[#c4a67a]">
                        <BellRing className="h-4 w-4" />
                        <span className="text-[9px] uppercase tracking-widest text-center">Broadcast API</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Abstract Data Decoration */}
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#c4a67a]/10 blur-3xl" />
              </div>

            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="border-t border-white/5 bg-[#0c0806] px-6 py-24">
          <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-3">
            {[
              { title: "Smart Routing", desc: "Automated distribution of student traffic based on real-time staff availability." },
              { title: "Visual Logic", desc: "High-contrast digital signage integration for clear physical direction." },
              { title: "Deep Analytics", desc: "Historical data processing to forecast peak hours and staffing requirements." }
            ].map((feature, i) => (
              <div key={i} className="group cursor-default">
                <div className="mb-4 h-px w-12 bg-white/20 group-hover:bg-[#c4a67a] group-hover:w-full transition-all duration-500" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-3">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="mx-auto max-w-7xl flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-white/20">
          <p>© 2024 Uniq Campus Flow</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
