"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/app/services/api";
import { subscribeToQueue } from "@/lib/websocket";
import {
  Activity,
  Clock,
  MapPin,
  AlertCircle,
  ArrowRight,
  Zap
} from "lucide-react";
import Link from "next/link";
import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { Skeleton } from "@/components/skeletons/SkeletonBase";

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

export default function UserDashboardPage() {
  const [currentQueue, setCurrentQueue] = useState<CurrentQueue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentQueue();
  }, []);

  useEffect(() => {
    if (!currentQueue) return;

    const unsubscribe = subscribeToQueue(currentQueue.queueId, {
      onUpdate: (payload: unknown) => {
        setCurrentQueue((prev) => {
          if (!prev) return null;

          const data = payload as { tokens: Array<{ status: string; seq: number }> };
          if (!data?.tokens) return prev;

          const myTokenSeq = parseInt(prev.tokenNumber.replace(/\D/g, ""), 10);
          const waitingAhead = data.tokens.filter(
            (t) => t.status === "waiting" && t.seq < myTokenSeq
          ).length;

          return {
            ...prev,
            currentPosition: waitingAhead + 1,
            estimatedWaitTime: (waitingAhead + 1) * 5,
          };
        });
      },
      onError: (err) => console.error("WebSocket error:", err),
    });

    return () => unsubscribe();
  }, [currentQueue?.queueId]);

  const fetchCurrentQueue = async () => {
    try {
      setLoading(true);
      const response = await apiService.get("/user-status/current-queue", true);

      if (response.success && response.data) {
        setCurrentQueue(response.data);
      } else {
        setCurrentQueue(null);
      }
    } catch (err) {
      console.error("Error fetching current queue:", err);
      setCurrentQueue(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="theme-title mb-2 text-3xl font-bold">Dashboard</h1>
          <p className="theme-text-muted">Welcome back! Here&apos;s your queue status.</p>
        </div>
        <CardSkeleton />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="theme-card h-32 rounded-xl" />
          <Skeleton className="theme-card h-32 rounded-xl" />
          <Skeleton className="theme-card h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* --- PAGE HEADER --- */}
      <header className="relative pb-8 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#ffd88d] font-black">Member Overview</span>
            <h1 className="text-5xl font-bold tracking-tighter uppercase mt-2">
              System <span className="font-serif italic font-light text-[#ffe2b5]/70 lowercase">status.</span>
            </h1>
          </div>
          <p className="max-w-[200px] text-[11px] leading-relaxed text-[#ffe2b5]/68">
            Real-time synchronization with active campus service points.
          </p>
        </div>
      </header>

      {/* --- ACTIVE QUEUE CARD (The "Uniq" Live Card) --- */}
      {currentQueue ? (
        <section className="relative group">
          {/* Decorative Glow */}
          <div className="absolute -inset-1 rounded-sm bg-[#ffd88d]/10 blur-2xl opacity-50" />

          <div className="dashboard-panel-dark relative overflow-hidden rounded-[2rem] p-8 backdrop-blur-3xl md:p-12">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-[#ffd88d]/8 blur-[100px]" />

            <div className="flex flex-col lg:flex-row justify-between gap-12">
              {/* Left Side: Metadata */}
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-[#ffd88d] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ffd88d]">Live Connection Active</span>
                </div>

                <div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-none">
                    {currentQueue.queueName}
                  </h2>
                  <div className="mt-4 flex items-center gap-3 text-[#ffe2b5]/72">
                    <MapPin size={14} className="text-[#ffd88d]" />
                    <span className="text-xs uppercase tracking-widest font-bold">{currentQueue.location}</span>
                  </div>
                </div>

                {/* Vertical Metrics */}
                <div className="grid grid-cols-2 gap-px border border-white/8 bg-white/6">
                  <div className="bg-[#2a1306] p-6 text-center">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#ffe2b5]/56">Position</p>
                    <p className="text-3xl font-serif italic">#{currentQueue.currentPosition}</p>
                  </div>
                  <div className="bg-[#2a1306] p-6 text-center">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-[#ffe2b5]/56">Estimated</p>
                    <div className="text-3xl font-serif italic text-[#ffd88d]">
                      {currentQueue.expireAt && currentQueue.status === "served" ? (
                        <CountdownTimer targetDate={currentQueue.expireAt} />
                      ) : (
                        `${currentQueue.estimatedWaitTime}m`
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Token Focus */}
              <div className="lg:w-72 flex flex-col items-center justify-center border-l border-white/8 lg:pl-12">
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#ffe2b5]/56">Identification</p>
                <div className="text-7xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {currentQueue.tokenNumber}
                </div>
                <div className="mt-8 w-full">
                  <Link
                    href="/dashboard/user/myqueue"
                    className="group/btn relative flex w-full items-center justify-center gap-4 overflow-hidden rounded-full border border-white/10 py-5 transition-all hover:border-[#ffd88d]"
                  >
                    <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] group-hover/btn:text-white transition-colors">Digital Pass</span>
                    <ArrowRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 translate-y-full bg-[#7a2f0d] transition-transform duration-300 group-hover/btn:translate-y-0" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Turn Notification Bar */}
            {currentQueue.currentPosition <= 3 && currentQueue.status === "waiting" && (
              <div className="mt-12 flex items-center gap-4 border border-[#ffd88d]/20 bg-[#ffd88d]/10 p-5">
                <Zap size={16} className="text-[#ffd88d]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd88d]">
                  {currentQueue.currentPosition === 1 ? "Immediate action required: Proceed to desk." : "Your arrival is anticipated shortly."}
                </span>
              </div>
            )}
          </div>
        </section>
      ) : (

        <section className="dashboard-panel-dark relative flex flex-col items-center overflow-hidden border border-white/5 py-32 text-center">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-[#ffd88d]/10 blur-[120px]" />
          <div className="relative mb-12">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center rotate-45 group">
              <Activity className="-rotate-45 text-[#ffe2b5]/56 transition-colors group-hover:text-[#ffd88d]" size={32} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-linear-to-b from-white/20 to-transparent mt-4" />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white">
              No active <span className="font-serif italic font-light text-[#ffe2b5]/70 lowercase">sessions.</span>
            </h2>

            <p className="mx-auto max-w-xs text-[10px] uppercase tracking-[0.4em] leading-relaxed text-[#ffe2b5]/66 opacity-80">
              You are not currently registered in <br /> any virtual queue lines.
            </p>
          </div>
          <Link
            href="/dashboard/user/queues"
            className="group relative mt-12 rounded-full bg-white px-12 py-4 transition-colors duration-500 hover:bg-[#ffd88d]"
          >
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-[#4b1d08] group-hover:text-[#4b1d08]">
              Browse Directory
            </span>
          </Link>
        </section>
      )
      }

      {/* --- NAVIGATION GRID --- */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 border border-white/5">
        <NavCard
          href="/dashboard/user/queues"
          icon={<Activity size={24} />}
          title="Directory"
          desc="Access live service points."
          color="text-[#ffd88d]"
        />
        <NavCard
          href="/dashboard/user/history"
          icon={<Clock size={24} />}
          title="Archives"
          desc="Review past interactions."
          color="text-slate-400"
        />
        <NavCard
          href="/dashboard/user/notification"
          icon={<AlertCircle size={24} />}
          title="Alerts"
          desc="System communications."
          color="text-slate-400"
        />
      </section>
    </div >
  );
}

function NavCard({ href, icon, title, desc, color }: any) {
  return (
    <Link href={href} className="group dashboard-panel-dark relative rounded-[1.8rem] p-8 transition-all hover:bg-white/[0.02]">
      <div className={`${color} mb-6 transition-transform group-hover:-translate-y-1`}>
        {icon}
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-[10px] italic text-[#ffe2b5]/62">{desc}</p>
      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} className="text-[#ffd88d]" />
      </div>
    </Link>
  );
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
    <div className={`text-2xl font-bold ${isExpired ? "text-red-500" : "text-emerald-500"}`}>
      {timeLeft}
    </div>
  );
}
