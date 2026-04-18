"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
    <div
      className={`font-mono text-4xl font-black tracking-tighter ${
        isExpired ? "text-red-500" : "text-[#ffd88d]"
      }`}
    >
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

  const fetchCurrentQueue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get("/user-status/current-queue", true);
      setCurrentQueue(response.success && response.data ? response.data : null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sync with telemetry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentQueue();
  }, [fetchCurrentQueue]);

  useEffect(() => {
    if (currentQueue?.status === "completed" || currentQueue?.status === "expired") {
      const timer = setTimeout(() => {
        window.location.href = "/dashboard/user";
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentQueue?.status]);

  useEffect(() => {
    if (!currentQueue) return;

    const activeQueue = currentQueue;
    const unsubscribe = subscribeToQueue(activeQueue.queueId, {
      onUpdate: (payload) => {
        const snapshot = payload as QueueSnapshot;
        setQueueSnapshot(snapshot);
        const myTokenSeq = parseInt(activeQueue.tokenNumber.replace(/\D/g, ""), 10);
        const myToken = snapshot.tokens.find((t) => t.seq === myTokenSeq);

        if (myToken) {
          const waitingAhead = snapshot.tokens.filter(
            (t) => t.status === "waiting" && t.seq < myTokenSeq,
          ).length;

          setCurrentQueue((prev) =>
            prev
              ? {
                  ...prev,
                  currentPosition: waitingAhead + 1,
                  estimatedWaitTime: (waitingAhead + 1) * 5,
                  status: myToken.status,
                  expireAt: myToken.expireAt,
                }
              : null,
          );
        }
      },
      onError: (err) => console.error("Signal Lost:", err),
    });

    return () => unsubscribe();
  }, [currentQueue]);

  const handleLeaveQueue = async () => {
    if (!currentQueue) return;
    if (!window.confirm(`TERMINATE TOKEN ${currentQueue.tokenNumber}? This action is irreversible.`)) {
      return;
    }

    try {
      setLeavingQueue(true);
      const response = await apiService.post("/user-status/leave-queue", {}, true);
      if (response.success) {
        setCurrentQueue(null);
        setQueueSnapshot(null);
        await fetchCurrentQueue();
      }
    } catch (err: unknown) {
      console.error("Error leaving queue:", err);
      setError(err instanceof Error ? err.message : "Failed to leave queue.");
    } finally {
      setLeavingQueue(false);
    }
  };

  const isQueuePaused = queueSnapshot?.queue.status === "PAUSED";
  const joinedTime = currentQueue
    ? new Date(currentQueue.joinedAt).toLocaleTimeString()
    : "";

  const instruction = useMemo(() => {
    if (!currentQueue) return "";
    if (currentQueue.currentPosition <= 3) {
      return "Immediate proximity required. You are within the top 3 priority bracket.";
    }
    return `Maintain standby. There are ${currentQueue.currentPosition - 1} entities ahead of your current token.`;
  }, [currentQueue]);

  if (loading) {
    return (
      <div className="flex min-h-[32rem] flex-col items-center justify-center space-y-4">
        <Activity className="h-10 w-10 animate-pulse text-[#ffd88d]" />
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#ffe2b5]/72">
          Syncing Telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 animate-in fade-in duration-1000">
      <header className="flex flex-col justify-between gap-6 border-b border-white/8 pb-8 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
            Active Session
          </span>
          <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
            Live{" "}
            <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">
              telemetry.
            </span>
          </h1>
        </div>

        <button
          onClick={fetchCurrentQueue}
          className="group inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-6 py-3 transition-all hover:border-[#ffd88d]/40 hover:bg-white/12"
        >
          <RefreshCw
            size={14}
            className="text-[#ffe2b5]/70 transition-transform duration-700 group-hover:rotate-180"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Refresh Stream
          </span>
        </button>
      </header>

      {error && (
        <div className="rounded-[1.6rem] border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {currentQueue ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <div className="dashboard-panel-dark relative overflow-hidden rounded-[2rem] p-8">
              <div className="absolute right-0 top-0 h-48 w-48 bg-[#ffd88d]/8 blur-[100px]" />

              <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
                    {currentQueue.queueName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#ffe2b5]/68">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#ffd88d]" />
                      {currentQueue.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[#ffd88d]" />
                      Joined {joinedTime}
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                    currentQueue.status === "served"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                      : "border-[#ffd88d]/30 bg-[#ffd88d]/10 text-[#ffd88d]"
                  }`}
                >
                  Status: {currentQueue.status}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px rounded-[1.4rem] border border-white/8 bg-white/8 md:grid-cols-3">
                <div className="rounded-[1.4rem] bg-[#2a1306] p-8 text-center md:rounded-r-none">
                  <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/60">
                    Identity Token
                  </p>
                  <p className="font-mono text-5xl font-black tracking-tighter text-[#ffd88d]">
                    {currentQueue.tokenNumber}
                  </p>
                </div>
                <div className="bg-[#2a1306] p-8 text-center">
                  <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/60">
                    Rank in Queue
                  </p>
                  <p className="text-5xl font-black tracking-tighter text-white">
                    #{currentQueue.currentPosition}
                  </p>
                </div>
                <div className="rounded-[1.4rem] bg-[#2a1306] p-8 text-center md:rounded-l-none">
                  <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/60">
                    Est. Latency
                  </p>
                  <p className="text-5xl font-black tracking-tighter text-white">
                    {currentQueue.estimatedWaitTime}
                    <span className="ml-1 text-sm text-[#ffe2b5]/56">m</span>
                  </p>
                </div>
              </div>
            </div>

            {currentQueue.status === "served" ? (
              <div className="space-y-6 rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 p-10 text-center">
                <ShieldAlert className="mx-auto text-emerald-300" size={48} />
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">
                    Action Required
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-emerald-200/80">
                    Terminal presence must be verified immediately.
                  </p>
                </div>

                {currentQueue.expireAt && (
                  <div className="py-4">
                    <CountdownTimer targetDate={currentQueue.expireAt} />
                  </div>
                )}

                <button
                  onClick={async () => {
                    try {
                      await apiService.checkIn();
                      await fetchCurrentQueue();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="w-full rounded-full bg-emerald-400 px-12 py-4 text-[11px] font-black uppercase tracking-[0.4em] text-black transition-all hover:bg-emerald-300 md:w-auto"
                >
                  Verify Presence Now
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="dashboard-panel-dark rounded-[1.8rem] p-6">
                  <p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#ffd88d]">
                    <Activity size={14} /> System Instruction
                  </p>
                  <p className="text-xs uppercase tracking-tight text-[#ffe2b5]/76">
                    {instruction}
                  </p>
                </div>

                <button
                  onClick={handleLeaveQueue}
                  disabled={leavingQueue}
                  className="flex items-center justify-center gap-4 rounded-[1.8rem] border border-red-400/20 bg-red-500/10 text-[10px] font-black uppercase tracking-[0.3em] text-red-200 transition-all hover:bg-red-500/14 disabled:opacity-30"
                >
                  {leavingQueue ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <LogOut size={16} /> Terminate Session
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="dashboard-panel-dark space-y-6 rounded-[2rem] p-6">
              <h3 className="border-b border-white/8 pb-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#ffe2b5]/60">
                Session Log
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-[#ffd88d] shadow-[0_0_10px_#ffd88d]" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-tight text-white">
                      Token Initialized
                    </p>
                    <p className="text-[9px] font-mono uppercase text-[#ffe2b5]/58">
                      {joinedTime}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-white/28" />
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-tight text-[#ffe2b5]/78">
                      Telemetry Sync Active
                    </p>
                    <p className="text-[9px] font-mono uppercase text-[#ffe2b5]/52">
                      Live Stream Connected
                    </p>
                  </div>
                </div>
              </div>

              {isQueuePaused && (
                <div className="rounded-[1.4rem] border border-amber-400/20 bg-amber-500/10 p-4 text-amber-200">
                  <div className="mb-1 flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Protocol Paused
                    </span>
                  </div>
                  <p className="text-[9px] uppercase tracking-tighter opacity-80">
                    Service is temporarily suspended by admin.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-[1.8rem] border border-white/8 bg-white/6 p-6 text-[#ffe2b5]/54">
              <p className="text-[8px] font-mono uppercase tracking-[0.4em] leading-relaxed">
                Notice: Unauthorized session termination may result in temporary
                registry cooldown. Please verify location before check-in.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard-panel-dark flex flex-col items-center rounded-[2rem] border border-white/8 py-40 text-center">
          <div className="mb-12 flex h-16 w-16 rotate-45 items-center justify-center border border-white/12">
            <ListChecks size={28} className="-rotate-45 text-[#ffd88d]" />
          </div>
          <h2 className="text-5xl font-bold uppercase tracking-tighter text-white">
            No Active{" "}
            <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">
              sessions.
            </span>
          </h2>
          <p className="mt-6 mb-12 text-[10px] font-bold italic uppercase tracking-[0.5em] text-[#ffe2b5]/58">
            Initialize a new registration to begin tracking.
          </p>
          <Link
            href="/dashboard/user/queues"
            className="group flex items-center gap-4 rounded-full bg-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.4em] text-[#4b1d08] transition-all hover:bg-[#ffd88d]"
          >
            Access Directory{" "}
            <ChevronRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      )}

      <footer className="border-t border-white/8 pt-12 text-center opacity-40">
        <p className="text-[8px] font-mono uppercase tracking-[0.8em] text-[#ffe2b5]/70">
          End of Live Telemetry Stream
        </p>
      </footer>
    </div>
  );
}
