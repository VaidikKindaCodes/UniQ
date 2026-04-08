"use client";

import { useState, useMemo, useEffect } from "react";
import QueueCard from "./QueueCard";
import { CardSkeleton } from "../skeletons/CardSkeleton";
import { Queue } from "./queue.types";
import { queueService } from "../../lib/api/queue";
import { Layers, Map, Activity, ChevronDown } from "lucide-react";

type SortOption = "waitTime" | "queueLength" | "alphabetical";
type LocationFilter = "all" | string;
type StatusFilter = "all" | "open" | "paused" | "full";

export default function QueueList() {
  const [sortBy, setSortBy] = useState<SortOption>("waitTime");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQueues = async () => {
      try {
        setLoading(true);
        const data = await queueService.getQueues();
        setQueues(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching queues:", err);
        setError("DATA_SYNC_FAILURE: Unable to reach central node.");
      } finally {
        setLoading(false);
      }
    };
    fetchQueues();
  }, []);

  const filteredAndSortedQueues = useMemo(() => {
    let filtered = [...queues];
    if (locationFilter !== "all") filtered = filtered.filter((q) => q.location === locationFilter);
    if (statusFilter !== "all") filtered = filtered.filter((q) => q.status === statusFilter);

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "waitTime": return a.waitTime - b.waitTime;
        case "queueLength": return a.queueLength - b.queueLength;
        case "alphabetical": return a.queueName.localeCompare(b.queueName);
        default: return 0;
      }
    });
  }, [queues, sortBy, locationFilter, statusFilter]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(queues.map((q) => q.location));
    return Array.from(locations).sort();
  }, [queues]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="relative border border-white/10 bg-white/2 p-8 sm:p-10">
        <div className="flex flex-col xl:flex-row justify-between gap-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-[#00A3C4] shadow-[0_0_10px_#00A3C4]" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00A3C4]">System Live</span>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter uppercase text-white">
              Queue <span className="font-serif italic font-light text-slate-500 lowercase">directory.</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Showing {filteredAndSortedQueues.length} active sectors
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 max-w-4xl">
            <FilterGroup label="Primary Sort" icon={<Layers size={12} />}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full bg-transparent text-white text-[11px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer"
              >
                <option value="waitTime">Latency (Wait Time)</option>
                <option value="queueLength">Density (Length)</option>
                <option value="alphabetical">Alpha-Numeric</option>
              </select>
            </FilterGroup>

            <FilterGroup label="Geographic Sector" icon={<Map size={12} />}>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value as LocationFilter)}
                className="w-full bg-transparent text-white text-[11px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">Global (All Locations)</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Operational Status" icon={<Activity size={12} />}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full bg-transparent text-white text-[11px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Protocols</option>
                <option value="open">Open / Active</option>
                <option value="paused">Paused / Standby</option>
                <option value="full">Capacity Reach</option>
              </select>
            </FilterGroup>
          </div>
        </div>
      </header>
      <main className="min-h-100">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-white/5 p-8 bg-white/1">
                <CardSkeleton />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-32 border border-red-500/20 bg-red-500/5 text-center space-y-4">
            <p className="text-red-500 font-mono text-xs uppercase tracking-[0.4em] font-black">{error}</p>
            <button onClick={() => window.location.reload()} className="text-[10px] text-white uppercase tracking-widest border border-white/20 px-6 py-2 hover:bg-white hover:text-black transition-all">
              Re-initialize Session
            </button>
          </div>
        ) : filteredAndSortedQueues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAndSortedQueues.map((queue) => (
              <div key={queue.queueId} className="group transition-all">
                <QueueCard queue={queue} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 border border-white/5 bg-white/1 text-center">
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.5em]">
              Zero results found for the current filter parameters.
            </p>
          </div>
        )}
      </main>
      <footer className="pt-20 pb-10 flex flex-col items-center gap-6 opacity-20">
        <div className="h-px w-20 bg-white" />
        <p className="text-[8px] font-mono uppercase tracking-[0.8em]">End of Active Directory</p>
      </footer>
    </div>
  );
}

function FilterGroup({ label, children, icon }: { label: string; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="relative border-l border-white/10 pl-5 group hover:border-[#00A3C4]/50 transition-colors">
      <p className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
        {icon} {label}
      </p>
      <div className="relative">
        {children}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
}