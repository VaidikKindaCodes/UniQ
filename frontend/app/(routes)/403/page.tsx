"use client";

import { toastBus } from "@/app/utils/toastBus";
import Link from "next/link";
import { useEffect } from "react";

export default function ForbiddenPage() {
  useEffect(() => {
    toastBus.error("Role access denied");
  }, []);

  return (
    <main className="app-shell flex min-h-screen items-center justify-center px-4">
      <div className="dashboard-panel-dark max-w-lg w-full rounded-[2rem] p-8 text-center text-white">
        <p className="mb-2 text-lg font-semibold text-[#ffd88d]">Access denied</p>
        <p className="mb-6 text-[#ffe2b5]/72">
          You don&apos;t have permission to view this page. If you think this is a mistake,
          please sign in with an account that has the right role.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-[#ffd88d] px-4 py-2 font-semibold text-[#4b1d08] transition-colors hover:bg-[#f1bf63]"
          >
            Go to login
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/12 bg-white/6 px-4 py-2 font-semibold text-[#fff4df] transition-colors hover:bg-white/10"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
