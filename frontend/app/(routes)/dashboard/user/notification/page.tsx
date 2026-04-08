"use client";

import { useState, useEffect } from "react";
import {
  Check,
  AlertTriangle,
  Clock,
  Loader2,
  Inbox,
} from "lucide-react";
import { userQueueService, UserNotification } from "@/lib/services/userQueueService";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
    
      await new Promise((resolve) => setTimeout(resolve, 600));
      const response = await userQueueService.getNotifications(filter === "unread");
      setNotifications(response.data);
    } catch (err) {
      console.error("Sync Error:", err);
      setError("COMMUNICATION_FAILURE: UNABLE TO SYNC WITH SERVER.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await userQueueService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId 
            ? { ...n, isRead: true, readAt: new Date().toISOString() } 
            : n
        )
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
  
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    try {
      for (const n of unread) {
        await userQueueService.markNotificationAsRead(n.id);
      }
    } catch (err) {
      console.error("Mark all read error:", err);
      fetchNotifications(); 
    }
  };

  const getStatusStyle = (type: string) => {
    switch (type) {
      case "success": return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
      case "warning": return "text-amber-500 border-amber-500/20 bg-amber-500/5";
      case "error":   return "text-red-500 border-red-500/20 bg-red-500/5";
      default:        return "text-[#00A3C4] border-[#00A3C4]/20 bg-[#00A3C4]/5";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", { hour12: false, hour: '2-digit', minute: '2-digit' });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#00A3C4]" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Decrypting Signal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
  
      <header className="relative pb-8 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.5em] text-[#00A3C4] font-black">Member Notifications</span>
          <h1 className="text-5xl font-bold tracking-tighter uppercase mt-2">
            Alert <span className="font-serif italic font-light text-slate-500 lowercase">stream.</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-sm border border-white/10">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  filter === f 
                    ? "bg-[#00A3C4] text-black shadow-[0_0_15px_rgba(0,163,196,0.3)]" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="p-2.5 bg-white/5 border border-white/10 text-slate-400 hover:text-[#00A3C4] hover:border-[#00A3C4]/50 transition-all rounded-sm"
              title="Mark all as read"
            >
              <Check size={16} />
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="p-4 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] uppercase tracking-widest flex items-center gap-3">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      <div className="relative">
     
        <div className="absolute left-5.75 top-0 bottom-0 w-px bg-linear-to-b from-[#00A3C4]/50 via-white/5 to-transparent hidden md:block" />

        <div className="space-y-6">
          {notifications.length === 0 ? (
            <div className="py-32 text-center border border-white/5 bg-white/1 rounded-sm">
              <Inbox className="mx-auto text-slate-800 mb-6" size={40} />
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-600 font-bold italic">
                {filter === "unread" ? "No new signals detected." : "Communication log is empty."}
              </p>
            </div>
          ) : (
            notifications.map((n, index) => {
              const statusStyle = getStatusStyle(n.type);
              
              return (
                <div
                  key={n.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`group relative pl-0 md:pl-16 transition-all animate-in fade-in slide-in-from-left-4 duration-500 ${
                    n.isRead ? "opacity-40 grayscale-[0.5]" : "opacity-100"
                  }`}
                >
                
                  <div className={`absolute left-5 top-7 w-2 h-2 rounded-full border border-black z-10 hidden md:block transition-all duration-700 ${
                    n.isRead ? "bg-slate-800" : "bg-[#00A3C4] shadow-[0_0_12px_#00A3C4]"
                  }`} />

                  <div className={`border p-6 rounded-sm transition-all duration-300 bg-white/[0.02] ${
                    n.isRead ? "border-white/5" : "border-white/10 hover:border-[#00A3C4]/40 hover:bg-white/[0.04]"
                  }`}>
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-xs ${statusStyle}`}>
                            {n.type}
                          </span>
                          <h3 className="text-base font-bold text-white uppercase tracking-tight truncate">
                            {n.title}
                          </h3>
                        </div>
                        
                        <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-2xl">
                          {n.message}
                        </p>

                        <div className="flex items-center gap-6 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-[#00A3C4]/50" /> {formatDate(n.createdAt)}
                          </span>
                          {n.queueName && (
                            <span className="border-l border-white/10 pl-6 flex items-center gap-2">
                              <span className="text-slate-700 font-black">LOG_SRC:</span> 
                              <span className="text-[#00A3C4]/70">{n.queueName}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {!n.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(n.id)}
                            className="p-2 border border-white/5 bg-white/5 text-slate-400 hover:text-[#00A3C4] hover:border-[#00A3C4]/50 transition-all rounded-sm md:opacity-0 group-hover:opacity-100"
                            title="Acknowledge"
                          >
                            <Check size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <footer className="pt-16 pb-8 flex flex-col items-center gap-4 opacity-20">
        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-[8px] uppercase tracking-[1em] text-slate-500 font-black whitespace-nowrap">
            End of Transmission Log
          </span>
          <div className="h-px bg-white/10 flex-1" />
        </div>
        <span className="font-mono text-[7px] text-slate-600 uppercase tracking-tighter">
          Uniq Elite v1.0 // Secured Protocol // {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}