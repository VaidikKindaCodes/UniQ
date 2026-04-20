import { User, Hash, Clock, ArrowRight } from "lucide-react";

type Token = { id: string; number: number; status: string };

type Props = {
  tokens: Token[];
};

export default function TokenList({ tokens }: Props) {
  return (
    <div className="theme-card-elevated rounded-[2.5rem] p-8 shadow-2xl">
      <div className="flex items-center justify-between mb-10 px-2">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-tighter text-white">
            Waiting <span className="font-serif font-light italic lowercase text-[#ffe2b5]/60">sequence.</span>
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffe2b5]/30 mt-1">
            Stack depth: {tokens.length} nodes
          </p>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 text-[#ffd88d]">
           <Hash size={18} />
        </div>
      </div>

      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {tokens.length === 0 ? (
          <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/2">
            <User size={32} className="mx-auto mb-4 text-white/10" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">No active signals in queue.</p>
          </div>
        ) : (
          tokens.map((token, index) => (
            <div
              key={token.id}
              className="group flex items-center gap-6 rounded-3xl border border-white/5 bg-white/5 p-5 transition-all hover:border-[#ffd88d]/30 hover:bg-white/8"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd88d] text-[#4b1d08] shadow-[0_8px_16px_rgba(255,216,141,0.1)]">
                <span className="text-xl font-black">{token.number}</span>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                   <p className="text-sm font-bold uppercase tracking-tight text-white line-clamp-1">
                     Entity_{token.id.slice(-6).toUpperCase()}
                   </p>
                   <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.15em] text-[#ffe2b5]/40">
                  <span className="flex items-center gap-1.5">
                    <Clock size={10} className="text-[#ffd88d]/60" />
                    EST: {index * 5 + 2}m
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-green-500/50" />
                    Waiting
                  </span>
                </div>
              </div>

              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-white/5 bg-white/5 text-white/20 transition-all group-hover:bg-[#ffd88d] group-hover:text-[#4b1d08] group-hover:border-transparent opacity-0 group-hover:opacity-100">
                <ArrowRight size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
         <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">System_Auto_Sort_Engaged</span>
         <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-1 w-4 rounded-full bg-white/5" />
            ))}
         </div>
      </div>
    </div>
  );
}
