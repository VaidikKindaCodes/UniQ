"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { fetchAllQueues, deleteQueue } from "@/lib/api/admin";
import { ListOrdered, Trash2, Pause, Play, MapPin, Users, Clock, AlertCircle } from "lucide-react";

interface Queue {
  _id: string;
  name: string;
  location: string;
  isActive: boolean;
  capacity: number;
  nextSequence: number;
  operator?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function AdminQueuesPage() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllQueues();
      setQueues(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load queues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to PERMANENTLY delete the queue "${name}"? This will also delete all associated tokens.`)) {
      return;
    }

    try {
      await deleteQueue(id);
      setQueues(queues.filter(q => q._id !== id));
    } catch (err) {
      alert("Failed to delete queue");
    }
  };

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="flex min-h-screen bg-[#0c0502]">
        <AdminSidebar />

        <main className="flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <header className="mb-14 border-b border-white/8 pb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
                Logistics Control
              </span>
              <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
                Queue <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">management.</span>
              </h1>
            </header>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-48 rounded-[2.5rem] bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[2.5rem] border border-red-500/20 bg-red-500/5 p-10 text-center text-white">
                <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                <p>{error}</p>
              </div>
            ) : queues.length === 0 ? (
              <div className="rounded-[2.5rem] border border-white/5 bg-white/5 p-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">No active nodes detected</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {queues.map((queue) => (
                  <div 
                    key={queue._id} 
                    className="theme-card-elevated group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-8 transition-all hover:border-[#ffd88d]/30"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                           <div className={`h-2 w-2 rounded-full ${queue.isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`} />
                           <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
                             {queue.isActive ? "Operational" : "Paused"}
                           </span>
                        </div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">{queue.name}</h2>
                        <div className="mt-4 flex items-center gap-4 text-white/60">
                           <div className="flex items-center gap-1.5">
                              <MapPin size={12} className="text-[#ffd88d]" />
                              <span className="text-[10px] font-bold uppercase">{queue.location}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Users size={12} className="text-[#ffd88d]" />
                              <span className="text-[10px] font-bold uppercase">Cap: {queue.capacity}</span>
                           </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleDelete(queue._id, queue.name)}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-[#ffd88d]/10 flex items-center justify-center text-[#ffd88d] text-[10px] font-black">
                             {queue.operator?.name[0] || "S"}
                          </div>
                          <div>
                             <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Managed By</p>
                             <p className="text-[10px] font-bold text-white">{queue.operator?.name || "System Auto"}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-black uppercase tracking-widest text-white/30">Next Token</p>
                          <p className="text-xl font-black text-[#ffd88d]">#{queue.nextSequence}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
