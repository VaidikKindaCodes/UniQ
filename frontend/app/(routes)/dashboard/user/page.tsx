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
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#00A3C4] font-black">Member Overview</span>
            <h1 className="text-5xl font-bold tracking-tighter uppercase mt-2">
              System <span className="font-serif italic font-light text-slate-500 lowercase">status.</span>
            </h1>
          </div>
          <p className="text-[11px] font-serif italic text-slate-500 max-w-[200px] leading-relaxed">
            Real-time synchronization with active campus service points.
          </p>
        </div>
      </header>

      {/* --- ACTIVE QUEUE CARD (The "Uniq" Live Card) --- */}
      {currentQueue ? (
        <section className="relative group">
          {/* Decorative Glow */}
          <div className="absolute -inset-1 bg-[#00A3C4]/10 blur-2xl rounded-sm opacity-50" />

          <div className="relative bg-white/2 border border-white/10 backdrop-blur-3xl p-8 md:p-12 rounded-sm overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A3C4]/5 blur-[100px] -z-10" />

            <div className="flex flex-col lg:flex-row justify-between gap-12">
              {/* Left Side: Metadata */}
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#00A3C4] rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00A3C4]">Live Connection Active</span>
                </div>

                <div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-none">
                    {currentQueue.queueName}
                  </h2>
                  <div className="mt-4 flex items-center gap-3 text-slate-500">
                    <MapPin size={14} className="text-[#00A3C4]" />
                    <span className="text-xs uppercase tracking-widest font-bold">{currentQueue.location}</span>
                  </div>
                </div>

                {/* Vertical Metrics */}
                <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                  <div className="bg-[#01141a] p-6 text-center">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2 font-bold">Position</p>
                    <p className="text-3xl font-serif italic">#{currentQueue.currentPosition}</p>
                  </div>
                  <div className="bg-[#01141a] p-6 text-center">
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-2 font-bold">Estimated</p>
                    <div className="text-3xl font-serif italic text-[#00A3C4]">
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
              <div className="lg:w-72 flex flex-col items-center justify-center border-l border-white/5 lg:pl-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mb-4">Identification</p>
                <div className="text-7xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {currentQueue.tokenNumber}
                </div>
                <div className="mt-8 w-full">
                  <Link
                    href="/dashboard/user/myqueue"
                    className="group/btn relative flex items-center justify-center gap-4 w-full py-5 border border-white/10 hover:border-[#00A3C4] transition-all overflow-hidden"
                  >
                    <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] group-hover/btn:text-white transition-colors">Digital Pass</span>
                    <ArrowRight size={14} className="relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-[#00A3C4] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Turn Notification Bar */}
            {currentQueue.currentPosition <= 3 && currentQueue.status === "waiting" && (
              <div className="mt-12 p-5 bg-[#00A3C4]/10 border border-[#00A3C4]/20 flex items-center gap-4">
                <Zap size={16} className="text-[#00A3C4]" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#00A3C4]">
                  {currentQueue.currentPosition === 1 ? "Immediate action required: Proceed to desk." : "Your arrival is anticipated shortly."}
                </span>
              </div>
            )}
          </div>
        </section>
      ) : (

        <section className="relative overflow-hidden border border-white/5 bg-[#01141a] py-32 flex flex-col items-center text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00A3C4]/10 blur-[120px] pointer-events-none" />
          <div className="relative mb-12">
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center rotate-45 group">
              <Activity className="-rotate-45 text-slate-500 group-hover:text-[#00A3C4] transition-colors" size={32} />
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-linear-to-b from-white/20 to-transparent mt-4" />
          </div>
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white">
              No active <span className="font-serif italic font-light text-slate-500 lowercase">sessions.</span>
            </h2>

            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] max-w-xs mx-auto leading-relaxed opacity-80">
              You are not currently registered in <br /> any virtual queue lines.
            </p>
          </div>
          <Link
            href="/dashboard/user/queues"
            className="mt-12 group relative px-12 py-4 bg-white hover:bg-[#00A3C4] transition-colors duration-500"
          >
            <span className="relative z-10 text-black group-hover:text-white text-[10px] font-black uppercase tracking-[0.4em]">
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
          color="text-[#00A3C4]"
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
    <Link href={href} className="group relative bg-[#01141a] p-8 transition-all hover:bg-white/[0.02]">
      <div className={`${color} mb-6 transition-transform group-hover:-translate-y-1`}>
        {icon}
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2">{title}</h3>
      <p className="text-[10px] font-serif italic text-slate-600">{desc}</p>
      <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={14} className="text-[#00A3C4]" />
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
