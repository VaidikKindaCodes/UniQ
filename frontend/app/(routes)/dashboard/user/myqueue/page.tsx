"use client";

import { useState, useEffect } from "react";
import {
  ListChecks,
  Clock,
  MapPin,
  AlertCircle,
  RefreshCw,
  LogOut,
  Loader2,
  Activity,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { apiService } from "@/app/services/api";
import { subscribeToQueue } from "@/lib/websocket";
import Link from "next/link";

interface CurrentQueue {
  id: string;
  queueId: string;
  queueName: string;
  location: string;
  tokenNumber: string;
  currentPosition: number;
  estimatedWaitTime: number;
  joinedAt: string;
  status: string;
  expireAt?: string;
}

interface QueueSnapshot {
  queue: {
    status: "ACTIVE" | "PAUSED";
    isFull?: boolean;
    capacity?: number;
  };
  tokens: Array<{
    id: string;
    seq: number;
    status: string;
    expireAt?: string;
  }>;
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft("00:00");
        setIsExpired(true);
      } else {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={`font-mono text-4xl font-black tracking-tighter ${isExpired ? "text-red-500" : "text-[#00A3C4] shadow-[0_0_20px_rgba(0,163,196,0.2)]"}`}>
      {timeLeft}
    </div>
  );
}

