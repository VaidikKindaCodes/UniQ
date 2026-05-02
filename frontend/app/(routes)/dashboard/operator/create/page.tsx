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
  Database,
  ArrowRight
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
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} 
      />
      
      <div className="max-w-2xl w-full relative z-10 theme-card-elevated rounded-[3rem] p-10 sm:p-16">

        <div className="mb-14 space-y-4">
          <div className="flex items-center gap-3 text-[#ffd88d]">
            <Database size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">System Registry</span>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-white">
            Initialize <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">node.</span>
          </h1>
          <p className="text-[10px] font-bold text-[#ffe2b5]/40 uppercase tracking-[0.3em]">
            Configure parameters for new queue deployment
          </p>
        </div>

        {error && (
          <div className="mb-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/50 px-1">
              <Terminal size={14} className="text-[#ffd88d]" /> 
              Queue Identity
            </label>
            <input
              type="text"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-sm font-bold uppercase tracking-widest text-white focus:border-[#ffd88d]/50 focus:bg-white/8 outline-none transition-all placeholder:text-white/10"
              placeholder="e.g. SECTOR_ALPHA_OFFICE"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/50 px-1">
              <MapPin size={14} className="text-[#ffd88d]" /> 
              Deployment Zone
            </label>
            <input
              type="text"
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-sm font-bold uppercase tracking-widest text-white focus:border-[#ffd88d]/50 focus:bg-white/8 outline-none transition-all placeholder:text-white/10"
              placeholder="e.g. LEVEL_01_RECEPTION"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#ffe2b5]/50 px-1">
              <Users size={14} className="text-[#ffd88d]" /> 
              Density Threshold
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-sm font-bold tracking-widest text-white focus:border-[#ffd88d]/50 outline-none transition-all"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[8px] font-black text-white/20 uppercase tracking-widest">OBJ_LIMIT</div>
            </div>
            <p className="text-[9px] font-bold text-[#ffe2b5]/30 uppercase tracking-tight italic px-1">
               Auto-lock engaged when waiting sequence reaches limit.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full bg-[#ffd88d] hover:bg-[#ffe2b5] text-[#4b1d08] py-5 px-8 rounded-full text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 disabled:opacity-30 disabled:grayscale shadow-[0_16px_32px_rgba(255,216,141,0.2)]"
          >
            {loading ? "PROCESSING..." : (
              <>
                Confirm Deployment <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-16 flex justify-between items-center opacity-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white" />
          <span className="mx-6 text-[7px] font-black uppercase tracking-[0.5em]">Protocol Version 4.0.1-ELITE</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white" />
        </div>
      </div>
    </div>
  );
}