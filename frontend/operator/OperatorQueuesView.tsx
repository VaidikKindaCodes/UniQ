"use client";

import { CardSkeleton } from "@/components/skeletons/CardSkeleton";
import { apiService } from "@/app/services/api";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
      setError("Unable to load your queues right now.");
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
          ? "Queue paused successfully."
          : "Queue resumed successfully.",
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
        err instanceof Error ? err.message : "Failed to update queue status";
      console.error("Failed to update queue status", err);
      toast.error(message);
    } finally {
      setActionQueueId(null);
    }
  };

  const saveCapacity = async (queue: OperatorQueue) => {
    const raw = capacityEdits[queue.id] ?? String(queue.capacity ?? "");
    const nextCapacity = Number(raw);

    if (Number.isNaN(nextCapacity) || nextCapacity <= 0) {
      toast.error("Capacity must be a positive number.");
      return;
    }

    try {
      setSavingCapacity(queue.id);
      await apiService.patch(
        `/operator/queues/${queue.id}/capacity`,
        { capacity: nextCapacity },
        true,
      );
      toast.success("Capacity updated.");
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
        err instanceof Error ? err.message : "Failed to update capacity";
      toast.error(message);
    } finally {
      setSavingCapacity(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Operator Dashboard
            </h1>
            <p className="text-slate-600">
              Manage all queues you own in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/operator/live"
              className="inline-flex items-center justify-center rounded-full border border-sky-600 px-4 py-2 font-semibold text-sky-700 shadow-sm transition-colors hover:bg-sky-50"
            >
              Live Queues
            </Link>
            <Link
              href="/dashboard/operator/create"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-sky-700"
            >
              + Create Queue
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        ) : queues.length === 0 ? (
          <div className="dashboard-panel rounded-[2rem] p-10 text-center">
            <h2 className="mb-2 text-xl font-semibold text-slate-900">
              No queues yet
            </h2>
            <p className="mb-6 text-slate-600">
              Create your first queue to start serving users.
            </p>
            <Link
              href="/dashboard/operator/create"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 font-semibold text-white shadow transition-colors hover:bg-sky-700"
            >
              Create a queue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {queues.map((queue) => (
              <div
                key={queue.id}
                className="dashboard-panel rounded-[2rem] p-6 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {queue.name}
                    </h3>
                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-[var(--surface-rust)]">•</span>
                      {queue.location}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      queue.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : queue.isFull
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {queue.isFull
                      ? "Full"
                      : queue.status === "ACTIVE"
                        ? "Active"
                        : "Paused"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-slate-500">Waiting</p>
                    <p className="font-semibold text-slate-900">
                      {queue.waitingCount ?? "--"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-slate-500">Capacity</p>
                    <p className="font-semibold text-slate-900">
                      {queue.capacity ?? "--"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3">
                    <p className="text-slate-500">Available</p>
                    <p className="font-semibold text-slate-900">
                      {queue.capacity !== undefined && queue.waitingCount !== undefined
                        ? Math.max(queue.capacity - queue.waitingCount, 0)
                        : "--"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => goToQueue(queue.id)}
                    className="inline-flex items-center justify-center rounded-full border border-sky-600 px-4 py-2 font-semibold text-sky-700 transition-colors hover:bg-sky-50"
                  >
                    View Live
                  </button>
                  <button
                    onClick={() => toggleQueueStatus(queue)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                    disabled={actionQueueId === queue.id}
                  >
                    {queue.status === "ACTIVE" ? "Pause" : "Resume"}
                  </button>
                  <div className="flex items-center gap-2">
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
                      className="w-24 rounded-full border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                    />
                    <button
                      onClick={() => saveCapacity(queue)}
                      disabled={savingCapacity === queue.id}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    >
                      {savingCapacity === queue.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                  <Link
                    href={`/kiosk/${queue.id}`}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Go to kiosk
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
