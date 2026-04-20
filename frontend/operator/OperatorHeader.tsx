import { Database, MapPin, Radio, Settings } from "lucide-react";

type QueueData = {
  id: string;
  name: string;
  location: string;
  status: "ACTIVE" | "PAUSED";
};

type Props = {
  queue: QueueData;
  status: string;
};

export default function OperatorHeader({ queue, status }: Props) {
  const isActive = status === "ACTIVE";

  return (
    <div className="theme-card-elevated rounded-[2.5rem] p-8 relative overflow-hidden">
      <div className={`absolute top-0 right-0 h-1.5 w-full ${isActive ? 'bg-green-500/50' : 'bg-red-500/50'}`} />
      
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/5 text-[#ffd88d]">
            <Database size={20} />
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5">
            <Radio size={12} className={isActive ? "text-green-500 animate-pulse" : "text-red-500"} />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
              {isActive ? "Link_Established" : "Link_Suspended"}
            </span>
          </div>
        </div>

        <div>
           <div className="flex items-center gap-3 mb-1">
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffe2b5]/30">Node_UID:</span>
             <span className="text-[10px] font-mono font-bold text-[#ffd88d]/60">{queue.id.slice(0, 8)}...</span>
           </div>
           <h2 className="text-4xl font-bold uppercase tracking-tighter text-white">
             {queue.name}
           </h2>
        </div>

        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-4">
              <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 text-[#ffd88d]/60">
                 <MapPin size={16} />
              </div>
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Deployment Zone</p>
                 <p className="text-[11px] font-bold uppercase tracking-wide text-[#ffe2b5]">{queue.location}</p>
              </div>
           </div>

           <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-4">
              <div className="h-8 w-8 flex items-center justify-center rounded-xl bg-white/5 text-[#ffd88d]/60">
                 <Settings size={16} />
              </div>
              <div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Protocol Status</p>
                 <p className={`text-[11px] font-bold uppercase tracking-wide ${isActive ? 'text-green-400' : 'text-red-400'}`}>
                    {isActive ? "Relay_Active" : "Relay_Paused"}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-8 flex gap-2">
         {[...Array(4)].map((_, i) => (
           <div key={i} className={`h-1 flex-1 rounded-full ${isActive ? 'bg-[#ffd88d]/10' : 'bg-red-500/10'}`} />
         ))}
      </div>
    </div>
  );
}
