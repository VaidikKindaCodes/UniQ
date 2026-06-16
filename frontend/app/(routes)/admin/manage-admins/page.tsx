"use client";

import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import { Mail ,Shield} from "lucide-react";

type AdminUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdBy: string | null;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export default function ManageAdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchAdmins = useCallback(async () => {
    const response = await fetch(`${API_URL}/api/admin/admins`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "fetching admin failed");
    }

    const normalizedAdmins: AdminUser[] = data.map((admin: Record<string, unknown>) => ({
      id: String(admin._id ?? ""),
      email: String(admin.email ?? ""),
      emailVerified: Boolean(admin.emailVerified),
      createdBy: typeof admin.createdByAdmin === "string" ? admin.createdByAdmin : null,
      createdAt: String(admin.createdAt ?? "").split("T")[0],
    }));

    setAdmins(normalizedAdmins);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    fetchAdmins().catch((err) => {
      console.error("Error fetching admins:", err);
    });
  }, [fetchAdmins, token]);

  const handleCreateAdmin = async () => {
    if (!email) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send invite");
      }

      alert("Admin invitation sent successfully!");
      setEmail("");
      await fetchAdmins();
    } catch (err: unknown) {
      console.error("Invite error:", err);
      alert(err instanceof Error ? err.message : "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="flex min-h-screen bg-[#0c0502]">
        <AdminSidebar />
        <main className="flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <header className="mb-14 border-b border-white/8 pb-10">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
                Security Infrastructure
              </span>
              <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
                Admin <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">privileges.</span>
              </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Invite Section */}
              <div className="lg:col-span-4">
                <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 p-8 sticky top-8">
                  <h2 className="mb-6 text-[11px] font-black uppercase tracking-[0.4em] text-[#ffd88d]">
                    Authorize Access
                  </h2>
                  <p className="mb-8 text-[11px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                    Create and manage administrator access. General registration is restricted.
                  </p>

                  <div className="space-y-4">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ffd88d] transition-colors" size={16} />
                      <input
                        type="email"
                        placeholder="ADMIN@UNIQ.EDU"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ffd88d]/40 transition-all"
                      />
                    </div>

                    <button
                      onClick={handleCreateAdmin}
                      disabled={loading}
                      className="w-full rounded-2xl bg-white py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-[#ffd88d] disabled:opacity-20"
                    >
                      {loading ? "TRANSMITTING..." : "DISPATCH INVITE"}
                    </button>
                  </div>

                  <div className="mt-8 flex gap-3 rounded-2xl bg-white/5 p-4 border border-white/5">
                    <Shield className="shrink-0 text-[#ffd88d]" size={16} />
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50 leading-relaxed">
                      Admins MUST verify their identity via the encrypted link sent to their institutional email.
                    </p>
                  </div>
                </section>
              </div>

              {/* Table Section */}
              <div className="lg:col-span-8">
                <section className="theme-card-elevated rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40 overflow-hidden">
                  <div className="px-8 py-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                    <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">
                      Access Roster
                    </h2>
                    <span className="rounded-full bg-[#ffd88d]/10 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-[#ffd88d] border border-[#ffd88d]/20">
                      {admins.length} Total Admins
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[9px] font-black uppercase tracking-widest text-white/20">
                          <th className="px-8 py-4">Identity</th>
                          <th className="px-8 py-4">Status</th>
                          <th className="px-8 py-4">Authorized At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {admins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-white/5 transition-colors">
                            <td className="px-8 py-6">
                              <p className="text-[11px] font-bold text-white uppercase tracking-tight">{admin.email}</p>
                              <p className="text-[8px] font-black uppercase tracking-widest text-[#ffd88d]/40">
                                BY: {admin.createdBy ? "UPPER MGMT" : "SYSTEM ROOT"}
                              </p>
                            </td>
                            <td className="px-8 py-6">
                              {admin.emailVerified ? (
                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-green-500">
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-500">
                                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-8 py-6 text-[10px] font-bold text-white/30 tracking-widest">
                              {admin.createdAt}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
