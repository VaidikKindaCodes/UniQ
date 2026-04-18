"use client";

import { useEffect, useState } from "react";
import { History, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { apiService } from "@/app/services/api";

interface QueueHistoryItem {
  queueId: string;
  queueName: string;
  location: string;
  token: string;
  joinedAt: string;
  servedAt: string | null;
  cancelledAt: string | null;
  status: "completed" | "cancelled";
  waitTimeMinutes: number;
}

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<QueueHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQueueHistory();
  }, []);

  const fetchQueueHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get("/user-status/history", true);
      setHistoryData(response.data);
    } catch (err) {
      console.error("Error fetching queue history:", err);
      setError("Failed to load queue history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "served":
      case "completed":
        return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
      case "cancelled":
        return "text-red-300 border-red-500/20 bg-red-500/10";
      default:
        return "text-[#ffe2b5]/70 border-white/10 bg-white/8";
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase(),
      time: d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#ffd88d]" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#ffe2b5]/68">
          Decrypting Archives...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header className="relative flex flex-col justify-between gap-6 border-b border-white/8 pb-8 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
            Member Records
          </span>
          <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
            Archive{" "}
            <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">
              ledger.
            </span>
          </h1>
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 rounded-[1.6rem] border border-red-500/20 bg-red-500/10 p-4 text-[10px] uppercase tracking-widest text-red-200">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="dashboard-panel-dark overflow-hidden rounded-[2rem]">
        {historyData.length === 0 ? (
          <div className="flex flex-col items-center py-40 text-center">
            <History size={32} className="mb-6 text-[#ffd88d]" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#ffe2b5]/62">
              No historical data recorded.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-12 gap-4 border-b border-white/10 p-6 text-[9px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/58 md:grid">
              <div className="col-span-5">Service Point & Location</div>
              <div className="col-span-2 text-center">Token ID</div>
              <div className="col-span-3 text-center">Timestamp</div>
              <div className="col-span-2 text-right">Performance</div>
            </div>

            <div className="divide-y divide-white/8">
              {historyData.map((item) => {
                const joined = formatDate(item.joinedAt);
                const statusStyle = getStatusStyle(item.status);

                return (
                  <div
                    key={`${item.queueId}-${item.token}-${item.joinedAt}`}
                    className="group grid grid-cols-1 items-center gap-4 p-8 transition-colors hover:bg-white/4 md:grid-cols-12"
                  >
                    <div className="col-span-1 space-y-2 md:col-span-5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold uppercase tracking-tight text-white transition-colors group-hover:text-[#ffd88d]">
                          {item.queueName}
                        </h3>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.2em] ${statusStyle}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#ffe2b5]/64">
                        <MapPin size={10} className="text-[#ffd88d]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                          {item.location}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-1 text-left md:col-span-2 md:text-center">
                      <span className="mb-1 block text-[8px] uppercase tracking-widest text-[#ffe2b5]/48 md:hidden">
                        Token ID
                      </span>
                      <span className="inline-block rounded-xl border border-white/10 bg-white/8 px-3 py-1 font-mono text-sm text-white">
                        {item.token}
                      </span>
                    </div>

                    <div className="col-span-1 text-left md:col-span-3 md:text-center">
                      <span className="mb-1 block text-[8px] uppercase tracking-widest text-[#ffe2b5]/48 md:hidden">
                        Timestamp
                      </span>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#ffe2b5]/78">
                        {joined.date}{" "}
                        <span className="mx-1 font-light text-[#ffe2b5]/36">|</span>{" "}
                        {joined.time}
                      </div>
                    </div>

                    <div className="col-span-1 text-left md:col-span-2 md:text-right">
                      <span className="mb-1 block text-[8px] uppercase tracking-widest text-[#ffe2b5]/48 md:hidden">
                        Wait Time
                      </span>
                      <div className="flex flex-col md:items-end">
                        <div className="text-2xl font-bold tracking-tighter text-[#ffd88d]">
                          {item.waitTimeMinutes}
                          <span className="ml-1 text-[10px] font-black italic uppercase tracking-normal">
                            m
                          </span>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-widest text-[#ffe2b5]/48">
                          Total Interval
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <footer className="flex items-center justify-between pt-12 opacity-30">
        <div className="mr-8 h-px flex-1 bg-white/10" />
        <span className="whitespace-nowrap text-[8px] uppercase tracking-[0.8em] text-[#ffe2b5]/54">
          End of Records
        </span>
        <div className="ml-8 h-px flex-1 bg-white/10" />
      </footer>
    </div>
  );
}
