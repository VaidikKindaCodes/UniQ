"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  List,
  LogOut,
  PlayCircle,
  User,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { apiService } from "@/app/services/api";
import { useEffect, useMemo, useState } from "react";

type SidebarQueue = {
  id: string;
  name: string;
  status: "ACTIVE" | "PAUSED";
  location: string;
};

const navItems = [
  { href: "/dashboard/operator/queues", label: "All Queues", icon: <LayoutDashboard size={20} /> },
  { href: "/dashboard/operator/live", label: "Live Queues", icon: <PlayCircle size={20} /> },
  { href: "/dashboard/operator/create", label: "Create Queue", icon: <Activity size={20} /> },
  { href: "/profile", label: "Profile", icon: <User size={20} /> },
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
        if (active) {
          setQueues(parsed);
        }
      } catch (error) {
        console.error("Failed to load sidebar queues", error);
        if (active) {
          setQueueError(true);
        }
      }
    };

    loadQueues();
    return () => {
      active = false;
    };
  }, []);

  const activeQueues = useMemo(
    () => queues.filter((queue) => queue.status === "ACTIVE"),
    [queues]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-xl border border-white/30 bg-white/85 p-2.5 shadow-lg backdrop-blur lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[rgba(8,34,48,0.42)] backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-linear-to-b from-[#085078] via-[#157490] to-[#85D8CE] text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/12 p-6">
            <div className="brand-wordmark text-white">
              <span className="brand-wordmark-mark">u</span>
              <span className="brand-wordmark-name text-white">uniq</span>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
              Operator Workspace
            </p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-white text-[#085078] shadow-lg"
                    : "text-white/80 hover:bg-white/12 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {isActive(item.href) && (
                  <ChevronRight size={16} className="ml-auto text-[#085078]" />
                )}
              </Link>
            ))}

            <div className="pt-3">
              <div className="flex items-center gap-2 px-4 text-xs font-semibold uppercase tracking-[0.26em] text-white/70 mb-3">
                <List size={14} />
                Queue Switcher
              </div>
              {queueError ? (
                <p className="px-4 text-xs text-red-200">Unable to load queues</p>
              ) : activeQueues.length === 0 ? (
                <p className="px-4 text-xs text-white/70">No active queues</p>
              ) : (
                <div className="space-y-2">
                  {activeQueues.map((queue) => {
                    const isSelected = selectedQueueId === queue.id;
                    return (
                      <Link
                        key={queue.id}
                        href={`/dashboard/operator/live?queueId=${queue.id}`}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isSelected
                            ? "bg-white text-[#085078]"
                            : "text-white/80 hover:bg-white/12 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{queue.name}</span>
                        <span className="text-[10px] uppercase tracking-[0.24em] text-white/60">
                          Live
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          <div className="p-4 border-t border-white/12">
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-white/80 transition-all duration-200 hover:bg-white/12 hover:text-white"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
