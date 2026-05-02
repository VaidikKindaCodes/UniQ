"use client";

import { apiService } from "@/app/services/api";
import NowServingCard from "@/operator/NowServingCard";
import OperatorControls from "@/operator/OperatorControls";
import OperatorHeader from "@/operator/OperatorHeader";
import TokenList from "@/operator/TokenList";
import { subscribeToQueue } from "@/lib/websocket";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LayoutDashboard, Radio, MapPin, Activity } from "lucide-react";

type Token = { id: string; number: number; status: string };

type QueueData = {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  location: string;
  capacity?: number;
  isFull?: boolean;
};

type OperatorQueue = {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  location: string;
  capacity?: number;
  isFull?: boolean;
};

type OperatorViewToken = {
  id: string;
  number?: number;
  seq?: number;
  status: string;
};

type OperatorViewResponse = {
  queue: QueueData;
  tokens: OperatorViewToken[];
  nowServing?: { id: string; number: number } | null;
};

type QueueUpdatePayload = {
  queue: QueueData;
  queueId: string;
  tokens: Array<{ id: string; seq: number; status: string }>;
};

type QueueMetrics = {
  waitingCount: number;
  nowServing: number | null;
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

const normalizeTokens = (tokens: OperatorViewToken[]): Token[] => {
  const mapped = tokens
    .map((t) => {
      const number = t.number ?? t.seq;
      if (typeof number !== "number") return null;
      return { id: t.id, number, status: t.status };
    })
    .filter((t): t is Token => t !== null);

  return mapped.sort((a, b) => a.number - b.number);
};

export default function LiveContent() {
  const searchParams = useSearchParams();
  const queueIdParam = searchParams.get("queueId");

  const [queues, setQueues] = useState<OperatorQueue[]>([]);
  const [queueMetrics, setQueueMetrics] = useState<
    Record<string, QueueMetrics>
  >({});
  const [selectedQueueId, setSelectedQueueId] = useState<string | null>(null);
  const [loadingQueues, setLoadingQueues] = useState(true);
  const [queueListError, setQueueListError] = useState<string | null>(null);

  const [loadingQueue, setLoadingQueue] = useState(true);
  const [queue, setQueue] = useState<QueueData | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [nowServing, setNowServing] = useState<{
    id: string;
    number: number;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeQueues = useMemo(
    () => queues.filter((queue) => queue.status === "ACTIVE"),
    [queues]
  );

  const waitingTokens = useMemo(
    () => tokens.filter((t) => t.status === "waiting"),
    [tokens]
  );

  const loadQueues = useCallback(async () => {
    try {
      setLoadingQueues(true);
      const data = await apiService.get("/operator/queues", true);
      setQueues(parseQueues(data));
      setQueueListError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unable to load queues";
      setQueueListError(message);
    } finally {
      setLoadingQueues(false);
    }
  }, []);

  useEffect(() => {
    loadQueues();
  }, [loadQueues]);

  useEffect(() => {
    if (queueIdParam && queues.some((q) => q.id === queueIdParam)) {
      setSelectedQueueId(queueIdParam);
      return;
    }

    if (!selectedQueueId && queues.length > 0) {
      const preferred = activeQueues[0]?.id || queues[0]?.id || null;
      setSelectedQueueId(preferred);
    }

    if (selectedQueueId && queues.length > 0) {
      const exists = queues.some((q) => q.id === selectedQueueId);
      if (!exists) {
        setSelectedQueueId(activeQueues[0]?.id || queues[0]?.id || null);
      }
    }
  }, [queueIdParam, queues, activeQueues, selectedQueueId]);

  const updateMetrics = useCallback((queueId: string, data: QueueMetrics) => {
    setQueueMetrics((prev) => ({
      ...prev,
      [queueId]: data,
    }));
  }, []);

  const loadQueueMetrics = useCallback(async () => {
    if (activeQueues.length === 0) return;

    const metricsUpdates: Record<string, QueueMetrics> = {};

    await Promise.all(
      activeQueues.map(async (queue) => {
        try {
          const data = await apiService.get(
            `/queues/${queue.id}/operator-view`,
            true
          );
          metricsUpdates[queue.id] = {
            waitingCount: data.tokens?.length || 0,
            nowServing: data.nowServing?.number ?? null,
          };
        } catch (err) {
          console.error("Failed to fetch queue metrics", err);
        }
      })
    );

    setQueueMetrics((prev) => ({
      ...prev,
      ...metricsUpdates,
    }));
  }, [activeQueues]);

  useEffect(() => {
    loadQueueMetrics();
  }, [loadQueueMetrics]);

  const hydrateFromSnapshot = useCallback(
    (payload: QueueUpdatePayload) => {
      setQueue({
        id: payload.queue.id,
        name: payload.queue.name,
        location: payload.queue.location,
        status: payload.queue.status,
        capacity: payload.queue.capacity,
        isFull: payload.queue.isFull,
      });

      setQueues((prev) =>
        prev.map((item) =>
          item.id === payload.queue.id
            ? {
              ...item,
              status: payload.queue.status,
              capacity: payload.queue.capacity,
              isFull: payload.queue.isFull,
            }
            : item
        )
      );

      const mappedTokens = normalizeTokens(payload.tokens);

      setTokens(mappedTokens);

      const served = mappedTokens
        .filter((t) => t.status === "served")
        .sort((a, b) => b.number - a.number);

      setNowServing(
        served[0] ? { id: served[0].id, number: served[0].number } : null
      );

      updateMetrics(payload.queue.id, {
        waitingCount: mappedTokens.filter((t) => t.status === "waiting").length,
        nowServing: served[0]?.number ?? null,
      });
    },
    [updateMetrics]
  );

  const loadSelectedQueue = useCallback(async () => {
    if (!selectedQueueId) return;
    try {
      setLoadingQueue(true);
      const data = (await apiService.get(
        `/queues/${selectedQueueId}/operator-view`,
        true
      )) as OperatorViewResponse;
      const normalizedTokens = normalizeTokens(data.tokens || []);
      setQueue(data.queue);
      setTokens(normalizedTokens);
      setNowServing(
        data.nowServing
          ? { id: data.nowServing.id, number: data.nowServing.number }
          : null
      );
      updateMetrics(selectedQueueId, {
        waitingCount: normalizedTokens.length,
        nowServing: data.nowServing?.number ?? null,
      });
      setQueues((prev) =>
        prev.map((item) =>
          item.id === data.queue.id
            ? {
              ...item,
              status: data.queue.status,
              capacity: data.queue.capacity,
              isFull: data.queue.isFull,
            }
            : item
        )
      );
      setError(null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load queue";
      setError(message);
    } finally {
      setLoadingQueue(false);
    }
  }, [selectedQueueId, updateMetrics]);

  useEffect(() => {
    if (!selectedQueueId) return;

    loadSelectedQueue();
    const unsubscribe = subscribeToQueue(selectedQueueId, {
      onUpdate: hydrateFromSnapshot,
      onError: (err) => console.error("Socket error", err),
    });
    return () => {
      unsubscribe();
    };
  }, [selectedQueueId, hydrateFromSnapshot, loadSelectedQueue]);

  const callAction = async (action: string, method: "POST" | "PATCH") => {
    if (!selectedQueueId) return;
    try {
      setActionLoading(action);
      setError(null);
      if (method === "POST") {
        await apiService.post(
          `/operator/queues/${selectedQueueId}/${action}`,
          {},
          true
        );
      } else {
        await apiService.patch(
          `/operator/queues/${selectedQueueId}/${action}`,
          {},
          true
        );
      }
      await loadSelectedQueue();
      toast.success("Sync successful.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Action failed";
      setError(message);
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const serveNext = () => callAction("serve-next", "POST");
  const skipToken = () => callAction("skip", "POST");
  const recallToken = () => callAction("recall", "POST");
  const extendToken = () => {
    if (!nowServing) return;
    apiService.extendToken(nowServing.id, 2).then(() => {
      toast.success("Time extended.");
      loadSelectedQueue();
    }).catch(e => toast.error(e.message));
  };
  const markNoShow = () => {
    if (!nowServing) return;
    apiService.markNoShow(nowServing.id).then(() => {
      toast.success("Entry marked.");
      loadSelectedQueue();
    }).catch(e => toast.error(e.message));
  };
  const toggleQueueStatus = () =>
    queue?.status === "ACTIVE"
      ? callAction("pause", "PATCH")
      : callAction("resume", "PATCH");

  if (loadingQueues) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#ffd88d]" />
      </div>
    );
  }

  if (queueListError) {
    return (
      <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center max-w-2xl mx-auto mt-20">
        <p className="text-[11px] font-black uppercase tracking-widest text-red-500">{queueListError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
        <header className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/8 pb-10">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
              Live Feed
            </span>
            <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
              Terminal <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">sync.</span>
            </h1>
          </div>
          <Link
            href="/dashboard/operator/queues"
            className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-6 py-3 transition-all hover:border-[#ffd88d]/40 hover:bg-white/12"
          >
            <LayoutDashboard className="h-4 w-4 text-[#ffd88d]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white">Registry View</span>
          </Link>
        </header>

        <section className="mb-16">
          <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
              <Radio className="h-3 w-3 text-[#ffd88d] animate-pulse" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffe2b5]/40">Active Nodes</h2>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
            {activeQueues.map((queueItem) => {
              const metrics = queueMetrics[queueItem.id];
              const isSelected = queueItem.id === selectedQueueId;
              return (
                <button
                  key={queueItem.id}
                  onClick={() => setSelectedQueueId(queueItem.id)}
                  className={`min-w-[280px] text-left theme-card-elevated rounded-[2rem] p-6 transition-all relative ${
                    isSelected ? "border-[#ffd88d]/40 bg-[#ffd88d]/5 shadow-[0_12px_32px_rgba(255,216,141,0.1)]" : "hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className={`text-lg font-bold uppercase tracking-tight transition-colors ${isSelected ? 'text-[#ffd88d]' : 'text-white'}`}>
                        {queueItem.name}
                      </h3>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 flex items-center gap-1">
                        <MapPin size={10} />
                        {queueItem.location}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/5 bg-white/3 p-3 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Queue</p>
                      <p className="text-xl font-bold tracking-tighter text-[#ffe2b5]">
                        {metrics ? metrics.waitingCount : "—"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-white/3 p-3 text-center">
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Active</p>
                      <p className="text-xl font-bold tracking-tighter text-[#ffe2b5]">
                        {metrics?.nowServing ?? "—"}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-6 right-6 h-1 w-1 rounded-full bg-[#ffd88d] shadow-[0_0_8px_rgba(255,216,141,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {error && (
          <div className="mb-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>
          </div>
        )}

        {loadingQueue ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#ffd88d]" />
          </div>
        ) : !queue ? (
          <div className="p-20 text-center theme-card-elevated rounded-[3rem]">
             <h2 className="text-2xl font-bold uppercase text-white/20">Node_Offline</h2>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Waiting Seq", val: waitingTokens.length, icon: <Activity className="text-[#ffd88d]" /> },
                { label: "Logic Hub", val: queue.status.toUpperCase(), icon: <Radio className="text-[#ffd88d]" /> },
                { label: "Currently Addressing", val: nowServing ? nowServing.number : "NONE", icon: <LayoutDashboard className="text-[#ffd88d]" /> },
                { label: "Terminal Cap", val: queue.capacity ?? "—", icon: <MapPin className="text-[#ffd88d]" />, sub: queue.isFull ? "CAP_REACHED" : "SYNCING" }
              ].map((m, i) => (
                <div key={i} className="theme-card-elevated rounded-[2.2rem] p-8 group transition-all hover:border-[#ffd88d]/20">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="p-2 rounded-xl bg-white/5 border border-white/5">{m.icon}</span>
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{m.label}</span>
                  </div>
                  <div className="text-3xl font-bold tracking-tighter text-[#ffe2b5]">
                    {m.val}
                  </div>
                  {m.sub && (
                    <div className={`mt-2 text-[8px] font-black uppercase tracking-[0.3em] ${m.sub === 'CAP_REACHED' ? 'text-red-500' : 'text-green-500'}`}>
                      {m.sub}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 space-y-8">
                <OperatorHeader queue={queue} status={queue.status} />
                <NowServingCard token={nowServing} />
              </div>

              <div className="lg:col-span-8 space-y-8">
                <TokenList tokens={waitingTokens} />
                <div className="relative">
                  <OperatorControls
                    onServeNext={serveNext}
                    onSkip={skipToken}
                    onRecall={recallToken}
                    onExtend={extendToken}
                    onNoShow={markNoShow}
                    onToggleQueue={toggleQueueStatus}
                    queueStatus={queue.status}
                  />
                  {actionLoading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center z-20">
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d] animate-pulse">Syncing_Command...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
