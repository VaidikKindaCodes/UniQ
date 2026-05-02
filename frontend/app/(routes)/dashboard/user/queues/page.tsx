"use client";

import { useEffect, useState } from "react";
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
          q.location.toLowerCase().includes(searchTerm.toLowerCase()),
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
      `Do you want to join "${queueName}"? You will receive a token and be added to the queue.`,
    );

    if (!confirmed) return;

    try {
      setJoiningQueue(queueId);
      const response = await apiService.post(
        "/user-status/join-queue",
        { queueId },
        true,
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
          : "Failed to join queue. You may already be in a queue.",
      );
    } finally {
      setJoiningQueue(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/15 dark:text-green-300">
            Open
          </span>
        );
      case "paused":
        return (
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            Paused
          </span>
        );
      case "full":
        return (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-500/15 dark:text-red-300">
            Full
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#ffd88d]" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#ffe2b5]/68">
          Synchronizing Directory...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="relative flex flex-col justify-between gap-6 border-b border-white/8 pb-8 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
            Live Directory
          </span>
          <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
            Service{" "}
            <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">
              points.
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchQueues}
            className="group rounded-xl border border-white/12 bg-white/8 p-3 transition-colors hover:border-[#ffd88d]/40 hover:bg-white/12"
          >
            <RefreshCw
              size={16}
              className="text-[#ffe2b5]/70 transition-all group-hover:text-[#ffd88d]"
            />
          </button>

          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ffe2b5]/55"
              size={14}
            />
            <input
              type="text"
              placeholder="SEARCH BY LOCATION..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-[#3c1605]/90 py-3 pl-12 pr-4 text-[10px] tracking-widest uppercase text-[#ffe9c7] outline-none transition-all placeholder:text-[#e4bf87] focus:border-[#ffd88d]"
            />
          </div>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-300/30 bg-red-500/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-300" />
          <div>
            <p className="text-sm font-medium text-red-100">Error loading queues</p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
        </div>
      )}

      {filteredQueues.length === 0 ? (
        <div className="dashboard-panel-dark rounded-[2rem] py-32 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#ffe2b5]/64">
            No matching service points found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredQueues.map((queue) => (
            <div
              key={queue.queueId}
              className="dashboard-panel-dark group relative overflow-hidden rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute right-0 top-0 h-40 w-40 bg-[#ffd88d]/6 blur-[90px]" />

              <div className="mb-10 flex items-start justify-between">
                <div className="space-y-1">
                  {getStatusBadge(queue.status)}
                  <h3 className="pt-3 text-xl font-bold uppercase tracking-tight text-white transition-colors group-hover:text-[#ffd88d]">
                    {queue.queueName}
                  </h3>
                  <div className="flex items-center gap-2 text-[#ffe2b5]/68">
                    <MapPin size={12} className="text-[#ffd88d]" />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {queue.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-px rounded-[1.4rem] border border-white/8 bg-white/8">
                <div className="rounded-l-[1.4rem] bg-[#2a1306] p-4">
                  <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-[#ffe2b5]/56">
                    Capacity
                  </p>
                  <p className="text-sm font-serif italic text-white">
                    {queue.queueLength}{" "}
                    <span className="text-[#ffe2b5]/38">/</span>{" "}
                    {queue.capacity ?? "∞"}
                  </p>
                </div>
                <div className="rounded-r-[1.4rem] bg-[#2a1306] p-4">
                  <p className="mb-1 text-[8px] font-bold uppercase tracking-widest text-[#ffe2b5]/56">
                    Est. Wait
                  </p>
                  <p className="text-sm font-serif italic text-[#ffd88d]">
                    ~{queue.waitTime}m
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleJoinQueue(queue.queueId, queue.queueName)}
                disabled={queue.status !== "open" || joiningQueue === queue.queueId}
                className={`relative w-full overflow-hidden rounded-full border py-4 text-[10px] font-black uppercase tracking-[0.4em] transition-all ${
                  queue.status === "open"
                    ? "border-white/10 text-white hover:border-[#ffd88d]"
                    : "cursor-not-allowed border-transparent bg-white/6 text-[#ffe2b5]/38"
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
                  <div className="absolute inset-0 translate-y-full bg-[#7a2f0d] transition-transform duration-300 group-hover:translate-y-0" />
                )}
              </button>

              {(queue.status === "full" || queue.isFull) && (
                <p className="mt-3 text-xs text-red-300">
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
