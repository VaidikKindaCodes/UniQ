"use client";

import { useEffect, useState } from "react";
import { Check, AlertTriangle, Clock, Loader2, Inbox } from "lucide-react";
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
            : n,
        ),
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

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
      case "success":
        return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
      case "warning":
        return "text-amber-200 border-amber-500/20 bg-amber-500/10";
      case "error":
        return "text-red-300 border-red-500/20 bg-red-500/10";
      default:
        return "text-[#ffd88d] border-[#ffd88d]/20 bg-[#ffd88d]/10";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#ffd88d]" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-[#ffe2b5]/68">
          Decrypting Signal...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 animate-in fade-in duration-700">
      <header className="relative flex flex-col justify-between gap-6 border-b border-white/8 pb-8 md:flex-row md:items-end">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
            Member Notifications
          </span>
          <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
            Alert{" "}
            <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">
              stream.
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex rounded-xl border border-white/10 bg-white/8 p-1">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === f
                    ? "bg-[#ffd88d] text-[#4b1d08]"
                    : "text-[#ffe2b5]/70 hover:text-white"
                }`}
              >
                {f} {f === "unread" && unreadCount > 0 && `(${unreadCount})`}
              </button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="rounded-xl border border-white/10 bg-white/8 p-2.5 text-[#ffe2b5]/70 transition-all hover:border-[#ffd88d]/40 hover:text-[#ffd88d]"
              title="Mark all as read"
            >
              <Check size={16} />
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="flex items-center gap-3 rounded-[1.6rem] border border-red-500/20 bg-red-500/10 p-4 text-[10px] uppercase tracking-widest text-red-200">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      <div className="relative">
        <div className="absolute bottom-0 left-[1.45rem] top-0 hidden w-px bg-linear-to-b from-[#ffd88d]/50 via-white/5 to-transparent md:block" />

        <div className="space-y-6">
          {notifications.length === 0 ? (
            <div className="dashboard-panel-dark rounded-[2rem] py-32 text-center">
              <Inbox className="mx-auto mb-6 text-[#ffd88d]" size={40} />
              <p className="text-[10px] font-bold italic uppercase tracking-[0.4em] text-[#ffe2b5]/64">
                {filter === "unread"
                  ? "No new signals detected."
                  : "Communication log is empty."}
              </p>
            </div>
          ) : (
            notifications.map((n, index) => {
              const statusStyle = getStatusStyle(n.type);

              return (
                <div
                  key={n.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className={`group relative animate-in fade-in slide-in-from-left-4 pl-0 duration-500 md:pl-16 ${
                    n.isRead ? "opacity-55" : "opacity-100"
                  }`}
                >
                  <div
                    className={`absolute left-5 top-7 z-10 hidden h-2 w-2 rounded-full border border-black transition-all duration-700 md:block ${
                      n.isRead
                        ? "bg-white/30"
                        : "bg-[#ffd88d] shadow-[0_0_12px_#ffd88d]"
                    }`}
                  />

                  <div
                    className={`rounded-[1.8rem] border bg-white/[0.03] p-6 transition-all duration-300 ${
                      n.isRead
                        ? "border-white/8"
                        : "border-white/12 hover:border-[#ffd88d]/30 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[8px] font-black uppercase tracking-widest ${statusStyle}`}
                          >
                            {n.type}
                          </span>
                          <h3 className="truncate text-base font-bold uppercase tracking-tight text-white">
                            {n.title}
                          </h3>
                        </div>

                        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-[#ffe2b5]/74">
                          {n.message}
                        </p>

                        <div className="flex items-center gap-6 text-[9px] font-mono uppercase tracking-widest text-[#ffe2b5]/56">
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-[#ffd88d]/60" />{" "}
                            {formatDate(n.createdAt)}
                          </span>
                          {n.queueName && (
                            <span className="flex items-center gap-2 border-l border-white/10 pl-6">
                              <span className="font-black text-[#ffe2b5]/42">
                                LOG_SRC:
                              </span>
                              <span className="text-[#ffd88d]/80">{n.queueName}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="rounded-xl border border-white/10 bg-white/8 p-2 text-[#ffe2b5]/70 transition-all hover:border-[#ffd88d]/40 hover:text-[#ffd88d] md:opacity-0 group-hover:opacity-100"
                          title="Acknowledge"
                        >
                          <Check size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <footer className="flex flex-col items-center gap-4 pb-8 pt-16 opacity-20">
        <div className="flex w-full items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="whitespace-nowrap text-[8px] font-black uppercase tracking-[1em] text-[#ffe2b5]/54">
            End of Transmission Log
          </span>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <span className="text-[7px] font-mono uppercase tracking-tighter text-[#ffe2b5]/44">
          Uniq Elite v1.0 // Secured Protocol // {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}
