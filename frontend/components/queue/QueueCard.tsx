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

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open":
        return { label: "ACTIVE", color: "text-[#ffd88d]", border: "border-[#ffd88d]/30", pulse: "bg-[#ffd88d]" };
      case "paused":
        return { label: "STANDBY", color: "text-amber-200", border: "border-amber-500/30", pulse: "bg-amber-400" };
      case "full":
        return { label: "CAPACITY", color: "text-red-300", border: "border-red-500/30", pulse: "bg-red-400" };
      default:
        return { label: "OFFLINE", color: "text-[#ffe2b5]/54", border: "border-white/10", pulse: "bg-white/30" };
    }
  };

  const status = getStatusConfig(queue.status);
  const isLive = queue.status === "open";

  return (
    <div className="dashboard-panel-dark group relative rounded-[2rem] transition-all duration-500 hover:-translate-y-1">
      <div className={`absolute left-0 top-0 h-px w-full opacity-20 transition-all duration-700 group-hover:opacity-100 ${status.pulse}`} />

      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold uppercase tracking-tighter text-white leading-none transition-colors group-hover:text-[#ffd88d]">
              {queue.queueName}
            </h3>
            <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#ffe2b5]/58">
              <MapPin size={10} className="text-[#ffd88d]" />
              {queue.location} {queue.counterNumber > 0 && `// SEC-${queue.counterNumber}`}
            </div>
          </div>
          
          <div className={`flex items-center gap-2 rounded-full border ${status.border} bg-black/20 px-3 py-1.5`}>
            <div className={`h-1.5 w-1.5 rounded-full ${status.pulse} ${isLive ? 'animate-pulse' : ''}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
        <div className="mb-8 grid grid-cols-2 gap-px rounded-[1.4rem] border border-white/8 bg-white/8">
          <div className="rounded-l-[1.4rem] bg-[#2a1306] p-5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Users size={12} className="text-[#ffe2b5]/46" />
              <span className="text-[8px] font-black uppercase tracking-widest text-[#ffe2b5]/46">Density</span>
            </div>
            <p className="text-2xl font-black text-white font-mono leading-none tracking-tighter">
              {queue.queueLength}
              <span className="ml-1 text-[10px] text-[#ffe2b5]/36">
                {queue.capacity ? `/${queue.capacity}` : "OBJ"}
              </span>
            </p>
          </div>

          <div className="rounded-r-[1.4rem] bg-[#2a1306] p-5 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={12} className="text-[#ffe2b5]/46" />
              <span className="text-[8px] font-black uppercase tracking-widest text-[#ffe2b5]/46">Latency</span>
            </div>
            <p className="text-2xl font-black text-[#ffd88d] font-mono leading-none tracking-tighter">
              {queue.waitTime ?? "00"}
              <span className="ml-1 text-[10px] uppercase text-[#ffe2b5]/36">min</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push(`/kiosk/${queue.queueId}`)}
            className="group/btn flex items-center justify-center gap-3 rounded-full border border-white/8 bg-white/8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-white hover:text-[#4b1d08]"
          >
            Monitor <Terminal size={12} className="opacity-50 group-hover/btn:opacity-100" />
          </button>

          <button
            disabled={!isLive}
            onClick={() => console.log("Join queue:", queue.queueId)}
            className={`flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
              isLive
                ? "rounded-full bg-[#ffd88d] text-[#4b1d08] hover:bg-[#f1bf63]"
                : "cursor-not-allowed rounded-full border border-white/8 bg-white/6 text-[#ffe2b5]/40"
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
      <div className="flex items-center justify-between px-8 pb-4 opacity-20 transition-opacity group-hover:opacity-40">
        <div className="flex gap-4">
          <span className="text-[7px] font-mono text-white tracking-tighter uppercase">Node_{queue.queueId.slice(0, 4)}</span>
          <span className="text-[7px] font-mono text-white tracking-tighter uppercase font-black">STABLE</span>
        </div>
        <Cpu size={10} className="text-white" />
      </div>
    </div>
  );
}
