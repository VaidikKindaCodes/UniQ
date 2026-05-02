import { User, Radio, Cpu, ArrowRight } from "lucide-react";

type Token = { id: string; number: number } | null;

type Props = {
  token: Token;
};

export default function NowServingCard({ token }: Props) {
  return (
    <div className="theme-card-elevated rounded-[2.5rem] p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 h-40 w-40 bg-[#ffd88d]/5 blur-[60px] pointer-events-none group-hover:bg-[#ffd88d]/10 transition-all duration-700" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/5 text-[#ffd88d]">
              <Radio size={18} className="animate-pulse" />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffd88d]/60">Active_Node</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 px-1">Currently Addressing</p>
            {token ? (
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black tracking-tighter text-white">
                  {token.number}
                </span>
                <span className="text-xl font-serif italic text-[#ffe2b5]/40 leading-none">session_active</span>
              </div>
            ) : (
              <div className="py-2">
                <span className="text-4xl font-black tracking-tighter text-white/10 uppercase italic">Idle_State</span>
              </div>
            )}
          </div>

          {token && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
               <div className="rounded-2xl border border-white/5 bg-white/3 p-4 flex items-center gap-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#ffd88d]/10 text-[#ffd88d]">
                     <Cpu size={16} />
                  </div>
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Node Identifier</p>
                    <p className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
                      {token.id.slice(-12).toUpperCase()}
                    </p>
                  </div>
               </div>
               
               <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                     <div className="h-1 w-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Broadcasting...</span>
                  </div>
                  <ArrowRight size={14} className="text-[#ffd88d]/40" />
               </div>
            </div>
          )}

          {!token && (
            <div className="rounded-[1.8rem] border border-dashed border-white/10 p-8 text-center bg-white/2">
               <User size={24} className="mx-auto mb-4 text-white/10" />
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Awaiting Next Sequence Initiation</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-1">
         {[...Array(4)].map((_, i) => (
           <div key={i} className="h-1 rounded-full bg-white/5" />
         ))}
      </div>
    </div>
  );
}
