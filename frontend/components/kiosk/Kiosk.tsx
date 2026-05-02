"use client";

import { subscribeToQueue } from "@/lib/websocket";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "../skeletons/SkeletonBase";
import { Activity,  Users, LayoutGrid, Cpu, AlertTriangle, Terminal } from "lucide-react";

type QueueSnapshot = {
  queue: {
    id: string;
    name: string;
    location: string;
    status: "ACTIVE" | "PAUSED";
    capacity: number;
    isFull: boolean;
  };
  queueId: string;
  tokens: Array<{
    id: string;
    seq: number;
    status: string;
  }>;
};

type Props = {
  queueId: string;
};

export default function Kiosk({ queueId }: Props) {
  const [snapshot, setSnapshot] = useState<QueueSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!queueId) return;

    const unsubscribe = subscribeToQueue(queueId, {
      onUpdate: (payload) => {
        setSnapshot(payload as QueueSnapshot);
        setError(null);
      },
      onError: (err) => {
        setError(err.message || "Socket error");
      },
      onConnect: () => {
        setIsConnected(true);
        setError(null);
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
    });

    return () => {
      unsubscribe();
      setSnapshot(null);
      setIsConnected(false);
    };
  }, [queueId]);

  const waitingTokens = useMemo(() => {
    if (!snapshot) return [];
    return snapshot.tokens
      .filter((t) => t.status === "waiting")
      .sort((a, b) => a.seq - b.seq);
  }, [snapshot]);

  const nowServing = useMemo(() => {
    if (!snapshot) return null;
    const served = snapshot.tokens
      .filter((t) => t.status === "served")
      .sort((a, b) => b.seq - a.seq);
    return served[0] || null;
  }, [snapshot]);

  const isFull =
    snapshot?.queue.isFull ||
    (snapshot?.queue.capacity !== undefined &&
      waitingTokens.length >= snapshot.queue.capacity);

  const formatToken = (seq: number) => `T-${String(seq).padStart(3, "0")}`;
  if (!snapshot) {
    return (
      <div className="h-screen w-full bg-[#050505] flex flex-col p-10 animate-pulse">
        <div className="h-20 border-b border-white/10 flex justify-between items-center mb-12">
          <Skeleton className="h-8 w-64 bg-white/5" />
          <Skeleton className="h-4 w-32 bg-white/5" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white/2 border border-white/5 flex flex-col items-center justify-center">
            <Skeleton className="h-4 w-32 bg-white/5 mb-8" />
            <Skeleton className="h-48 w-96 bg-white/5" />
          </div>
          <div className="space-y-4">
             {[...Array(5)].map((_, i) => (
               <Skeleton key={i} className="h-24 w-full bg-white/5 border border-white/5" />
             ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col p-8 sm:p-12 font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#00A3C4]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
     
      <header className="flex justify-between items-center border-b border-white/10 pb-8 mb-12">
        <div className="flex items-center gap-6">
          <div className="bg-[#00A3C4] p-3 shadow-[0_0_20px_rgba(0,163,196,0.3)]">
             <LayoutGrid size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
              {snapshot.queue.name} <span className="text-[#00A3C4] font-light">DISPLAY</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mt-2">
              SECTOR: {snapshot.queue.location}  NODE: {snapshot.queue.id.slice(0, 8)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className={`flex items-center gap-3 border px-4 py-2 bg-black/40 ${isConnected ? 'border-[#00A3C4]/30' : 'border-red-500/30'}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${isConnected ? "bg-[#00A3C4] animate-pulse" : "bg-red-500"}`} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? "text-[#00A3C4]" : "text-red-500"}`}>
              {isConnected ? "Telemetry Active" : "Connection Lost"}
            </span>
          </div>
          <span className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">Auth Token: CF-8829-X</span>
        </div>
      </header>

    
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12 min-h-0">
        <div className="lg:col-span-2 space-y-12">
          <div className="h-full border border-white/10 bg-white/2 p-12 flex flex-col items-center justify-center relative group">
            <span className="absolute inset-0 flex items-center justify-center text-[22vw] font-black text-white/1 pointer-events-none uppercase select-none">
              Serving
            </span>
            
            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-xs font-black uppercase tracking-[1em] text-slate-500 mb-6">
                Current Sequence
              </h2>
              <div className="text-[12rem] lg:text-[16rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:text-[#00A3C4] transition-colors duration-700">
                {nowServing ? formatToken(nowServing.seq) : "--"}
              </div>
              <div className="mt-8 flex items-center gap-4 px-10 py-4 border border-[#00A3C4]/40 bg-[#00A3C4]/5 text-[#00A3C4] backdrop-blur-md">
                <Terminal size={16} />
                <span className="text-xs font-black uppercase tracking-[0.5em]">
                  {nowServing ? "Proceed to Registry" : "System Standby"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-l border-white/10 pl-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-3">
              <Activity size={14} className="text-[#00A3C4]" /> Sequence Log
            </h3>
            <span className="text-[10px] font-mono text-slate-700">{waitingTokens.length} Pending</span>
          </div>
          
          <div className="flex-1 overflow-hidden space-y-3">
            {waitingTokens.length === 0 ? (
              <div className="h-40 border border-dashed border-white/10 flex items-center justify-center">
                 <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Queue empty // standby mode</p>
              </div>
            ) : (
              waitingTokens.slice(0, 7).map((token, index) => (
                <div 
                  key={token.id} 
                  className={`p-6 border border-white/5 bg-white/1 flex justify-between items-center group/item hover:border-[#00A3C4]/30 transition-all ${index === 0 ? 'bg-[#00A3C4]/5 border-l-4 border-l-[#00A3C4]' : ''}`}
                >
                  <span className="text-3xl font-black tracking-tighter text-white group-hover/item:text-[#00A3C4] transition-colors">
                    {formatToken(token.seq)}
                  </span>
                  <div className="text-right">
                    <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1">Position</p>
                    <p className="text-xs font-black text-white">{index + 1}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {isFull && (
            <div className="mt-8 p-6 border border-red-500/20 bg-red-500/5 flex items-center gap-4 animate-pulse">
              <AlertTriangle className="text-red-500" size={20} />
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-relaxed">
                Critical Density Reached // New Initializations Blocked
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-12 h-16 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-slate-500" />
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">
              Protocol: {snapshot.queue.status}
            </span>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Users size={14} className="text-slate-500" />
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em]">
              Capacity: {snapshot.queue.capacity}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="h-1.5 w-1.5 bg-[#00A3C4]" />
          <div className="h-1.5 w-1.5 bg-white/20" />
          <div className="h-1.5 w-1.5 bg-white/20" />
        </div>
      </footer>
    </div>
  );
}