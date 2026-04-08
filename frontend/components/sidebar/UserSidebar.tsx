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
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (href: string) => {
    return href === "/dashboard/user" ? pathname === "/dashboard/user" : pathname.startsWith(href);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 p-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-sm lg:hidden text-[#00A3C4]"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#01141a] border-r border-white/5 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col relative">
          <div className="absolute top-0 left-0 w-full h-64 bg-[#00A3C4]/5 blur-[80px] pointer-events-none" />
          <div className="relative z-10 p-8 pt-10">
            <div className="flex items-center justify-between mb-10">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-7 h-7 bg-[#00A3C4] flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500">
                  <span className="font-serif text-[10px] text-white -rotate-45 group-hover:-rotate-90 transition-transform duration-500">Q</span>
                </div>
                <span className="text-lg font-serif italic tracking-widest uppercase text-white">Uniq</span>
              </Link>
              <ThemeToggle />
            </div>
            
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#00A3C4]">Member Portal</p>
              <p className="text-[10px] font-serif italic text-slate-500 lowercase">Workspace Environment</p>
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
                  className={`group flex items-center gap-4 px-6 py-4 transition-all duration-300 relative overflow-hidden ${
                    active 
                      ? "text-[#00A3C4] bg-white/3" 
                      : "text-slate-400 hover:text-white hover:bg-white/2"
                  }`}
                >
                  {/* Active Indicator Line */}
                  {active && (
                    <div className="absolute left-0 top-0 w-0.5 h-full bg-[#00A3C4]" />
                  )}
                  
                  <span className={`transition-colors duration-300 ${active ? "text-[#00A3C4]" : "group-hover:text-[#00A3C4]"}`}>
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
          <div className="p-6 border-t border-white/5 relative z-10">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                router.push("/login");
              }}
              className="group flex w-full items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/10 hover:bg-red-500/5 rounded-sm"
            >
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-[#01141a]/80 backdrop-blur-md lg:hidden transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}