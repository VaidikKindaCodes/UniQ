"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  User,
  Menu,
  X,
  Cpu,
  Radio,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { apiService } from "@/app/services/api";
import { useEffect, useMemo, useState } from "react";

type SidebarQueue = {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  location: string;
};

const navItems = [
  { href: "/dashboard/operator/queues", label: "All Queues", icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/operator/live", label: "Live Queues", icon: <PlayCircle size={18} /> },
  { href: "/dashboard/operator/create", label: "Create Queue", icon: <Activity size={18} /> },
  { href: "/profile", label: "Profile", icon: <User size={18} /> },
];

export default function OperatorSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout } = useAuth();
  const [queues, setQueues] = useState<SidebarQueue[]>([]);
  const [queueError, setQueueError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const selectedQueueId = searchParams.get("queueId");

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    let active = true;
    const loadQueues = async () => {
      try {
        const data = await apiService.get("/operator/queues", true);
        const parsed = Array.isArray(data)
          ? data
          : data?.queues || data?.data?.queues || [];
        if (active) setQueues(parsed);
      } catch (error) {
        throw error instanceof Error ? error : new Error("Failed to load queues");
        if (active) setQueueError(true);
      }
    };
    loadQueues();
    return () => { active = false; };
  }, []);

  const activeQueues = useMemo(
    () => queues.filter((queue) => queue.status === "ACTIVE"),
    [queues]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-card-elevated fixed top-4 left-4 z-50 p-3 lg:hidden shadow-[0_0_15px_rgba(0,0,0,0.25)]"
      >
        {isOpen ? <X size={20} className="text-[var(--surface-rust)]" /> : <Menu size={20} />}
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#180902]/70 backdrop-blur-md lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside
        className={`sidebar-shell fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 transform transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="p-8 border-b border-white/5">
            <div className="flex items-center justify-between mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/18 bg-white/10 text-xs font-black text-white">
                  U
                </div>
                <div>
                  <span className="block text-lg font-semibold uppercase tracking-[0.24em] text-white">UNIQ</span>
                  <span className="block text-[9px] uppercase tracking-[0.34em] text-[#ffe2b5]/80">Operator Flow</span>
                </div>
              </Link>
              <ThemeToggle />
            </div>
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-[#ffd88d]" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/66">
                Operator Portal
              </p>
            </div>
          </div>
          <nav className="flex-1 px-4 py-8 space-y-1">
            <p className="mb-4 px-4 text-[8px] font-black uppercase tracking-[0.4em] text-white/42">Core Modules</p>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all duration-300 ${
                    active
                      ? "border-[#ffd88d]/20 bg-white/10 text-white shadow-[inset_0_0_10px_rgba(255,216,141,0.08)]"
                      : "border-transparent text-white/62 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className={`${active ? "text-[#ffd88d]" : "text-white/44 group-hover:text-[#ffd88d]"}`}>
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-widest transition-colors">
                    {item.label}
                  </span>
                  {active && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#ffd88d]" />}
                </Link>
              );
            })}
            <div className="pt-10">
              <div className="flex items-center justify-between px-4 mb-4">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/42">Live Terminals</p>
                <Radio size={10} className="text-[#ffd88d] animate-pulse" />
              </div>

              <div className="space-y-1 max-h-75 overflow-y-auto custom-scrollbar">
                {queueError ? (
                  <p className="px-4 text-[10px] font-mono text-red-500/60 uppercase">System Error_</p>
                ) : activeQueues.length === 0 ? (
                  <p className="px-4 text-[10px] font-mono text-white/46 uppercase">No active nodes_</p>
                ) : (
                  activeQueues.map((queue) => {
                    const isSelected = selectedQueueId === queue.id;
                    return (
                      <Link
                        key={queue.id}
                        href={`/dashboard/operator/live?queueId=${queue.id}`}
                        onClick={() => setIsOpen(false)}
                        className={`group flex flex-col gap-1 rounded-2xl px-4 py-4 border transition-all ${
                          isSelected
                            ? "border-[#ffd88d]/18 bg-white/10"
                            : "border-transparent hover:bg-white/6"
                        }`}
                      >
                        <span className={`truncate text-[10px] font-bold uppercase tracking-tight ${isSelected ? 'text-white' : 'text-white/64'}`}>
                          {queue.name}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-[7px] font-mono uppercase tracking-widest text-white/42">{queue.location.slice(0, 15)}</span>
                          {isSelected && (
                            <span className="text-[7px] font-black text-[#ffd88d] uppercase tracking-widest animate-pulse">Connected</span>
                          )}
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </nav>
          <div className="p-6 border-t border-white/5 bg-black/20">
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-white/62 transition-colors hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Terminate</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
