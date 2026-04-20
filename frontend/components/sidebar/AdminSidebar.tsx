"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  BarChart3,
  Settings,
  ShieldUser,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Overview", icon: <LayoutDashboard size={20} /> },
  {
    href: "/admin/queues",
    label: "Queues Management",
    icon: <ListOrdered size={20} />,
  },
  { href: "/admin/operators", label: "Operators", icon: <Users size={20} /> },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: <BarChart3 size={20} />,
  },
  { href: "/admin/manage-admins", label: "Manage Admins", icon: <ShieldUser size={20} /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings size={20} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-card-elevated fixed top-4 left-4 z-50 rounded-xl p-2.5 lg:hidden"
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
        className={`sidebar-shell fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
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
                  <span className="block text-[9px] uppercase tracking-[0.34em] text-[#ffe2b5]/80">Admin Console</span>
                </div>
              </Link>
              <ThemeToggle />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ffd88d]">
              Admin Workspace
            </p>
          </div>

          <nav className="flex-1 px-4 py-8 space-y-1">
            <p className="mb-4 px-4 text-[8px] font-black uppercase tracking-[0.4em] text-white/42">Main Modules</p>
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
          </nav>

          <div className="p-6 border-t border-white/5 bg-black/20">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                router.push("/login");
              }}
              className="group flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-white/62 transition-colors hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

