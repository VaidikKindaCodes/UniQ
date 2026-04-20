"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Activity,
  Bell,
  History,
  LayoutDashboard,
  ListChecks,
  Settings,
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
  { href: "/dashboard/user", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/user/queues", label: "Live Directory", icon: <Activity size={18} /> },
  { href: "/dashboard/user/myqueue", label: "Active Status", icon: <ListChecks size={18} /> },
  { href: "/dashboard/user/history", label: "Archives", icon: <History size={18} /> },
  { href: "/dashboard/user/notification", label: "Alerts", icon: <Bell size={18} /> },
  { href: "/dashboard/user/settings", label: "Preferences", icon: <Settings size={18} /> },
];

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    return href === "/dashboard/user" ? pathname === "/dashboard/user" : pathname.startsWith(href);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-card-elevated fixed top-6 left-6 z-50 rounded-xl p-3 lg:hidden"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={`sidebar-shell fixed inset-y-0 left-0 z-40 w-72 border-r border-white/8 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col relative">
          <div className="absolute top-0 left-0 h-64 w-full bg-[#ffd88d]/10 blur-[80px] pointer-events-none" />
          <div className="relative z-10 p-8 pt-10">
            <div className="flex items-center justify-between mb-10">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-white/20 bg-white/10 transition-transform duration-500 group-hover:rotate-6">
                  <span className="text-xs font-black text-white">U</span>
                </div>
                <div>
                  <span className="block text-lg font-semibold uppercase tracking-[0.26em] text-white">UNIQ</span>
                  <span className="block text-[9px] uppercase tracking-[0.42em] text-[#ffe2b5]/80">Campus Flow</span>
                </div>
              </Link>
              <ThemeToggle />
            </div>
            
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#ffd88d]">Member Portal</p>
              <p className="text-[10px] text-white/56 uppercase tracking-[0.24em]">Warm queue workspace</p>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1 relative z-10">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group sidebar-nav-link relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300 ${
                    active 
                      ? "sidebar-nav-link-active"
                      : ""
                  }`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-[#7a2f0d]" />
                  )}
                  
                  <span className={`transition-colors duration-300 ${active ? "text-[#7a2f0d]" : "group-hover:text-[#ffd88d]"}`}>
                    {item.icon}
                  </span>
                  
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                    {item.label}
                  </span>
  
                  {active && (
                    <ChevronRight size={14} className="ml-auto opacity-50" />
                  )}
                </Link>
              );
            })}
          </nav>
          {(user?.email === "gargmishti9@gmail.com" || isAdmin) && (
            <div className="px-6 mb-2 relative z-10">
              <Link
                href="/admin"
                className="group flex w-full items-center gap-4 rounded-2xl border border-[#ffd88d]/10 bg-[#ffd88d]/5 px-6 py-4 text-[#ffd88d] transition-all duration-300 hover:border-[#ffd88d]/30 hover:bg-[#ffd88d]/10"
              >
                <LayoutDashboard size={18} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Admin Terminal</span>
              </Link>
            </div>
          )}
          <div className="p-6 border-t border-white/5 relative z-10">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                router.push("/login");
              }}
              className="sidebar-nav-link group flex w-full items-center gap-4 rounded-2xl border border-transparent px-6 py-4 text-white/68 transition-all duration-300 hover:border-red-300/10 hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#180902]/70 backdrop-blur-md lg:hidden transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
