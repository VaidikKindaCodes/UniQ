"use client";

import { useState, useEffect } from "react";
import {
  History,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
        return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
      case "cancelled":
        return "text-red-500 border-red-500/20 bg-red-500/5";
      default:
        return "text-slate-500 border-white/10 bg-white/5";
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
      time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A3C4]" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Decrypting Archives...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <header className="relative pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#00A3C4] font-black">Member Records</span>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mt-2">
            Archive <span className="font-serif italic font-light text-slate-500 lowercase">ledger.</span>
          </h1>
        </div>
      </header>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] uppercase tracking-widest flex items-center gap-3">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

    
      <div className="border border-white/5 bg-white/1 overflow-hidden">
        {historyData.length === 0 ? (
          <div className="py-40 flex flex-col items-center text-center">
            <History size={32} className="text-slate-800 mb-6" />
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600">No historical data recorded.</p>
          </div>
        ) : (
          <>
            
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-white/10 text-[9px] uppercase tracking-[0.3em] font-black text-slate-500">
              <div className="col-span-5">Service Point & Location</div>
              <div className="col-span-2 text-center">Token ID</div>
              <div className="col-span-3 text-center">Timestamp</div>
              <div className="col-span-2 text-right">Performance</div>
            </div>

      
            <div className="divide-y divide-white/5">
              {historyData.map((item) => {
                const joined = formatDate(item.joinedAt);
                const statusStyle = getStatusStyle(item.status);

                return (
                  <div
                    key={`${item.queueId}-${item.token}-${item.joinedAt}`}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-4 p-8 items-center hover:bg-white/2 transition-colors"
                  >
        
                    <div className="col-span-1 md:col-span-5 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold uppercase tracking-tight text-white group-hover:text-[#00A3C4] transition-colors">
                          {item.queueName}
                        </h3>
                        <span className={`text-[8px] uppercase tracking-[0.2em] font-black px-2 py-0.5 border rounded-sm ${statusStyle}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={10} className="text-[#00A3C4]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.location}</span>
                      </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 text-left md:text-center">
                      <span className="md:hidden text-[8px] uppercase tracking-widest text-slate-600 block mb-1">Token ID</span>
                      <span className="font-mono text-white text-sm bg-white/5 px-3 py-1 border border-white/10 inline-block">
                        {item.token}
                      </span>
                    </div>

                    <div className="col-span-1 md:col-span-3 text-left md:text-center">
                      <span className="md:hidden text-[8px] uppercase tracking-widest text-slate-600 block mb-1">Timestamp</span>
                      <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                        {joined.date} <span className="text-slate-600 font-light mx-1">|</span> {joined.time}
                      </div>
                    </div>

            
                    <div className="col-span-1 md:col-span-2 text-left md:text-right">
                      <span className="md:hidden text-[8px] uppercase tracking-widest text-slate-600 block mb-1">Wait Time</span>
                      <div className="flex flex-col md:items-end">
                        <div className="text-2xl font-bold tracking-tighter text-[#00A3C4]">
                          {item.waitTimeMinutes}<span className="text-[10px] ml-1 uppercase font-black tracking-normal italic">m</span>
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold">Total Interval</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <footer className="pt-12 flex justify-between items-center opacity-30">
        <div className="h-px bg-white/10 flex-1 mr-8" />
        <span className="text-[8px] uppercase tracking-[0.8em] text-slate-500 whitespace-nowrap">End of Records</span>
        <div className="h-px bg-white/10 flex-1 ml-8" />
      </footer>
    </div>
  );
}