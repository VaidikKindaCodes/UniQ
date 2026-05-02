// "use client";
// export const dynamic = "force-dynamic";

// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { useAuth , UserRole} from "../../../context/AuthContext";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { ArrowRight, Lock, ShieldCheck, User } from "lucide-react";

// type AuthUser = {
//   id: string;
//   email: string;
//   role: string;
//   emailVerified: boolean;
//   name: string;
// };

// type AcceptInviteResponse = {
//   message?: string;
//   token: string;
//   user: AuthUser & { role: string }; // backend sends string
// };
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// function BrandMark() {
//   return (
//     <Link href="/" className="flex items-center gap-3">
//       <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 bg-white/10 text-sm font-black text-white">
//         U
//       </div>
//       <div>
//         <span className="block text-xl font-semibold uppercase tracking-[0.24em] text-white">
//           UNIQ
//         </span>
//         <span className="block text-[10px] uppercase tracking-[0.38em] text-[#ffe2b5]/78">
//           Campus Flow
//         </span>
//       </div>
//     </Link>
//   );
// }

// export default function AcceptInvitePage() {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const { login } = useAuth();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const token = searchParams.get("token");
//   const email = searchParams.get("email");

//   useEffect(() => {
//     if (!token || !email) {
//       setError("Invalid invitation link. Missing token or email.");
//     }
//   }, [token, email]);

//   const handleAccept = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     if (!token || !email) {
//       setError("Missing invitation details");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/auth/admin/accept-invite`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, token, name, password }),
//       });

//       const data: AcceptInviteResponse = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to accept invite");
//       }

//       const role = data.user.role as UserRole;

// login(data.token, {
//   ...data.user,
//   name: data.user.name || "User",
//   role,
// })
//       router.replace("/admin");
//     } catch (err: unknown) {
//       setError(err instanceof Error ? err.message : "Failed to accept invite");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!token || !email) {
//     return (
//       <main className="app-shell flex min-h-screen items-center justify-center px-4">
//         <div className="dashboard-panel-dark max-w-md w-full rounded-[2rem] p-8 text-center text-white">
//           <h1 className="mb-4 text-2xl font-bold text-red-300">Invalid Invitation</h1>
//           <p className="mb-6 text-[#ffe2b5]/72">
//             The invitation link is missing required information.
//           </p>
//           <Link href="/login" className="text-[#ffd88d] hover:text-white">
//             Go to Login
//           </Link>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen overflow-x-hidden bg-[#180902] text-white">
//       <div className="relative z-10 mx-auto max-w-xl p-8">
//         <form onSubmit={handleAccept}>
//           {error && <p className="text-red-400 mb-4">{error}</p>}

//           <input
//             type="text"
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Confirm Password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />

//           <button type="submit" disabled={isLoading}>
//             {isLoading ? "Loading..." : "Accept Invite"}
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }

"use client";

import { Suspense } from "react";
import AcceptInviteContent from "./AcceptInviteContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AcceptInviteContent />
    </Suspense>
  );
}