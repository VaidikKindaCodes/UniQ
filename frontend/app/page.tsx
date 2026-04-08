import React from "react";

export default function UniqEliteLanding() {
  return (
    <div className="min-h-screen bg-[#01141a] text-white selection:bg-[#00A3C4]/30 font-sans overflow-x-hidden">
      
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80')] bg-cover opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-linear-to-b from-[#01141a]/40 via-[#01141a] to-[#01141a]" />
      </div>
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 md:px-16 py-8 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-8 h-8 bg-[#00A3C4] flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500">
            <span className="font-serif italic-rotate-45 group-hover:-rotate-90 transition-transform duration-500 text-white ">Q</span>
          </div>
          <span className="text-xl font-serif italic tracking-widest uppercase">Uniq</span>
        </div>
        <div className="hidden md:flex items-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
          <a href="#" className="hover:text-[#00A3C4] transition-colors">Platform</a>
          <a href="#" className="hover:text-[#00A3C4] transition-colors">Solutions</a>
          <a href="#" className="hover:text-[#00A3C4] transition-colors">Enterprise</a>
        </div>
        <div className="flex items-center gap-6">
          <button className="px-6 py-2.5 bg-white text-black rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-[#00A3C4] hover:text-white transition-all shadow-xl">
            Join Now
          </button>
        </div>
      </nav>
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-7xl">
          <div className="flex justify-center mb-30">
            
          </div>
          <div className="flex flex-col items-center text-center  md:space-y-0">
            <h1 className="text-[10vw] md:text-[7vw] font-bold tracking-tighter leading-none md:ml-[-20%]">
              Modern <span className="font-serif italic font-light text-slate-500 lowercase">virtual</span>
            </h1>
            
            <div className="relative inline-block">
              <h1 className="text-[8vw] md:text-[6vw] font-bold tracking-tighter leading-none text-[#00A3C4]">
                queues <span className="text-white">for all</span>
              </h1>
              <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-[#00A3C4]/5 blur-[100px] -z-10 rounded-full" />
            </div>

            <h1 className="text-[10vw] md:text-[7vw] font-bold tracking-tighter leading-none md:mr-[-23%]">
              service <span className="font-serif italic font-light text-slate-500 lowercase">points.</span>
            </h1>
          </div>
          <div className="mt-20 max-w-2xl mx-auto text-center">
            <p className="text-slate-400 text-base md:text-lg font-medium leading-relaxed font-serif italic mb-12">
              Uniq replaces physical lines with a live, mobile-first queue experience. Keep students moving, reduce crowding, and make every service interaction smoother.
            </p>
            
            <div className="flex justify-center gap-8">
              <button className="bg-white text-black px-12 py-5 rounded-sm text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#00A3C4] hover:text-white transition-all">
                Explore Queues
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[8px] uppercase tracking-[0.5em] rotate-90 mb-4">Scroll</span>
          <div className="w-1px h-12 bg-linear-to-b from-white to-transparent" />
        </div>
      </section>
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto bg-white/2 border border-white/5 backdrop-blur-3xl rounded-sm p-8 md:p-16 relative">
          <div className="flex justify-between items-center mb-16">
             <div>
                <h3 className="text-2xl font-bold uppercase tracking-tighter italic font-serif">Uniq Live Queue</h3>
                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-1">Smart Campus Operations</p>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-[#00A3C4]/10 rounded-full">
                <div className="w-1.5 h-1.5 bg-[#00A3C4] rounded-full animate-pulse" />
                <span className="text-[8px] font-bold text-[#00A3C4] uppercase">Live</span>
             </div>
          </div>

          <div className="space-y-px bg-white/5">
             {[
               { n: "Student Services", t: "12 min", s: "Queue moving smoothly" },
               { n: "Health Center", t: "8 min", s: "Next call in 2 min" },
               { n: "Cafeteria Pickup", t: "4 min", s: "Ready for pickup" }
             ].map((q, i) => (
               <div key={i} className="flex justify-between items-center p-8 bg-[#01141a] hover:bg-white/2 transition-colors group">
                  <div className="space-y-1">
                    <p className="text-sm font-bold uppercase tracking-widest group-hover:text-[#00A3C4] transition-colors">{q.n}</p>
                    <p className="text-[10px] text-slate-500 font-serif italic">{q.s}</p>
                  </div>
                  <p className="text-3xl font-serif italic text-white/80">{q.t}</p>
               </div>
             ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-widest text-[#00A3C4] font-bold mb-1">Queue Insights</p>
              <p className="text-[10px] text-slate-400 font-serif italic max-w-45">Peak hours predicted ahead of time.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-10 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24">
          <div>
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-red-500/50">The Problem</span>
            <h2 className="text-4xl font-bold uppercase tracking-tighter mt-4 mb-8">Physical queues <br /> waste time.</h2>
            <div className="space-y-6">
              {["Crowded spaces", "No visibility", "Lost turns", "Staff overload"].map((item) => (
                <div key={item} className="flex items-center gap-4 text-slate-500 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-serif italic">→</span>
                  <span className="text-xs uppercase tracking-widest">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/2 p-12 border border-white/5 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-[0.5em] font-black text-[#00A3C4]">The Solution</span>
            <h2 className="text-4xl font-bold uppercase tracking-tighter mt-4 mb-8">A virtual queue <br /> built for campuses.</h2>
            <ul className="space-y-4">
              {[
                "Join queues remotely",
                "Track position in real time",
                "Get notified before your turn",
                "Reduce on-site congestion"
              ].map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-sm font-serif italic text-slate-300">
                  <div className="w-1 h-1 bg-[#00A3C4] rounded-full" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="relative z-10 py-60 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center items-center gap-4 opacity-50">
            <div className="h-px w-8 bg-white" />
            <span className="text-[10px] uppercase tracking-[0.5em] font-bold">The New Standard</span>
            <div className="h-px w-8 bg-white" />
          </div>

          <h2 className="text-[8vw] md:text-[6vw] font-bold tracking-tighter leading-[0.8] uppercase mb-4">
            Ready to <span className="font-serif italic font-light text-slate-500 lowercase">modernize</span>
          </h2>
          <h2 className="text-[8vw] md:text-[6vw] font-bold tracking-tighter leading-[0.8] uppercase mb-16">
            your <span className="text-[#00A3C4]">experience?</span>
          </h2>

          <div className="flex flex-col items-center gap-6">
            <p className="text-slate-400 text-sm uppercase tracking-[0.3em] font-bold mb-4 max-w-md mx-auto leading-relaxed">
              Launch CampusOR across services and make every visit faster and calmer.
            </p>
            
            <button className="group relative px-16 py-6 overflow-hidden bg-white rounded-sm transition-all hover:bg-[#00A3C4]">
              {/* Button Text */}
              <span className="relative z-10 text-black group-hover:text-white text-[11px] font-black uppercase tracking-[0.5em] transition-colors duration-300">
                Enter the App
              </span>
              <div className="absolute inset-0 bg-[#00A3C4] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>
            <span className="text-[8px] uppercase tracking-[0.3em] text-slate-600 mt-4">
              Free for all campus departments during beta
            </span>
          </div>
        </div>
      </section>
      <footer className="relative z-10 py-20 border-t border-white/5 bg-[#010c11] px-12 text-center">
         <span className="text-3xl font-serif italic mb-4 block">Uniq</span>
         <div className="flex justify-center gap-10 text-[9px] uppercase tracking-widest font-bold text-slate-600">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
         </div>
      </footer>
    </div>
  );
}