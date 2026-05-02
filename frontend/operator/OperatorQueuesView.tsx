"use client";

import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { apiService } from "@/app/services/api";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LayoutDashboard, Plus, PlayCircle, Settings2, Trash2, MapPin } from "lucide-react";

export type OperatorQueue = {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  location: string;
  capacity?: number;
  isFull?: boolean;
  waitingCount?: number;
};

const parseQueues = (payload: unknown): OperatorQueue[] => {
  if (Array.isArray(payload)) return payload as OperatorQueue[];
  if (payload && typeof payload === "object") {
    const record = payload as {
      queues?: OperatorQueue[];
      data?: { queues?: OperatorQueue[] };
    };
    if (Array.isArray(record.queues)) return record.queues;
    if (Array.isArray(record.data?.queues)) return record.data.queues;
  }
  return [];
};

export default function OperatorQueuesView() {
  const router = useRouter();
  const [queues, setQueues] = useState<OperatorQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionQueueId, setActionQueueId] = useState<string | null>(null);
  const [capacityEdits, setCapacityEdits] = useState<Record<string, string>>({});
  const [savingCapacity, setSavingCapacity] = useState<string | null>(null);

  const loadQueues = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.get("/operator/queues", true);
      const parsed = parseQueues(data);
      setQueues(parsed);
      setError(null);
      setCapacityEdits(
        parsed.reduce(
          (acc, queue) => ({ ...acc, [queue.id]: String(queue.capacity ?? "") }),
          {},
        ),
      );
    } catch (err) {
      console.error("Failed to load queues", err);
      setError("Unable to load nodes from registry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  const goToQueue = (id: string) => {
    router.push(`/dashboard/operator/live?queueId=${id}`);
  };

  const toggleQueueStatus = async (queue: OperatorQueue) => {
    try {
      setActionQueueId(queue.id);
      const action = queue.status === "ACTIVE" ? "pause" : "resume";
      await apiService.patch(`/operator/queues/${queue.id}/${action}`, {}, true);
      toast.success(
        queue.status === "ACTIVE"
          ? "NODE_PAUSED"
          : "NODE_RESUMED",
      );
      setQueues((prev) =>
        prev.map((item) =>
          item.id === queue.id
            ? {
                ...item,
                status: queue.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
              }
            : item,
        ),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Protocol breach detected.";
      toast.error(message);
    } finally {
      setActionQueueId(null);
    }
  };

  const saveCapacity = async (queue: OperatorQueue) => {
    const raw = capacityEdits[queue.id] ?? String(queue.capacity ?? "");
    const nextCapacity = Number(raw);

    if (Number.isNaN(nextCapacity) || nextCapacity <= 0) {
      toast.error("Invalid density threshold.");
      return;
    }

    try {
      setSavingCapacity(queue.id);
      await apiService.patch(
        `/operator/queues/${queue.id}/capacity`,
        { capacity: nextCapacity },
        true,
      );
      toast.success("THRESHOLD_SYNCED");
      setQueues((prev) =>
        prev.map((item) =>
          item.id === queue.id
            ? {
                ...item,
                capacity: nextCapacity,
                isFull: (item.waitingCount ?? 0) >= nextCapacity,
              }
            : item,
        ),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Sync failed.";
      toast.error(message);
    } finally {
      setSavingCapacity(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/8 pb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
              Operator Terminal
            </span>
            <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
              Node <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">registry.</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard/operator/live"
              className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-6 py-3 transition-all hover:border-[#ffd88d]/40 hover:bg-white/12"
            >
              <PlayCircle className="h-4 w-4 text-[#ffd88d]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">Live Terminals</span>
            </Link>
            <Link
              href="/dashboard/operator/create"
              className="group flex items-center gap-3 rounded-full bg-[#ffd88d] px-8 py-3 transition-all hover:scale-105 active:scale-95 shadow-[0_12px_24px_rgba(255,216,141,0.15)]"
            >
              <Plus className="h-4 w-4 text-[#4b1d08]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b1d08]">Initialize Node</span>
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="theme-card-elevated h-64 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-red-500">{error}</p>
          </div>
        ) : queues.length === 0 ? (
          <div className="theme-card-elevated rounded-[3rem] p-20 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <LayoutDashboard size={24} className="text-white/20" />
            </div>
            <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight text-white">Registry Empty</h2>
            <p className="mb-10 text-sm text-white/40 uppercase tracking-[0.2em]">No operational nodes detected in this sector.</p>
            <Link
              href="/dashboard/operator/create"
              className="inline-flex items-center gap-3 rounded-full bg-white/10 px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black"
            >
              Initialize First Node
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {queues.map((queue) => (
              <div
                key={queue.id}
                className="theme-card-elevated group relative rounded-[2.5rem] p-8 transition-all hover:border-[#ffd88d]/30"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${queue.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <span className="text-[8px] font-black uppercase tracking-[0.5em] text-[#ffe2b5]/40">{queue.status === 'ACTIVE' ? 'Operational' : 'Paused_'}</span>
                    </div>
                    <h3 className="text-3xl font-bold uppercase tracking-tighter text-white">
                      {queue.name}
                    </h3>
                    <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#ffe2b5]/60">
                      <MapPin size={12} className="text-[#ffd88d]" />
                      {queue.location}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3 text-right">
                     <span className={`rounded-full px-4 py-1.5 text-[8px] font-black uppercase tracking-widest ${
                       queue.isFull ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                       queue.status === 'ACTIVE' ? "bg-green-500/10 text-green-500 border border-green-500/20" : 
                       "bg-white/5 text-white/40 border border-white/10"
                     }`}>
                       {queue.isFull ? "Limit_Reached" : queue.status === 'ACTIVE' ? "Active_Sync" : "Offline"}
                     </span>
                  </div>
                </div>

                <div className="my-10 grid grid-cols-3 gap-4">
                  {[
                    { label: "Waiting", val: queue.waitingCount ?? 0, icon: <LayoutDashboard size={10} /> },
                    { label: "Limit", val: queue.capacity ?? "--", icon: <Settings2 size={10} /> },
                    { label: "Available", val: queue.capacity !== undefined && queue.waitingCount !== undefined ? Math.max(queue.capacity - queue.waitingCount, 0) : "--", icon: <PlayCircle size={10} /> }
                  ].map((stat, i) => (
                    <div key={i} className="rounded-3xl border border-white/5 bg-white/3 p-5">
                      <div className="mb-2 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white/40">
                        {stat.icon}
                        {stat.label}
                      </div>
                      <p className="text-2xl font-bold tracking-tighter text-[#ffe2b5]">{stat.val}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => goToQueue(queue.id)}
                    className="flex-1 rounded-2xl bg-white/8 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white transition-all hover:bg-white hover:text-black"
                  >
                    Enter Live Terminal
                  </button>
                  <button
                    onClick={() => toggleQueueStatus(queue)}
                    disabled={actionQueueId === queue.id}
                    className={`flex-1 rounded-2xl border px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] transition-all ${
                      queue.status === "ACTIVE" 
                        ? "border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white" 
                        : "border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white"
                    }`}
                  >
                    {actionQueueId === queue.id ? "Processing..." : queue.status === "ACTIVE" ? "Suspend Sync" : "Restore Sync"}
                  </button>
                </div>
                
                <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-6">
                   <div className="flex-1 relative">
                      <input
                        type="number"
                        min={1}
                        value={capacityEdits[queue.id] ?? queue.capacity ?? ""}
                        onChange={(e) =>
                          setCapacityEdits((prev) => ({
                            ...prev,
                            [queue.id]: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/4 px-6 py-3 text-[10px] font-bold tracking-widest text-white focus:border-[#ffd88d]/50 focus:outline-none"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[7px] font-black uppercase tracking-widest text-white/20">Set_Cap</span>
                   </div>
                   <button
                      onClick={() => saveCapacity(queue)}
                      disabled={savingCapacity === queue.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#ffe2b5] transition-all hover:border-[#ffd88d]/40 hover:bg-[#ffd88d]/10 disabled:opacity-30"
                    >
                      {savingCapacity === queue.id ? "Syncing" : "Sync"}
                    </button>
                    <Link
                      href={`/kiosk/${queue.id}`}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#ffe2b5]/40 transition-all hover:bg-white/10 hover:text-[#ffd88d]"
                    >
                      <Plus size={18} />
                    </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
