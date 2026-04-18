"use client";

import { useCallback, useEffect, useState } from "react";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";

type AdminUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdBy: string | null;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
      <div className="app-shell flex min-h-screen">
        <AdminSidebar />
        <main className="app-content-shell flex-1 lg:ml-72">
          <div className="space-y-8 p-4 pt-12 sm:p-6 lg:p-8">
            <div className="dashboard-panel rounded-[2rem] p-6 sm:p-8">
              <h1 className="mb-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                Manage Admins
              </h1>
              <p className="text-sm text-slate-600 sm:text-base">
                Create and manage administrator access. Public admin signup is
                disabled.
              </p>
            </div>

            <div className="dashboard-panel rounded-[2rem] p-6 sm:p-8">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Invite New Admin
              </h2>

              <div className="flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="newadmin@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <button
                  onClick={handleCreateAdmin}
                  disabled={loading}
                  className="rounded-xl bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Invite"}
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Admins receive an email invite to verify their account.
              </p>
            </div>

            <div className="dashboard-panel rounded-[2rem] p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold text-slate-900">
                Existing Admins
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full overflow-hidden rounded-xl border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Created By
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {admins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-t border-slate-200 hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {admin.email}
                        </td>

                        <td className="px-4 py-3">
                          {admin.emailVerified ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              Pending
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {admin.createdBy ?? "Bootstrap Admin"}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600">
                          {admin.createdAt}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            disabled
                            className="cursor-not-allowed text-sm text-slate-400"
                            title="Self-role edits disabled"
                          >
                            --
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs text-slate-500">
                - Admin role changes and self-edits are intentionally disabled.
                <br />
                - Bootstrap admin cannot be removed.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
