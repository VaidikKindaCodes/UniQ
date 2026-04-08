"use client";

import { useState, useEffect } from "react";
import { apiService } from "@/app/services/api";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  ArrowUpRight,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Queue {
  queueId: string;
  queueName: string;
  location: string;
  queueLength: number;
  waitTime: number;
  status: "open" | "paused" | "full";
  capacity?: number;
  isFull?: boolean;
  availableSlots?: number;
}

export default function BrowseQueuesPage() {
  const router = useRouter();
  const [queues, setQueues] = useState<Queue[]>([]);
  const [filteredQueues, setFilteredQueues] = useState<Queue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningQueue, setJoiningQueue] = useState<string | null>(null);

  useEffect(() => {
    fetchQueues();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredQueues(queues);
    } else {
      const filtered = queues.filter(
        (q) =>
          q.queueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQueues(filtered);
    }
  }, [searchTerm, queues]);

  const fetchQueues = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get("/queues", false);
      setQueues(response.queues || []);
      setFilteredQueues(response.queues || []);
    } catch (err: unknown) {
      console.error("Failed to fetch queues:", err);
      setError(err instanceof Error ? err.message : "Failed to load queues");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinQueue = async (queueId: string, queueName: string) => {
    const confirmed = window.confirm(
      `Do you want to join "${queueName}"? You will receive a token and be added to the queue.`
    );

    if (!confirmed) return;

    try {
      setJoiningQueue(queueId);
      const response = await apiService.post(
        "/user-status/join-queue",
        { queueId },
        true
      );

      if (response.success) {
        toast.success(`Successfully joined! Your token: ${response.data.tokenNumber}`);
        router.push("/dashboard/user/myqueue");
      }
    } catch (err: unknown) {
      console.error("Failed to join queue:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to join queue. You may already be in a queue."
      );
    } finally {
      setJoiningQueue(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-300">
            Open
          </span>
        );
      case "paused":
        return (
          <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            Paused
          </span>
        );
      case "full":
        return (
          <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
            Full
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A3C4]" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Synchronizing Directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="relative pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#00A3C4] font-black">Live Directory</span>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mt-2">
            Service <span className="font-serif italic font-light text-slate-500 lowercase">points.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
           <button
            onClick={fetchQueues}
            className="group p-3 border border-white/10 hover:border-[#00A3C4] transition-colors rounded-sm"
          >
            <RefreshCw size={16} className="text-slate-500 group-hover:text-[#00A3C4] transition-all" />
          </button>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input
              type="text"
              placeholder="SEARCH BY LOCATION..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/3 border border-white/10 py-3 pl-12 pr-4 text-[10px] tracking-widest uppercase outline-none focus:border-[#00A3C4] transition-all"
            />
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-300/30 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-medium text-red-200">Error loading queues</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {filteredQueues.length === 0 ? (
        <div className="py-32 border border-white/5 bg-white/1 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">No matching service points found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {filteredQueues.map((queue) => (
            <div
              key={queue.queueId}
              className="group relative bg-[#01141a] p-8 hover:bg-white/2 transition-all duration-500 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-1">
                  {getStatusBadge(queue.status)}
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white group-hover:text-[#00A3C4] transition-colors pt-3">
                    {queue.queueName}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={12} className="text-[#00A3C4]" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{queue.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 mb-8">
                <div className="bg-[#01141a] p-4">
                   <p className="text-[8px] uppercase tracking-widest text-slate-600 mb-1 font-bold">Capacity</p>
                   <p className="text-sm font-serif italic text-white">{queue.queueLength} <span className="text-slate-600">/</span> {queue.capacity ?? "∞"}</p>
                </div>
                <div className="bg-[#01141a] p-4">
                   <p className="text-[8px] uppercase tracking-widest text-slate-600 mb-1 font-bold">Est. Wait</p>
                   <p className="text-sm font-serif italic text-[#00A3C4]">~{queue.waitTime}m</p>
                </div>
              </div>

              <button
                onClick={() => handleJoinQueue(queue.queueId, queue.queueName)}
                disabled={queue.status !== "open" || joiningQueue === queue.queueId}
                className={`relative w-full py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all overflow-hidden border ${
                  queue.status === "open" 
                  ? "border-white/10 hover:border-[#00A3C4] text-white" 
                  : "border-transparent text-slate-700 bg-white/2 cursor-not-allowed"
                }`}
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {joiningQueue === queue.queueId ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      {queue.status === "open" ? "Initialize Join" : "Point Unavailable"}
                      {queue.status === "open" && <ArrowUpRight size={14} />}
                    </>
                  )}
                </div>
                {queue.status === "open" && (
                  <div className="absolute inset-0 bg-[#00A3C4] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                )}
              </button>
              {(queue.status === "full" || queue.isFull) && (
                <p className="mt-2 text-xs text-red-400">
                  This queue is currently at capacity. Please try again later.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
