"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/app/services/api";
import { toast } from "sonner";
import { 
  Plus, 
  MapPin, 
  Users, 
  Terminal,  
  AlertCircle,
  Database
} from "lucide-react";

export default function CreateQueuePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", location: "", capacity: 50 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiService.post("/queues", formData, true);
      if (res.success) {
        toast.success("NODE INITIALIZED SUCCESSFULLY");
        router.push("/dashboard/operator/queues");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Initialization Failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-[#050505] text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} 
      />
      
      <div className="max-w-xl w-full relative z-10 border border-white/10 bg-white/2 backdrop-blur-md p-10 sm:p-14">

        <div className="mb-12 space-y-3">
          <div className="flex items-center gap-3 text-[#00A3C4]">
            <Database size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Registry</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
            Initialize <span className="text-[#00A3C4]">Node</span>
          </h1>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Configure parameters for new queue deployment
          </p>
        </div>

        {error && (
          <div className="mb-8 border border-red-500/20 bg-red-500/5 p-5 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Terminal size={12} className="text-[#00A3C4]" /> 
              Queue Identity
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/3 border border-white/10 p-4 text-xs font-mono uppercase tracking-widest focus:border-[#00A3C4]/50 focus:bg-white/5 outline-none transition-all placeholder:text-slate-800"
              placeholder="e.g. SECTOR_ALPHA_OFFICE"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <MapPin size={12} className="text-[#00A3C4]" /> 
              Deployment Zone
            </label>
            <input
              type="text"
              required
              className="w-full bg-white/3 border border-white/10 p-4 text-xs font-mono uppercase tracking-widest focus:border-[#00A3C4]/50 focus:bg-white/5 outline-none transition-all placeholder:text-slate-800"
              placeholder="e.g. LEVEL_01_RECEPTION"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Users size={12} className="text-[#00A3C4]" /> 
              Density Threshold
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                className="w-full bg-white/3 border border-white/10 p-4 text-xs font-mono uppercase tracking-widest focus:border-[#00A3C4]/50 outline-none transition-all"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-700">OBJ_LIMIT</div>
            </div>
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-tight italic">
               Auto-lock engaged when waiting sequence reaches limit.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-[#00A3C4] hover:bg-cyan-400 text-black py-5 px-6 text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale"
          >
            {loading ? "PROCESSING..." : (
              <>
                Confirm Deployment <Plus size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 flex justify-between items-center opacity-20">
          <div className="h-px flex-1 bg-linear-to-r from-transparent to-white/30" />
          <span className="mx-4 text-[7px] font-mono uppercase tracking-widest">Protocol Version 4.0.1-ELITE</span>
          <div className="h-px flex-1 bg-linear-to-l from-transparent to-white/30" />
        </div>
      </div>
    </div>
  );
}