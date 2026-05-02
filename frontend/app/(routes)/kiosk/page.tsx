"use client";

import Link from "next/link";
import Kiosk from "../../../components/kiosk/Kiosk";
import { MonitorOff, ArrowLeft, Cpu } from "lucide-react";

type PageProps = {
  params: { slug: string }; 
  searchParams?: { queueId?: string };
};

export default function KioskPage({ searchParams }: PageProps) {
  const queueId = searchParams?.queueId;

  if (!queueId) {
    return (
      <main className="min-h-screen w-full bg-[#050505] flex items-center justify-center p-8 relative overflow-hidden">

        <div className="absolute inset-0 opacity-10 [bg:linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [bg-size:40px_40px]" />
        <div className="relative z-10 max-w-lg w-full border border-white/10 bg-white/2 p-12 text-center space-y-8 backdrop-blur-md">
          <div className="flex justify-center">
            <div className="p-4 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500">
              <MonitorOff size={40} strokeWidth={1} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-xs font-black uppercase tracking-[0.6em] text-[#00A3C4]">
              Display Standby
            </h1>
            <p className="text-3xl font-bold tracking-tighter text-white uppercase">
              No Active Node Selected
            </p>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-4">
              Awaiting queue parameter signal to initialize kiosk display.
            </p>
          </div>
          
          <div className="pt-6">
            <Link
              href="/dashboard/user/queues"
              className="group inline-flex items-center gap-3 border border-white/20 px-8 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return to Registry
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 flex items-center gap-4 opacity-20">
          <Cpu size={12} className="text-white" />
          <span className="text-[8px] font-mono uppercase tracking-[0.5em] text-white">System Kiosk Module v4.0</span>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <Kiosk queueId={queueId} />
    </main>
  );
}