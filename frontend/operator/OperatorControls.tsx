import { Play, SkipForward, UserX, Clock, Bell, Settings2 } from "lucide-react";

type Props = {
  onServeNext: () => void;
  onSkip: () => void;
  onRecall: () => void;
  onExtend: () => void;
  onNoShow: () => void;
  onToggleQueue: () => void;
  queueStatus: string;
};

export default function OperatorControls({
  onServeNext,
  onSkip,
  onRecall,
  onExtend,
  onNoShow,
  onToggleQueue,
  queueStatus,
}: Props) {
  return (
    <div className="theme-card-elevated rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 h-40 w-40 bg-[#ffd88d]/5 blur-[60px] pointer-events-none" />
      
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10 relative z-10">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-tighter text-white">
            Node Logic <span className="font-serif font-light italic lowercase text-[#ffe2b5]/60">controls.</span>
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">Manual protocol overrides</p>
        </div>
        <button
          onClick={onToggleQueue}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            queueStatus === "ACTIVE"
              ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white"
              : "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white"
          }`}
        >
          <Settings2 size={12} />
          {queueStatus === "ACTIVE" ? "Suspend Node" : "Activate Node"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <button
          onClick={onServeNext}
          className="col-span-1 md:col-span-2 flex items-center justify-center gap-4 rounded-[1.6rem] bg-[#ffd88d] p-6 text-[11px] font-black uppercase tracking-[0.4em] text-[#4b1d08] shadow-[0_20px_40px_rgba(255,216,141,0.15)] transition-all hover:scale-[1.02] active:scale-95 group"
        >
          Serve Next Sequence <Play size={18} fill="currentColor" className="group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={onExtend}
          className="flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-[#ffd88d]/30 group"
        >
          <Clock size={20} className="text-[#ffd88d] group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#ffe2b5]/70">Extend Term</span>
        </button>

        <button
          onClick={onRecall}
          className="flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-[#ffd88d]/30 group"
        >
          <Bell size={20} className="text-[#ffd88d] group-hover:rotate-12 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#ffe2b5]/70">Broad_Recall</span>
        </button>

        <button
          onClick={onSkip}
          className="flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-white/5 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-[#ffd88d]/30 group"
        >
          <SkipForward size={20} className="text-white/40 group-hover:translate-x-1 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest text-[#ffe2b5]/70">Shift_Seq</span>
        </button>

        <button
          onClick={onNoShow}
          className="flex flex-col items-center justify-center gap-3 rounded-[1.6rem] border border-white/5 bg-white/5 p-6 transition-all border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30 group"
        >
          <UserX size={20} className="text-red-500/60 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-widest text-red-500/60">Mark_NULL</span>
        </button>
      </div>

      <div className="mt-10 flex items-center gap-3 rounded-2xl bg-white/5 p-4 border border-white/5 relative z-10">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[#ffd88d]">
           <Settings2 size={14} />
        </div>
        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/40 leading-relaxed">
           Managing the master branch? Trigger &quot;Serve Next&quot; to initiate the next waiting node in the sequence.
        </span>
      </div>
    </div>
  );
}