export default function MyQueuePage() {
  const [currentQueue, setCurrentQueue] = useState<CurrentQueue | null>(null);
  const [queueSnapshot, setQueueSnapshot] = useState<QueueSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leavingQueue, setLeavingQueue] = useState(false);

  useEffect(() => {
    fetchCurrentQueue();
  }, []);

  useEffect(() => {
    if (currentQueue?.status === "completed" || currentQueue?.status === "expired") {
      const timer = setTimeout(() => { window.location.href = "/dashboard/user"; }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentQueue?.status]);

  useEffect(() => {
    if (!currentQueue) return;
    const unsubscribe = subscribeToQueue(currentQueue.queueId, {
      onUpdate: (payload) => {
        const snapshot = payload as QueueSnapshot;
        setQueueSnapshot(snapshot);
        const myTokenSeq = parseInt(currentQueue.tokenNumber.replace(/\D/g, ""));
        const myToken = snapshot.tokens.find((t) => t.seq === myTokenSeq);
        if (myToken) {
          const waitingAhead = snapshot.tokens.filter(t => t.status === "waiting" && t.seq < myTokenSeq).length;
          setCurrentQueue(prev => prev ? {
            ...prev,
            currentPosition: waitingAhead + 1,
            estimatedWaitTime: (waitingAhead + 1) * 5,
            status: myToken.status,
            expireAt: myToken.expireAt,
          } : null);
        }
      },
      onError: (err) => console.error("Signal Lost:", err),
    });
    return () => unsubscribe();
  }, [currentQueue?.queueId]);

  const fetchCurrentQueue = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/user-status/current-queue", true);
      setCurrentQueue(response.success && response.data ? response.data : null);
    } catch (err: any) {
      setError(err.message || "Failed to sync with telemetry.");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveQueue = async () => {
    if (!currentQueue) return;
    if (!window.confirm(`TERMINATE TOKEN ${currentQueue.tokenNumber}? This action is irreversible.`)) return;
    try {
      setLeavingQueue(true);
      const response = await apiService.post("/user-status/leave-queue", {}, true);
      if (response.success) {
        setCurrentQueue(null);
        setQueueSnapshot(null);
        await fetchCurrentQueue();
      }
    } catch (err) {
      console.error("Error leaving queue:", err);
      setError(err.message);
    } finally {
      setLeavingQueue(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-125 space-y-4">
        <Activity className="h-10 w-10 animate-pulse text-[#00A3C4]" />
        <p className="text-[10px] uppercase tracking-[0.6em] text-slate-500 font-black">Syncing Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-1000">
      <header className="relative pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#00A3C4] font-black">Active Session</span>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mt-2">
            Live <span className="font-serif italic font-light text-slate-500 lowercase">telemetry.</span>
          </h1>
        </div>
        
        <button
          onClick={fetchCurrentQueue}
          className="group flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 hover:border-[#00A3C4]/40 transition-all rounded-sm"
        >
          <RefreshCw size={14} className="text-slate-500 group-hover:rotate-180 transition-transform duration-700" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white">Refresh Stream</span>
        </button>
      </header>

      {currentQueue ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="border border-white/10 bg-white/2 p-8 relative overflow-hidden">
           
              {/* <div className="absolute top-0 right-0 p-4 opacity-5">
                <Activity size={120} />
              </div> */}

              <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white">{currentQueue.queueName}</h2>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#00A3C4]" /> {currentQueue.location}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} /> Joined {new Date(currentQueue.joinedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className={`px-4 py-2 border rounded-xs text-[10px] font-black uppercase tracking-widest ${
                  currentQueue.status === 'served' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-[#00A3C4]/50 bg-[#00A3C4]/10 text-[#00A3C4]'
                }`}>
                  Status: {currentQueue.status}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
                <div className="bg-[#050505] p-8 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Identity Token</p>
                  <p className="text-5xl font-black text-[#00A3C4] tracking-tighter font-mono">{currentQueue.tokenNumber}</p>
                </div>
                <div className="bg-[#050505] p-8 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Rank in Queue</p>
                  <p className="text-5xl font-black text-white tracking-tighter">#{currentQueue.currentPosition}</p>
                </div>
                <div className="bg-[#050505] p-8 text-center">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">Est. Latency</p>
                  <p className="text-5xl font-black text-white tracking-tighter">{currentQueue.estimatedWaitTime}<span className="text-sm ml-1 text-slate-600">m</span></p>
                </div>
              </div>
            </div>

            {currentQueue.status === "served" ? (
              <div className="border border-emerald-500/30 bg-emerald-500/[0.03] p-10 text-center space-y-6 animate-pulse">
                <ShieldAlert className="mx-auto text-emerald-500" size={48} />
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Action Required</h3>
                  <p className="text-xs uppercase tracking-widest text-emerald-400/70">Terminal presence must be verified immediately.</p>
                </div>
                {currentQueue.expireAt && (
                  <div className="py-4">
                    <CountdownTimer targetDate={currentQueue.expireAt} />
                  </div>
                )}
                <button
                  onClick={async () => {
                    try { await apiService.checkIn(); await fetchCurrentQueue(); } catch (e) { console.error(e); }
                  }}
                  className="w-full md:w-auto px-12 py-4 bg-emerald-500 text-black text-[11px] font-black uppercase tracking-[.4em] hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                >
                  Verify Presence Now
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border border-white/5 bg-white/1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#00A3C4] mb-3 flex items-center gap-2">
                    <Activity size={14} /> System Instruction
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-tight">
                    {currentQueue.currentPosition <= 3 
                      ? "Immediate proximity required. You are within the top 3 priority bracket."
                      : `Maintain standby. There are ${currentQueue.currentPosition - 1} entities ahead of your current token.`}
                  </p>
                </div>
                <button
                  onClick={handleLeaveQueue}
                  disabled={leavingQueue}
                  className="flex items-center justify-center gap-4 border border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black uppercase tracking-[.3em] disabled:opacity-20"
                >
                  {leavingQueue ? <Loader2 className="animate-spin" size={16} /> : <><LogOut size={16} /> Terminate Session</>}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="border border-white/5 bg-white/1 p-6 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[.4em] text-slate-500 pb-4 border-b border-white/5">Session Log</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-[#00A3C4] mt-1.5 shadow-[0_0_10px_#00A3C4]" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-white uppercase tracking-tight">Token Initialized</p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase">{new Date(currentQueue.joinedAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-2 w-2 rounded-full bg-slate-800 mt-1.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Telemetry Sync Active</p>
                    <p className="text-[9px] font-mono text-slate-600 uppercase">Live Stream Connected</p>
                  </div>
                </div>
              </div>

              {isQueuePaused && (
                <div className="mt-8 p-4 border border-amber-500/20 bg-amber-500/5 text-amber-500">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocol Paused</span>
                  </div>
                  <p className="text-[9px] uppercase tracking-tighter opacity-70">Service is temporarily suspended by admin.</p>
                </div>
              )}
            </div>

            <div className="p-6 border border-white/5 opacity-40">
              <p className="text-[8px] font-mono uppercase tracking-[.4em] leading-relaxed">
                Notice: Unauthorized session termination may result in temporary registry cooldown. Please verify location before check-in.
              </p>
            </div>
          </div>

        </div>
      ) : (
        <div className="py-40 border border-white/5 bg-white/1 flex flex-col items-center text-center">
          <div className="w-16 h-16 border border-white/10 flex items-center justify-center rotate-45 mb-12">
            <ListChecks size={28} className="-rotate-45 text-slate-800" />
          </div>
          <h2 className="text-5xl font-bold uppercase tracking-tighter text-white">No Active <span className="font-serif italic font-light text-slate-500 lowercase">sessions.</span></h2>
          <p className="text-[10px] uppercase tracking-[0.5em] text-slate-600 mt-6 mb-12 font-bold italic">Initialize a new registration to begin tracking.</p>
          <Link href="/dashboard/user/queues" className="group flex items-center gap-4 px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#00A3C4] hover:text-white transition-all">
            Access Directory <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      <footer className="pt-12 border-t border-white/5 opacity-20 text-center">
        <p className="text-[8px] font-mono uppercase tracking-[.8em]">End of Live Telemetry Stream</p>
      </footer>
    </div>
  );
}