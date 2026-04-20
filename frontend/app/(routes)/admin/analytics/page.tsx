"use client";

import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import QueueLoadChart from "@/components/charts/QueueLoadChart";
import WaitTimeChart from "@/components/charts/WaitTimeChart";
import TokensServedChart from "@/components/charts/TokensServedChart";
import ServiceEfficiencyChart from "@/components/charts/ServiceEfficiencyChart";
import { BarChart3, TrendingUp, Activity, PieChart } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="flex min-h-screen bg-[#0c0502]">
        <AdminSidebar />
        <main className="flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <header className="mb-14 border-b border-white/8 pb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
                Deep Intelligence
              </span>
              <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
                Advanced <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">analytics.</span>
              </h1>
            </header>

            <div className="space-y-12">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-8">
                     <div className="flex items-center gap-3 mb-8">
                        <Activity className="text-[#ffd88d]" size={18} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Temporal Queue Load</h2>
                     </div>
                     <QueueLoadChart />
                  </section>
                  <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-8">
                     <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="text-[#ffd88d]" size={18} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Throughput Velocity</h2>
                     </div>
                     <TokensServedChart />
                  </section>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-8">
                     <div className="flex items-center gap-3 mb-8">
                        <PieChart className="text-[#ffd88d]" size={18} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Service Distribution</h2>
                     </div>
                     <ServiceEfficiencyChart />
                  </section>
                  <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-8">
                     <div className="flex items-center gap-3 mb-8">
                        <BarChart3 className="text-[#ffd88d]" size={18} />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Latency distribution</h2>
                     </div>
                     <WaitTimeChart />
                  </section>
               </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
