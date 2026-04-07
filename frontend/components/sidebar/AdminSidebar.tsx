"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  BarChart3,
  Settings,
  ShieldUser,
  User,
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
              Admin Workspace
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
          </nav>

          <div className="p-4 border-t border-white/12">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
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
