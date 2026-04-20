"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { fetchAllOperators, resetOperatorPassword } from "@/lib/api/admin";
import { Users, Key, Mail, Shield, AlertCircle, Search, MoreVertical, CheckCircle2 } from "lucide-react";

interface Operator {
  _id: string;
  name: string;
  email: string;
  department?: string;
  position?: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchAllOperators();
      setOperators(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load operators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetPassword = async (id: string, name: string) => {
    const newPassword = prompt(`Enter new password for ${name}:`);
    if (!newPassword) return;

    try {
      await resetOperatorPassword(id, newPassword);
      alert("Password reset successfully");
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  const filteredOperators = operators.filter(op => 
    op.name.toLowerCase().includes(search.toLowerCase()) || 
    op.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ProtectedRoute roles={["admin"]}>
      <div className="flex min-h-screen bg-[#0c0502]">
        <AdminSidebar />

        <main className="flex-1 lg:ml-72">
          <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <header className="mb-14 border-b border-white/8 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ffd88d]">
                  Human Resources
                </span>
                <h1 className="mt-2 text-5xl font-bold uppercase tracking-tighter text-white">
                  Operator <span className="font-serif font-light italic lowercase text-[#ffe2b5]/70">directory.</span>
                </h1>
              </div>

              <div className="relative group w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#ffd88d] transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH BY NAME OR EMAIL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-white outline-none focus:border-[#ffd88d]/40 transition-all"
                />
              </div>
            </header>

            {loading ? (
               <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
                  ))}
               </div>
            ) : error ? (
              <div className="rounded-[2.5rem] border border-red-500/20 bg-red-500/5 p-10 text-center text-white text-[10px] font-black uppercase tracking-widest">
                <AlertCircle className="mx-auto mb-4 text-red-500" size={32} />
                <p>{error}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#1a0f0a]/40">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                      <th className="px-8 py-6">Identity</th>
                      <th className="px-8 py-6">Department</th>
                      <th className="px-8 py-6">Security</th>
                      <th className="px-8 py-6">Joined</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOperators.map((op) => (
                      <tr key={op._id} className="group hover:bg-white/5 transition-colors">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-[#ffd88d]/10 flex items-center justify-center text-[#ffd88d] font-black text-xs border border-[#ffd88d]/20">
                                 {op.name[0]}
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-white uppercase tracking-tight">{op.name}</p>
                                 <p className="text-[10px] font-medium text-white/40 tracking-wider lowercase">{op.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#ffe2b5]">{op.department || "UNASSIGNED"}</p>
                           <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">{op.position || "STAFF"}</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              {op.emailVerified ? (
                                <CheckCircle2 size={12} className="text-green-500" />
                              ) : (
                                <AlertCircle size={12} className="text-amber-500" />
                              )}
                              <span className={`text-[10px] font-black uppercase tracking-widest ${op.emailVerified ? "text-green-500/80" : "text-amber-500/80"}`}>
                                 {op.emailVerified ? "VERIFIED" : "PENDING"}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-[11px] font-bold text-white/40">
                           {new Date(op.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button 
                             onClick={() => handleResetPassword(op._id, op.name)}
                             className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-white hover:border-[#ffd88d]/40 hover:bg-[#ffd88d]/10 transition-all"
                           >
                             <Key size={14} className="text-[#ffd88d]" />
                             Reset Access
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
