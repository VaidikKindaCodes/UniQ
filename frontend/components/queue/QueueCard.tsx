"use client";

import { Queue } from "./queue.types";
import { useRouter } from "next/navigation";
import { 
  MapPin, 
  Users, 
  Clock, 
  Terminal, 
  ArrowUpRight, 
  Lock, 
  Cpu
} from "lucide-react";

interface QueueCardProps {
  queue: Queue;
}

export default function QueueCard({ queue }: QueueCardProps) {
  const router = useRouter();

  // Mapping status to technical themes
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open":
        return { label: "ACTIVE", color: "text-[#00A3C4]", border: "border-[#00A3C4]/30", pulse: "bg-[#00A3C4]" };
      case "paused":
        return { label: "STANDBY", color: "text-amber-500", border: "border-amber-500/30", pulse: "bg-amber-500" };
      case "full":
        return { label: "CAPACITY", color: "text-red-500", border: "border-red-500/30", pulse: "bg-red-500" };
      default:
        return { label: "OFFLINE", color: "text-slate-500", border: "border-white/10", pulse: "bg-slate-500" };
    }
  };

  const status = getStatusConfig(queue.status);
  const isLive = queue.status === "open";

  return (
    <div className="group relative border border-white/10 bg-white/2 transition-all duration-500 hover:border-[#00A3C4]/40 hover:bg-white/4">
      <div className={`absolute top-0 left-0 h-px w-full transition-all duration-700 opacity-20 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#00A3C4] ${status.pulse}`} />

      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold uppercase tracking-tighter text-white leading-none group-hover:text-[#00A3C4] transition-colors">
              {queue.queueName}
            </h3>
            <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">
              <MapPin size={10} className="text-[#00A3C4]" />
              {queue.location} {queue.counterNumber > 0 && `// SEC-${queue.counterNumber}`}
            </div>
          </div>
          
          <div className={`flex items-center gap-2 border ${status.border} px-3 py-1.5 bg-black/60`}>
            <div className={`h-1.5 w-1.5 rounded-full ${status.pulse} ${isLive ? 'animate-pulse' : ''}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 mb-8">
          <div className="bg-[#050505] p-5 hover:bg-[#080808] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Users size={12} className="text-slate-600" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Density</span>
            </div>
            <p className="text-2xl font-black text-white font-mono leading-none tracking-tighter">
              {queue.queueLength}
              <span className="text-[10px] text-slate-700 ml-1">
                {queue.capacity ? `/${queue.capacity}` : "OBJ"}
              </span>
            </p>
          </div>

          <div className="bg-[#050505] p-5 hover:bg-[#080808] transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={12} className="text-slate-600" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">Latency</span>
            </div>
            <p className="text-2xl font-black text-[#00A3C4] font-mono leading-none tracking-tighter">
              {queue.waitTime ?? "00"}
              <span className="text-[10px] text-slate-700 ml-1 uppercase">min</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push(`/kiosk/${queue.queueId}`)}
            className="group/btn flex items-center justify-center gap-3 border border-white/5 bg-white/5 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all"
          >
            Monitor <Terminal size={12} className="opacity-50 group-hover/btn:opacity-100" />
          </button>

          <button
            disabled={!isLive}
            onClick={() => console.log("Join queue:", queue.queueId)}
            className={`flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              isLive
                ? "bg-[#00A3C4] text-black hover:bg-cyan-400"
                : "bg-white/5 text-slate-600 cursor-not-allowed border border-white/5"
            }`}
          >
            {isLive ? (
              <>Initialize <ArrowUpRight size={14} /></>
            ) : (
              <>Locked <Lock size={12} /></>
            )}
          </button>
        </div>
      </div>
      <div className="px-8 pb-4 flex justify-between items-center opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="flex gap-4">
          <span className="text-[7px] font-mono text-white tracking-tighter uppercase">Node_{queue.queueId.slice(0, 4)}</span>
          <span className="text-[7px] font-mono text-white tracking-tighter uppercase font-black">STABLE</span>
        </div>
        <Cpu size={10} className="text-white" />
      </div>
    </div>
  );
}