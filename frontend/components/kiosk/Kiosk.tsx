"use client";

import { subscribeToQueue } from "@/lib/websocket";
import { useEffect, useMemo, useRef, useState } from "react";
import { Skeleton } from "../skeletons/SkeletonBase";
import {
  Activity,
  Users,
  LayoutGrid,
  Cpu,
  AlertTriangle,
  Terminal,
  CheckCircle2,
  PauseCircle,
  Clock,
  ChevronRight,
} from "lucide-react";

// Full type matching backend socket.ts QueueSnapshot
type QueueSnapshot = {
  queue: {
    id: string;
    name: string;
    location: string;
    status: "ACTIVE" | "PAUSED";
    capacity: number;
    isFull: boolean;
    nextSequence: number;
  };
  queueId: string;
  tokens: Array<{
    id: string;
    seq: number;
    status: string;
    createdAt: string;
    expireAt?: string;
  }>;
  stats: {
    totalWaiting: number;
    totalActive: number;
    totalCompleted: number;
  };
};

type Props = {
  queueId: string;
};

function useLiveClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatToken(seq: number) {
  return `T-${String(seq).padStart(3, "0")}`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString([], {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Animates the "Now Serving" number — flashes briefly when it changes */
function useNowServingAnimation(seq: number | null) {
  const [animating, setAnimating] = useState(false);
  const prevSeq = useRef<number | null>(null);

  useEffect(() => {
    if (seq !== null && seq !== prevSeq.current) {
      prevSeq.current = seq;
      setAnimating(true);
      const t = setTimeout(() => setAnimating(false), 900);
      return () => clearTimeout(t);
    }
  }, [seq]);

  return animating;
}

export default function Kiosk({ queueId }: Props) {
  const [snapshot, setSnapshot] = useState<QueueSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const now = useLiveClock();

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

  // The next token to be called (first in waiting)
  const upNext = waitingTokens[0] || null;

  const isFull =
    snapshot?.queue.isFull ||
    (snapshot?.queue.capacity !== undefined &&
      waitingTokens.length >= snapshot.queue.capacity);

  const isPaused = snapshot?.queue.status === "PAUSED";

  const isAnimating = useNowServingAnimation(nowServing?.seq ?? null);

  // ── Loading skeleton ─────────────────────────────────────────────────────────
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

  // ── Main display ─────────────────────────────────────────────────────────────
  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col p-8 sm:p-12 font-sans text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00A3C4]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      {isPaused && (
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      )}

      {/* ── Header ── */}
      <header className="flex justify-between items-center border-b border-white/10 pb-8 mb-10 shrink-0">
        <div className="flex items-center gap-6">
          <div className="bg-[#00A3C4] p-3 shadow-[0_0_20px_rgba(0,163,196,0.3)]">
            <LayoutGrid size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">
              {snapshot.queue.name}{" "}
              <span className="text-[#00A3C4] font-light">DISPLAY</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mt-2">
              SECTOR: {snapshot.queue.location} &nbsp;|&nbsp; NODE:{" "}
              {snapshot.queue.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Right: clock + connection status */}
        <div className="flex flex-col items-end gap-2">
          {/* Live clock */}
          <div className="flex items-center gap-3 px-4 py-2 border border-white/10 bg-black/40">
            <Clock size={12} className="text-slate-400" />
            <span className="text-sm font-mono font-black tracking-widest text-white tabular-nums">
              {formatTime(now)}
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
            {formatDate(now)}
          </span>
          {/* Connection badge */}
          <div
            className={`flex items-center gap-3 border px-4 py-1.5 bg-black/40 ${
              isConnected ? "border-[#00A3C4]/30" : "border-red-500/30"
            }`}
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${
                isConnected ? "bg-[#00A3C4] animate-pulse" : "bg-red-500"
              }`}
            />
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                isConnected ? "text-[#00A3C4]" : "text-red-500"
              }`}
            >
              {isConnected ? "Live" : "Reconnecting…"}
            </span>
          </div>
        </div>
      </header>

      {/* ── Paused banner ── */}
      {isPaused && (
        <div className="mb-8 flex items-center gap-4 border border-amber-500/30 bg-amber-500/5 px-8 py-4 shrink-0">
          <PauseCircle size={20} className="text-amber-400 shrink-0" />
          <p className="text-xs font-black text-amber-400 uppercase tracking-[0.4em]">
            Queue paused — service temporarily suspended
          </p>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 min-h-0">
        {/* Left: Now Serving big display */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-0">
          {/* Now serving panel */}
          <div
            className={`flex-1 border bg-white/2 p-10 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700 ${
              isAnimating
                ? "border-[#00A3C4]/60 shadow-[0_0_60px_rgba(0,163,196,0.15)]"
                : "border-white/10"
            }`}
          >
            {/* Watermark */}
            <span className="absolute inset-0 flex items-center justify-center text-[22vw] font-black text-white/[0.015] pointer-events-none uppercase select-none leading-none">
              NOW
            </span>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-xs font-black uppercase tracking-[1em] text-slate-500 mb-6">
                Now Serving
              </h2>

              {/* The big token number */}
              <div
                className={`text-[10rem] lg:text-[14rem] font-black leading-none tracking-tighter drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-300 ${
                  nowServing
                    ? isAnimating
                      ? "text-[#00A3C4] scale-105"
                      : "text-white"
                    : "text-white/20"
                }`}
              >
                {nowServing ? formatToken(nowServing.seq) : "--"}
              </div>

              <div
                className={`mt-8 flex items-center gap-4 px-10 py-4 border backdrop-blur-md transition-all duration-500 ${
                  nowServing
                    ? "border-[#00A3C4]/40 bg-[#00A3C4]/5 text-[#00A3C4]"
                    : "border-white/10 bg-white/5 text-slate-500"
                }`}
              >
                <Terminal size={16} />
                <span className="text-xs font-black uppercase tracking-[0.5em]">
                  {nowServing ? "Please proceed to counter" : "System standby"}
                </span>
              </div>
            </div>
          </div>

          {/* Up Next + Stats row */}
          <div className="grid grid-cols-3 gap-4 shrink-0">
            {/* Up Next */}
            <div
              className={`col-span-1 border p-5 flex flex-col gap-2 ${
                upNext
                  ? "border-[#00A3C4]/20 bg-[#00A3C4]/5"
                  : "border-white/5 bg-white/2"
              }`}
            >
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ChevronRight size={10} className="text-[#00A3C4]" />
                Up Next
              </p>
              <span
                className={`text-4xl font-black tracking-tighter ${
                  upNext ? "text-[#00A3C4]" : "text-white/20"
                }`}
              >
                {upNext ? formatToken(upNext.seq) : "—"}
              </span>
            </div>

            {/* Waiting count */}
            <div className="border border-white/5 bg-white/2 p-5 flex flex-col gap-2">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity size={10} className="text-slate-400" />
                Waiting
              </p>
              <span className="text-4xl font-black tracking-tighter text-white">
                {snapshot.stats?.totalWaiting ?? waitingTokens.length}
              </span>
            </div>

            {/* Completed today */}
            <div className="border border-white/5 bg-white/2 p-5 flex flex-col gap-2">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 size={10} className="text-slate-400" />
                Served Today
              </p>
              <span className="text-4xl font-black tracking-tighter text-white">
                {snapshot.stats?.totalCompleted ?? "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Queue list */}
        <div className="flex flex-col border-l border-white/10 pl-10 min-h-0">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 flex items-center gap-3">
              <Activity size={14} className="text-[#00A3C4]" />
              Queue
            </h3>
            <span className="text-[10px] font-mono text-slate-700">
              {waitingTokens.length} pending
            </span>
          </div>

          <div className="flex-1 overflow-hidden space-y-2">
            {waitingTokens.length === 0 ? (
              <div className="h-40 border border-dashed border-white/10 flex flex-col items-center justify-center gap-3">
                <CheckCircle2 size={20} className="text-slate-700" />
                <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest text-center">
                  Queue clear
                  <br />
                  standby mode
                </p>
              </div>
            ) : (
              waitingTokens.slice(0, 8).map((token, index) => (
                <div
                  key={token.id}
                  className={`px-5 py-4 border flex justify-between items-center transition-all ${
                    index === 0
                      ? "bg-[#00A3C4]/8 border-l-2 border-l-[#00A3C4] border-r-0 border-t-0 border-b-0 border-[#00A3C4]/20"
                      : "border-white/5 bg-white/[0.01] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {index === 0 && (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#00A3C4] animate-pulse" />
                    )}
                    <span
                      className={`text-2xl font-black tracking-tighter ${
                        index === 0 ? "text-[#00A3C4]" : "text-white"
                      }`}
                    >
                      {formatToken(token.seq)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-0.5">
                      Pos.
                    </p>
                    <p
                      className={`text-xs font-black ${
                        index === 0 ? "text-[#00A3C4]" : "text-slate-400"
                      }`}
                    >
                      {index + 1}
                    </p>
                  </div>
                </div>
              ))
            )}

            {/* Overflow indicator */}
            {waitingTokens.length > 8 && (
              <div className="px-5 py-3 border border-white/5 flex items-center justify-center">
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                  +{waitingTokens.length - 8} more in queue
                </span>
              </div>
            )}
          </div>

          {/* Full / error alerts */}
          {isFull && !isPaused && (
            <div className="mt-6 p-5 border border-red-500/20 bg-red-500/5 flex items-start gap-3 shrink-0">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-relaxed">
                Queue full — new entries suspended
              </p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 border border-red-500/20 bg-red-900/10 flex items-center gap-3 shrink-0">
              <AlertTriangle size={14} className="text-red-400 shrink-0" />
              <p className="text-[9px] font-mono text-red-400 truncate">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-8 h-14 border-t border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-slate-600" />
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">
              Status:{" "}
              <span
                className={
                  isPaused ? "text-amber-500" : "text-[#00A3C4]"
                }
              >
                {isPaused ? "Paused" : "Active"}
              </span>
            </span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Users size={12} className="text-slate-600" />
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">
              Capacity: {snapshot.queue.capacity}
            </span>
          </div>
          <div className="h-3 w-px bg-white/10" />
          <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
            Queue ID: {snapshot.queue.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        <div className="flex gap-3 items-center">
          <span className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.4em] mr-2">
            UniQ Kiosk
          </span>
          <div className={`h-1.5 w-1.5 ${isConnected ? "bg-[#00A3C4]" : "bg-red-500"}`} />
          <div className="h-1.5 w-1.5 bg-white/15" />
          <div className="h-1.5 w-1.5 bg-white/15" />
        </div>
      </footer>
    </div>
  );
}